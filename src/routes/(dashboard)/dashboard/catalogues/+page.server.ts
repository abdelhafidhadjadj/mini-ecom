import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const catalogues = await query(`
    SELECT
      c.id, c.nom, c.slug, c.description,
      c.ordre, c.actif, c.created_at,
      COUNT(cat.id) AS nb_categories
    FROM catalogues c
    LEFT JOIN categories cat ON cat.catalogue_id = c.id
    GROUP BY c.id
    ORDER BY c.ordre ASC, c.created_at DESC
  `);

  return { catalogues };
};

export const actions: Actions = {

  // ─── Supprimer un catalogue ────────────────────────────
  delete: async ({ request }) => {
    const data = await request.formData();
    const id   = parseInt(data.get('id')?.toString() ?? '');

    if (isNaN(id)) {
      return fail(400, { error: 'Invalid ID' });
    }

    try {
      await query('DELETE FROM catalogues WHERE id = $1', [id]);
      return { success: true };
    } catch (err: any) {
      return fail(500, { error: 'Cannot delete — catalog has categories' });
    }
  },

  // ─── Toggle actif/inactif ──────────────────────────────
  toggle: async ({ request }) => {
    const data  = await request.formData();
    const id    = parseInt(data.get('id')?.toString() ?? '');
    const actif = data.get('actif') === 'true';

    if (isNaN(id)) return fail(400, { error: 'Invalid ID' });

    await query(
      'UPDATE catalogues SET actif = $1 WHERE id = $2',
      [!actif, id]
    );

    return { success: true };
  },
};