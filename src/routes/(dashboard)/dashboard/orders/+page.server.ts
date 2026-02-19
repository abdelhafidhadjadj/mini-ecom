import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
  const statut  = url.searchParams.get('statut') ?? '';
  const search  = url.searchParams.get('search') ?? '';
  const type    = url.searchParams.get('type') ?? ''; // 'b2b' | 'b2c' | ''
  const page    = parseInt(url.searchParams.get('page') ?? '1');
  const limit   = 15;
  const offset  = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[]        = [];
  let   paramIndex           = 1;

  if (statut) {
    conditions.push(`c.statut = $${paramIndex++}`);
    params.push(statut);
  }

  if (search) {
    conditions.push(`(
      c.client_nom       ILIKE $${paramIndex}   OR
      c.client_telephone ILIKE $${paramIndex}   OR
      c.client_wilaya    ILIKE $${paramIndex}   OR
      b.nom_entreprise   ILIKE $${paramIndex++}
    )`);
    params.push(`%${search}%`);
  }

  if (type === 'b2b') {
    conditions.push(`c.client_b2b_id IS NOT NULL`);
  } else if (type === 'b2c') {
    conditions.push(`c.client_b2b_id IS NULL`);
  }

  const where = conditions.length > 0
    ? 'WHERE ' + conditions.join(' AND ')
    : '';

  const [commandes, countResult, stats] = await Promise.all([

    query(`
      SELECT
        c.id, c.client_nom, c.client_telephone,
        c.client_wilaya, c.total, c.statut,
        c.whatsapp_entreprise_sent,
        c.created_at,
        c.client_b2b_id,
        b.nom_entreprise,
        tc.nom AS type_client_nom,
        tc.code AS type_client_code
      FROM commandes c
      LEFT JOIN clients_b2b b  ON b.id  = c.client_b2b_id
      LEFT JOIN types_client tc ON tc.id = c.type_prix_applique
      ${where}
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, limit, offset]),

    query(`
      SELECT COUNT(*) as total
      FROM commandes c
      LEFT JOIN clients_b2b b ON b.id = c.client_b2b_id
      ${where}
    `, params),

    query(`
      SELECT
        COUNT(*)                                              AS total,
        COUNT(*) FILTER (WHERE c.statut = 'en_attente')     AS en_attente,
        COUNT(*) FILTER (WHERE c.statut = 'confirmee')      AS confirmee,
        COUNT(*) FILTER (WHERE c.statut = 'en_preparation') AS en_preparation,
        COUNT(*) FILTER (WHERE c.statut = 'expedie')        AS expedie,
        COUNT(*) FILTER (WHERE c.statut = 'livre')          AS livre,
        COUNT(*) FILTER (WHERE c.statut = 'annulee')        AS annulee,
        COUNT(*) FILTER (WHERE c.client_b2b_id IS NOT NULL) AS b2b,
        COUNT(*) FILTER (WHERE c.client_b2b_id IS NULL)     AS b2c
      FROM commandes c
    `),

  ]);

  return {
    commandes,
    total:  parseInt(countResult[0].total),
    page,
    limit,
    statut,
    search,
    type,
    stats:  stats[0],
  };
};