import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const [categories, catalogues] = await Promise.all([

    query(`
      SELECT
        cat.id, cat.nom, cat.slug,
        cat.ordre, cat.actif, cat.created_at,
        c.nom AS catalogue_nom, c.id AS catalogue_id,
        COUNT(p.id) AS nb_produits
      FROM categories cat
      JOIN catalogues c ON c.id = cat.catalogue_id
      LEFT JOIN produits p ON p.categorie_id = cat.id
      GROUP BY cat.id, c.id
      ORDER BY c.ordre ASC, cat.ordre ASC
    `),

    query(`
      SELECT id, nom FROM catalogues
      WHERE actif = TRUE
      ORDER BY ordre ASC
    `),

  ]);

  return { categories, catalogues };
};

export const actions: Actions = {

  delete: async ({ request }) => {
    const data = await request.formData();
    const id   = parseInt(data.get('id')?.toString() ?? '');

    if (isNaN(id)) return fail(400, { error: 'Invalid ID' });

    try {
      await query('DELETE FROM categories WHERE id = $1', [id]);
      return { success: true };
    } catch {
      return fail(500, { error: 'Cannot delete — category has products' });
    }
  },

  toggle: async ({ request }) => {
    const data  = await request.formData();
    const id    = parseInt(data.get('id')?.toString() ?? '');
    const actif = data.get('actif') === 'true';

    if (isNaN(id)) return fail(400, { error: 'Invalid ID' });

    await query(
      'UPDATE categories SET actif = $1 WHERE id = $2',
      [!actif, id]
    );

    return { success: true };
  },

};