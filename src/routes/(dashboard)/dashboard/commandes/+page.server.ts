import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
  const statut  = url.searchParams.get('statut') ?? '';
  const search  = url.searchParams.get('search') ?? '';
  const page    = parseInt(url.searchParams.get('page') ?? '1');
  const limit   = 15;
  const offset  = (page - 1) * limit;

  // Construction des conditions WHERE
  const conditions: string[] = [];
  const params: any[]        = [];
  let   paramIndex           = 1;

  if (statut) {
    conditions.push(`statut = $${paramIndex++}`);
    params.push(statut);
  }

  if (search) {
    conditions.push(`(
      client_nom       ILIKE $${paramIndex}   OR
      client_telephone ILIKE $${paramIndex}   OR
      client_wilaya    ILIKE $${paramIndex++}
    )`);
    params.push(`%${search}%`);
  }

  const where = conditions.length > 0
    ? 'WHERE ' + conditions.join(' AND ')
    : '';

  const [commandes, countResult] = await Promise.all([
    query(`
      SELECT
        id, client_nom, client_telephone,
        client_wilaya, total, statut,
        whatsapp_entreprise_sent,
        created_at
      FROM commandes
      ${where}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, limit, offset]),

    query(`
      SELECT COUNT(*) as total
      FROM commandes
      ${where}
    `, params),
  ]);

  // Stats rapides pour les filtres
  const stats = await query(`
    SELECT
      COUNT(*)                                           AS total,
      COUNT(*) FILTER (WHERE statut = 'en_attente')     AS en_attente,
      COUNT(*) FILTER (WHERE statut = 'confirmee')      AS confirmee,
      COUNT(*) FILTER (WHERE statut = 'en_preparation') AS en_preparation,
      COUNT(*) FILTER (WHERE statut = 'expedie')        AS expedie,
      COUNT(*) FILTER (WHERE statut = 'livre')          AS livre,
      COUNT(*) FILTER (WHERE statut = 'annulee')        AS annulee
    FROM commandes
  `);

  return {
    commandes,
    total:    parseInt(countResult[0].total),
    page,
    limit,
    statut,
    search,
    stats:    stats[0],
  };
};