import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, url }) => {
  const typeClientId = locals.userB2B!.type_client_id;
  
  const search = url.searchParams.get('search') ?? '';
  const catalogue = url.searchParams.get('catalogue') ?? '';
  const categorie = url.searchParams.get('categorie') ?? '';
  const sort = url.searchParams.get('sort') ?? 'nom_asc';
  
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const limit = 24;
  const offset = (page - 1) * limit;

  const conditions: string[] = ['p.actif = TRUE'];
  const params: any[] = [];
  let paramIndex = 1;

  if (search) {
    conditions.push(`(
      p.nom ILIKE $${paramIndex} OR
      p.reference ILIKE $${paramIndex}
    )`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (categorie) {
    conditions.push(`c.slug = $${paramIndex}`);
    params.push(categorie);
    paramIndex++;
  } else if (catalogue) {
    conditions.push(`cat.slug = $${paramIndex}`);
    params.push(catalogue);
    paramIndex++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');

  // Ordre
  const orderMap: Record<string, string> = {
    nom_asc: 'p.nom ASC',
    nom_desc: 'p.nom DESC',
    prix_asc: 'pc.prix ASC',
    prix_desc: 'pc.prix DESC',
    recent: 'p.created_at DESC',
  };
  const orderBy = orderMap[sort] || 'p.nom ASC';

  const [produits, countResult, catalogues, categories] = await Promise.all([

    // Query produits avec prix B2B
    query(`
      SELECT
        p.id, p.nom, p.slug, p.reference,
        p.unite_vente, p.description,
        c.nom AS categorie_nom, c.slug AS categorie_slug,
        cat.nom AS catalogue_nom,
        COALESCE(pc.prix, p.prix) AS prix,
        (
          SELECT url FROM produit_images
          WHERE produit_id = p.id AND principale = TRUE
          LIMIT 1
        ) AS image_principale
      FROM produits p
      JOIN categories c ON c.id = p.categorie_id
      JOIN catalogues cat ON cat.id = c.catalogue_id
      LEFT JOIN prix_client pc ON pc.produit_id = p.id AND pc.type_client_id = $${paramIndex}
      ${where}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}
    `, [typeClientId, ...params, limit, offset]),

    // Count - utilise les mêmes params SANS typeClientId/limit/offset
    query(`
      SELECT COUNT(*) as total
      FROM produits p
      JOIN categories c ON c.id = p.categorie_id
      JOIN catalogues cat ON cat.id = c.catalogue_id
      ${where}
    `, params),

    // Catalogues
    query(`
      SELECT id, nom, slug
      FROM catalogues
      WHERE actif = TRUE
      ORDER BY ordre ASC
    `),

    // Categories
    query(`
      SELECT id, nom, slug
      FROM categories
      WHERE actif = TRUE
      ORDER BY nom ASC
    `),

  ]);

  return {
    produits,
    total: parseInt(countResult[0].total),
    page,
    limit,
    search,
    catalogue,
    categorie,
    sort,
    catalogues,
    categories,
  };
};