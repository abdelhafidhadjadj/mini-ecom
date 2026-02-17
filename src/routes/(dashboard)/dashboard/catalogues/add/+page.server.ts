import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
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

    // ─── Vérifier slug unique ──────────────────────────────
    const existing = await query(
      'SELECT id FROM catalogues WHERE slug = $1',
      [slug]
    );

    if (existing.length > 0) {
      return fail(400, {
        error: 'This slug is already taken',
        nom, slug, description, ordre, actif,
      });
    }

    // ─── Insérer ───────────────────────────────────────────
    try {
      await query(
        `INSERT INTO catalogues (nom, slug, description, ordre, actif)
         VALUES ($1, $2, $3, $4, $5)`,
        [nom, slug, description, ordre, actif]
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