import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
  const search     = url.searchParams.get('search')    ?? '';
  const catalogue  = url.searchParams.get('catalogue') ?? '';
  const categorie  = url.searchParams.get('categorie') ?? '';
  const sort       = url.searchParams.get('sort')      ?? 'newest';
  const page       = parseInt(url.searchParams.get('page') ?? '1');
  const limit      = 20;
  const offset     = (page - 1) * limit;

  const conditions: string[] = ['p.actif = TRUE'];
  const params: any[]        = [];
  let   paramIndex           = 1;

  if (search) {
    conditions.push(`p.nom ILIKE $${paramIndex++}`);
    params.push(`%${search}%`);
  }

  if (catalogue) {
    conditions.push(`cat.slug = $${paramIndex++}`);
    params.push(catalogue);
  }

  if (categorie) {
    conditions.push(`cate.slug = $${paramIndex++}`);
    params.push(categorie);
  }

  const where = 'WHERE ' + conditions.join(' AND ');

  const orderBy = {
    newest:     'p.created_at DESC',
    oldest:     'p.created_at ASC',
    price_asc:  'p.prix ASC',
    price_desc: 'p.prix DESC',
    name:       'p.nom ASC',
  }[sort] ?? 'p.created_at DESC';

  const [produits, countResult, catalogues, categories] = await Promise.all([

    // produits → categories → catalogues (pas de catalogue_id direct sur produits)
    query(`
      SELECT
        p.id, p.nom, p.slug, p.prix, p.stock, p.unite_vente AS unite,
        cat.nom  AS catalogue_nom,
        cat.slug AS catalogue_slug,
        cate.nom  AS categorie_nom,
        cate.slug AS categorie_slug,
        pi.url   AS image_url
      FROM produits p
      LEFT JOIN categories cate   ON cate.id  = p.categorie_id
      LEFT JOIN catalogues cat    ON cat.id   = cate.catalogue_id
      LEFT JOIN produit_images pi ON pi.produit_id = p.id AND pi.principale = TRUE
      ${where}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, limit, offset]),

    query(`
      SELECT COUNT(*) AS total
      FROM produits p
      LEFT JOIN categories cate ON cate.id = p.categorie_id
      LEFT JOIN catalogues cat  ON cat.id  = cate.catalogue_id
      ${where}
    `, params),

    query(`SELECT id, nom, slug FROM catalogues ORDER BY nom ASC`),
    query(`SELECT id, nom, slug FROM categories ORDER BY nom ASC`),

  ]);

  return {
    produits,
    total:      parseInt(countResult[0].total),
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