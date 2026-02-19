import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const [produits, variantes, images, similaires] = await Promise.all([

    // Produit principal — catalogue via categories
    query(`
      SELECT
        p.id, p.nom, p.slug, p.description,
        p.prix, p.stock, p.stock_minimum,
        p.unite_vente AS unite,
        p.reference, p.actif,
        cat.nom   AS catalogue_nom,
        cat.slug  AS catalogue_slug,
        cate.nom  AS categorie_nom,
        cate.slug AS categorie_slug,
        cate.id   AS categorie_id
      FROM produits p
      LEFT JOIN categories cate ON cate.id = p.categorie_id
      LEFT JOIN catalogues cat  ON cat.id  = cate.catalogue_id
      WHERE p.slug = $1 AND p.actif = TRUE
    `, [slug]),

    // Variantes — table "variantes" (pas variantes_produit)
    query(`
      SELECT id, nom, prix_supplement, stock
      FROM variantes
      WHERE produit_id = (
        SELECT id FROM produits WHERE slug = $1
      )
      AND actif = TRUE
      ORDER BY id ASC
    `, [slug]),

    // Images
    query(`
      SELECT id, url, principale, ordre
      FROM produit_images
      WHERE produit_id = (
        SELECT id FROM produits WHERE slug = $1
      )
      ORDER BY principale DESC, ordre ASC
    `, [slug]),

    // Produits similaires (même catégorie)
    query(`
      SELECT
        p.id, p.nom, p.slug, p.prix,
        p.stock, p.unite_vente AS unite,
        cate.nom AS categorie_nom,
        pi.url AS image_url
      FROM produits p
      LEFT JOIN categories cate     ON cate.id = p.categorie_id
      LEFT JOIN produit_images pi   ON pi.produit_id = p.id AND pi.principale = TRUE
      WHERE p.categorie_id = (
        SELECT categorie_id FROM produits WHERE slug = $1
      )
      AND p.slug != $1
      AND p.actif = TRUE
      LIMIT 4
    `, [slug]),

  ]);

  if (!produits[0]) throw error(404, 'Produit introuvable');

  return {
    produit:   produits[0],
    variantes,
    images,
    similaires,
  };
};