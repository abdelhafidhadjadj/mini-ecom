import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async () => {

  const [featuredProducts, statsResult, catalogues] = await Promise.all([

    query(`
      SELECT
        p.id, p.nom, p.slug, p.prix,
        p.stock,
        p.unite_vente AS unite,
        cate.nom  AS categorie_nom,
        cate.slug AS categorie_slug,
        pi.url    AS image_url
      FROM produits p
      LEFT JOIN categories cate   ON cate.id = p.categorie_id
      LEFT JOIN produit_images pi ON pi.produit_id = p.id AND pi.principale = TRUE
      WHERE p.actif = TRUE
      ORDER BY p.created_at DESC
      LIMIT 8
    `),

    query(`
      SELECT
        (SELECT COUNT(*) FROM produits   WHERE actif = TRUE) AS total_products,
        (SELECT COUNT(*) FROM categories)                    AS total_categories,
        (SELECT COUNT(*) FROM catalogues WHERE actif = TRUE) AS total_catalogs
    `),

    query(`
      SELECT
        cat.id, cat.nom, cat.slug, cat.description,
        COUNT(p.id) AS product_count
      FROM catalogues cat
      LEFT JOIN categories cate ON cate.catalogue_id = cat.id
      LEFT JOIN produits p      ON p.categorie_id = cate.id AND p.actif = TRUE
      WHERE cat.actif = TRUE
      GROUP BY cat.id
      ORDER BY cat.ordre ASC
      LIMIT 4
    `),

  ]);

  return {
    featuredProducts,
    stats:     statsResult[0],
    catalogues,
  };
};