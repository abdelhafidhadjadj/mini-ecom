import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { query, withTransaction } from '$lib/server/db';
import { rename, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOADS_DIR = '/app/uploads';

// ─── Déplacer images temp dans le HTML de description ────
async function migrateDescriptionImages(
  html: string,
  produitId: number
): Promise<string> {
  const destDir = path.join(UPLOADS_DIR, 'products', String(produitId));
  if (!existsSync(destDir)) await mkdir(destDir, { recursive: true });

  const regex = /\/uploads\/products\/temp\/([^"']+)/g;
  let result = html;
  const matches = [...html.matchAll(regex)];

  for (const match of matches) {
    const filename = match[1];
    const src  = path.join(UPLOADS_DIR, 'products', 'temp', filename);
    const dest = path.join(destDir, filename);

    if (existsSync(src)) {
      await rename(src, dest);
    }

    result = result.replace(
      `/uploads/products/temp/${filename}`,
      `/uploads/products/${produitId}/${filename}`
    );
  }

  return result;
}

export const load: PageServerLoad = async () => {
  const categories = await query(`
    SELECT
      c.id, c.nom,
      cat.nom AS catalogue_nom
    FROM categories c
    JOIN catalogues cat ON cat.id = c.catalogue_id
    WHERE c.actif = TRUE
    ORDER BY cat.ordre ASC, c.ordre ASC
  `);

  return { categories };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    // ─── Champs principaux ────────────────────────────────
    const nom           = data.get('nom')?.toString().trim();
    const slug          = data.get('slug')?.toString().trim();
    const description   = data.get('description')?.toString().trim() ?? '';
    const reference     = data.get('reference')?.toString().trim() ?? '';
    const categorie_id  = parseInt(data.get('categorie_id')?.toString() ?? '');
    const prix          = parseFloat(data.get('prix')?.toString() ?? '0');
    const unite_vente   = data.get('unite_vente')?.toString() ?? 'pièce';
    const stock         = parseInt(data.get('stock')?.toString() ?? '0');
    const stock_minimum = parseInt(data.get('stock_minimum')?.toString() ?? '5');
    const actif         = data.get('actif') === 'true';

    // Prix B2B
    const prix_revendeur_input       = data.get('prix_revendeur')?.toString();
    const prix_grossiste_input       = data.get('prix_grossiste')?.toString();
    const prix_super_grossiste_input = data.get('prix_super_grossiste')?.toString();

    // ─── Validation ───────────────────────────────────────
    if (!nom || !slug)
      return fail(400, { error: 'Name and slug are required' });

    if (isNaN(categorie_id))
      return fail(400, { error: 'Please select a category' });

    if (prix <= 0)
      return fail(400, { error: 'Price must be greater than 0' });

    if (!/^[a-z0-9-]+$/.test(slug))
      return fail(400, { error: 'Invalid slug format' });

    // ─── Vérifier slug unique ─────────────────────────────
    const existing = await query('SELECT id FROM produits WHERE slug = $1', [slug]);
    if (existing.length > 0)
      return fail(400, { error: 'This slug is already taken' });

    // ─── Variantes ────────────────────────────────────────
    const variantsCount = parseInt(data.get('variants_count')?.toString() ?? '0');
    const variants = [];

    for (let i = 0; i < variantsCount; i++) {
      const vNom = data.get(`variant_nom_${i}`)?.toString().trim();
      if (!vNom) continue;
      variants.push({
        nom:             vNom,
        reference:       data.get(`variant_reference_${i}`)?.toString().trim() ?? '',
        prix_supplement: parseFloat(data.get(`variant_prix_${i}`)?.toString() ?? '0'),
        stock:           parseInt(data.get(`variant_stock_${i}`)?.toString() ?? '0'),
        actif:           data.get(`variant_actif_${i}`) !== 'false',
      });
    }

    // ─── Images galerie ───────────────────────────────────
    const imagesCount = parseInt(data.get('images_count')?.toString() ?? '0');
    const images = [];

    for (let i = 0; i < imagesCount; i++) {
      const url = data.get(`image_url_${i}`)?.toString();
      if (!url) continue;
      images.push({
        url,
        ordre:      parseInt(data.get(`image_ordre_${i}`)?.toString() ?? '0'),
        principale: data.get(`image_principale_${i}`) === 'true',
      });
    }

    // ─── Transaction DB ───────────────────────────────────
    try {
      await withTransaction(async (client) => {

        // 1. Insérer produit (description provisoire)
        const result = await client.query(
          `INSERT INTO produits
             (nom, slug, description, reference, categorie_id,
              prix, unite_vente, stock, stock_minimum, actif)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
           RETURNING id`,
          [nom, slug, description, reference, categorie_id,
           prix, unite_vente, stock, stock_minimum, actif]
        );

        const produitId: number = result.rows[0].id;

        // 2. Migrer images de la description temp → products/{id}
        const descriptionFinale = await migrateDescriptionImages(description, produitId);

        // 3. Mettre à jour la description avec les URLs finales
        if (descriptionFinale !== description) {
          await client.query(
            'UPDATE produits SET description = $1 WHERE id = $2',
            [descriptionFinale, produitId]
          );
        }

        // 4. Insérer prix B2B
        const typesClient = await client.query(
          'SELECT id, code FROM types_client ORDER BY ordre ASC'
        );

        for (const tc of typesClient.rows) {
          let prixB2B: number;

          if (tc.code === 'public') {
            prixB2B = prix;
          } else if (tc.code === 'revendeur') {
            prixB2B = prix_revendeur_input
              ? parseFloat(prix_revendeur_input)
              : Math.round(prix * 0.90 * 100) / 100;
          } else if (tc.code === 'grossiste') {
            prixB2B = prix_grossiste_input
              ? parseFloat(prix_grossiste_input)
              : Math.round(prix * 0.80 * 100) / 100;
          } else if (tc.code === 'super_grossiste') {
            prixB2B = prix_super_grossiste_input
              ? parseFloat(prix_super_grossiste_input)
              : Math.round(prix * 0.70 * 100) / 100;
          } else {
            prixB2B = prix;
          }

          await client.query(
            `INSERT INTO prix_client (produit_id, type_client_id, prix)
             VALUES ($1, $2, $3)`,
            [produitId, tc.id, prixB2B]
          );
        }

        // 5. Insérer variantes
        for (const v of variants) {
          await client.query(
            `INSERT INTO variantes
               (produit_id, nom, reference, prix_supplement, stock, actif)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            [produitId, v.nom, v.reference, v.prix_supplement, v.stock, v.actif]
          );
        }

        // 6. Déplacer images galerie temp → products/{id} et insérer en BDD
        const destDir = path.join(UPLOADS_DIR, 'products', String(produitId));
        if (!existsSync(destDir)) await mkdir(destDir, { recursive: true });

        for (const img of images) {
          let finalUrl = img.url;

          if (img.url.startsWith('/uploads/products/temp/')) {
            const filename = path.basename(img.url);
            const src  = path.join(UPLOADS_DIR, 'products', 'temp', filename);
            const dest = path.join(destDir, filename);

            if (existsSync(src)) {
              await rename(src, dest);
            }

            finalUrl = `/uploads/products/${produitId}/${filename}`;
          }

          await client.query(
            `INSERT INTO produit_images (produit_id, url, ordre, principale)
             VALUES ($1, $2, $3, $4)`,
            [produitId, finalUrl, img.ordre, img.principale]
          );
        }

      });

    } catch (err: any) {
      console.error('[Product] Create error:', err.message);
      return fail(500, { error: 'Server error, please try again' });
    }

    throw redirect(302, '/dashboard/products');
  },
};