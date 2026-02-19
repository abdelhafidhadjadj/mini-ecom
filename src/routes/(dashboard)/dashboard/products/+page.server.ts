import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  const search     = url.searchParams.get('search') ?? '';
  const categorie  = url.searchParams.get('categorie') ?? '';
  const actif      = url.searchParams.get('actif') ?? '';
  const page       = parseInt(url.searchParams.get('page') ?? '1');
  const limit      = 15;
  const offset     = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[]        = [];
  let   paramIndex           = 1;

  if (search) {
    conditions.push(`(
      p.nom       ILIKE $${paramIndex} OR
      p.reference ILIKE $${paramIndex++}
    )`);
    params.push(`%${search}%`);
  }

  if (categorie) {
    conditions.push(`p.categorie_id = $${paramIndex++}`);
    params.push(parseInt(categorie));
  }

  if (actif !== '') {
    conditions.push(`p.actif = $${paramIndex++}`);
    params.push(actif === 'true');
  }

  const where = conditions.length > 0
    ? 'WHERE ' + conditions.join(' AND ')
    : '';

  const [produits, countResult, categories] = await Promise.all([

    query(`
      SELECT
        p.id, p.nom, p.slug, p.reference,
        p.prix, p.unite_vente, p.stock,
        p.stock_minimum, p.actif, p.created_at,
        c.nom AS categorie_nom,
        COUNT(v.id) AS nb_variantes,
        (
          SELECT url FROM produit_images
          WHERE produit_id = p.id AND principale = TRUE
          LIMIT 1
        ) AS image_principale
      FROM produits p
      JOIN categories c ON c.id = p.categorie_id
      LEFT JOIN variantes v ON v.produit_id = p.id
      ${where}
      GROUP BY p.id, c.nom
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, limit, offset]),

    query(`
      SELECT COUNT(*) as total
      FROM produits p
      ${where}
    `, params),

    query(`
      SELECT id, nom FROM categories
      WHERE actif = TRUE
      ORDER BY nom ASC
    `),

  ]);

  return {
    produits,
    total:      parseInt(countResult[0].total),
    page,
    limit,
    search,
    categorie,
    actif,
    categories,
  };
};

export const actions: Actions = {

  delete: async ({ request }) => {
    const data = await request.formData();
    const id   = parseInt(data.get('id')?.toString() ?? '');

    if (isNaN(id)) return fail(400, { error: 'Invalid ID' });

    try {
      await query('DELETE FROM produits WHERE id = $1', [id]);
      return { success: true };
    } catch (err: any) {
      return fail(500, { error: 'Cannot delete this product' });
    }
  },

  toggle: async ({ request }) => {
    const data  = await request.formData();
    const id    = parseInt(data.get('id')?.toString() ?? '');
    const actif = data.get('actif') === 'true';

    if (isNaN(id)) return fail(400, { error: 'Invalid ID' });

    await query(
      'UPDATE produits SET actif = $1 WHERE id = $2',
      [!actif, id]
    );

    return { success: true };
  },

};