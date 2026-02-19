import type { LayoutServerLoad } from './$types';
import { query } from '$lib/server/db';

export const load: LayoutServerLoad = async () => {
  const catalogues = await query(`
    SELECT
      c.id, c.nom, c.slug,
      json_agg(
        json_build_object(
          'id', cat.id,
          'nom', cat.nom,
          'slug', cat.slug
        ) ORDER BY cat.ordre ASC
      ) FILTER (WHERE cat.id IS NOT NULL) AS categories
    FROM catalogues c
    LEFT JOIN categories cat ON cat.catalogue_id = c.id AND cat.actif = TRUE
    WHERE c.actif = TRUE
    GROUP BY c.id
    ORDER BY c.ordre ASC
  `);

  return { catalogues };
};