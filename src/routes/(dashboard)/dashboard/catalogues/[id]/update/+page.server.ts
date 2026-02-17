import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
  const id = parseInt(params.id);

  if (isNaN(id)) throw error(404, 'Catalog not found');

  const catalogs = await query(
    `SELECT id, nom, slug, description, ordre, actif
     FROM catalogues WHERE id = $1`,
    [id]
  );

  if (!catalogs[0]) throw error(404, 'Catalog not found');

  return { catalog: catalogs[0] };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const id          = parseInt(params.id);
    const data        = await request.formData();
    const nom         = data.get('nom')?.toString().trim();
    const slug        = data.get('slug')?.toString().trim();
    const description = data.get('description')?.toString().trim() ?? '';
    const ordre       = parseInt(data.get('ordre')?.toString() ?? '0');
    const actif       = data.get('actif') === 'true';

    // ─── Validation ────────────────────────────────────────
    if (!nom || !slug) {
      return fail(400, {
        error: 'Name and slug are required',
        nom, slug, description, ordre, actif,
      });
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return fail(400, {
        error: 'Slug can only contain lowercase letters, numbers and hyphens',
        nom, slug, description, ordre, actif,
      });
    }

    // ─── Vérifier slug unique (sauf pour ce catalogue) ─────
    const existing = await query(
      'SELECT id FROM catalogues WHERE slug = $1 AND id != $2',
      [slug, id]
    );

    if (existing.length > 0) {
      return fail(400, {
        error: 'This slug is already taken',
        nom, slug, description, ordre, actif,
      });
    }

    // ─── Mettre à jour ─────────────────────────────────────
    try {
      await query(
        `UPDATE catalogues
         SET nom = $1, slug = $2, description = $3, ordre = $4, actif = $5
         WHERE id = $6`,
        [nom, slug, description, ordre, actif, id]
      );
    } catch (err: any) {
      return fail(500, {
        error: 'Server error, please try again',
        nom, slug, description, ordre, actif,
      });
    }

    throw redirect(302, '/dashboard/catalogues');
  },
};