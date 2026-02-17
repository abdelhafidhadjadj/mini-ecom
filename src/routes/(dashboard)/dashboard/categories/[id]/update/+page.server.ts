import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
  const id = parseInt(params.id);

  if (isNaN(id)) throw error(404, 'Category not found');

  const [categories, catalogues] = await Promise.all([
    query(
      `SELECT id, nom, slug, description, catalogue_id, ordre, actif
       FROM categories WHERE id = $1`,
      [id]
    ),
    query(
      `SELECT id, nom FROM catalogues
       WHERE actif = TRUE ORDER BY ordre ASC`
    ),
  ]);

  if (!categories[0]) throw error(404, 'Category not found');

  return {
    category:   categories[0],
    catalogues,
  };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const id          = parseInt(params.id);
    const data        = await request.formData();
    const nom         = data.get('nom')?.toString().trim();
    const slug        = data.get('slug')?.toString().trim();
    const description = data.get('description')?.toString().trim() ?? '';
    const catalogue_id = parseInt(data.get('catalogue_id')?.toString() ?? '');
    const ordre       = parseInt(data.get('ordre')?.toString() ?? '0');
    const actif       = data.get('actif') === 'true';

    // ─── Validation ────────────────────────────────────────
    if (!nom || !slug) {
      return fail(400, {
        error: 'Name and slug are required',
        nom, slug, description, catalogue_id, ordre, actif,
      });
    }

    if (isNaN(catalogue_id)) {
      return fail(400, {
        error: 'Please select a parent catalog',
        nom, slug, description, catalogue_id, ordre, actif,
      });
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return fail(400, {
        error: 'Slug can only contain lowercase letters, numbers and hyphens',
        nom, slug, description, catalogue_id, ordre, actif,
      });
    }

    // ─── Vérifier slug unique (sauf cette catégorie) ───────
    const existing = await query(
      'SELECT id FROM categories WHERE slug = $1 AND id != $2',
      [slug, id]
    );

    if (existing.length > 0) {
      return fail(400, {
        error: 'This slug is already taken',
        nom, slug, description, catalogue_id, ordre, actif,
      });
    }

    // ─── Mettre à jour ─────────────────────────────────────
    try {
      await query(
        `UPDATE categories
         SET nom = $1, slug = $2, description = $3,
             catalogue_id = $4, ordre = $5, actif = $6
         WHERE id = $7`,
        [nom, slug, description, catalogue_id, ordre, actif, id]
      );
    } catch (err: any) {
      return fail(500, {
        error: 'Server error, please try again',
        nom, slug, description, catalogue_id, ordre, actif,
      });
    }

    throw redirect(302, '/dashboard/categories');
  },
};