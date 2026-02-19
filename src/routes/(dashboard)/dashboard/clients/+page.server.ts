import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
  const type   = url.searchParams.get('type')   ?? 'b2b';
  const search = url.searchParams.get('search') ?? '';
  const statut = url.searchParams.get('statut') ?? '';
  const page   = parseInt(url.searchParams.get('page') ?? '1');
  const limit  = 15;
  const offset = (page - 1) * limit;

  // ─── Stats globales — toujours chargées ──────────────────
  const [statsB2BResult, statsB2CResult] = await Promise.all([
    query(`
      SELECT
        COUNT(*)                                       AS total,
        COUNT(*) FILTER (WHERE statut = 'en_attente') AS en_attente,
        COUNT(*) FILTER (WHERE statut = 'approuve')   AS approuve
      FROM clients_b2b
    `),
    query(`
      SELECT COUNT(DISTINCT client_telephone) AS total
      FROM commandes
      WHERE client_b2b_id IS NULL
    `),
  ]);

  const statsB2B = statsB2BResult[0];
  const statsB2C = statsB2CResult[0];

  let clients: any[] = [];
  let total          = 0;

  if (type === 'b2b') {
    // ─── Clients B2B ────────────────────────────────────────
    const conditions: string[] = [];
    const params: any[]        = [];
    let   paramIndex           = 1;

    if (statut) {
      conditions.push(`b.statut = $${paramIndex++}`);
      params.push(statut);
    }

    if (search) {
      conditions.push(`(
        b.nom_entreprise ILIKE $${paramIndex} OR
        b.contact_nom    ILIKE $${paramIndex} OR
        b.email          ILIKE $${paramIndex} OR
        b.telephone      ILIKE $${paramIndex++}
      )`);
      params.push(`%${search}%`);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const [rows, count] = await Promise.all([
      query(`
        SELECT
          b.id, b.nom_entreprise, b.contact_nom,
          b.email, b.telephone, b.wilaya,
          b.statut, b.created_at,
          tc.nom  AS type_client_nom,
          tc.code AS type_client_code,
          COUNT(c.id) AS total_commandes,
          COALESCE(SUM(c.total) FILTER (WHERE c.statut != 'annulee'), 0) AS ca_total
        FROM clients_b2b b
        LEFT JOIN types_client tc ON tc.id = b.type_client_id
        LEFT JOIN commandes c     ON c.client_b2b_id = b.id
        ${where}
        GROUP BY b.id, tc.nom, tc.code
        ORDER BY b.created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `, [...params, limit, offset]),

      query(`
        SELECT COUNT(*) AS total FROM clients_b2b b ${where}
      `, params),
    ]);

    clients = rows.map((r: any) => ({ ...r, _type: 'b2b' }));
    total   = parseInt(count[0].total);

  } else {
    // ─── Clients B2C — regroupés par téléphone ───────────────
    const params: any[] = [];
    let   paramIndex    = 1;
    let   havingClause  = '';

    if (search) {
      havingClause = `HAVING (
        MAX(client_nom)    ILIKE $${paramIndex} OR
        client_telephone   ILIKE $${paramIndex} OR
        MAX(client_wilaya) ILIKE $${paramIndex++}
      )`;
      params.push(`%${search}%`);
    }

    const [rows, count] = await Promise.all([
      query(`
        SELECT
          client_telephone                                              AS telephone,
          MAX(client_nom)                                              AS client_nom,
          MAX(client_wilaya)                                           AS wilaya,
          COUNT(*)                                                     AS total_commandes,
          COALESCE(SUM(total) FILTER (WHERE statut != 'annulee'), 0)  AS ca_total,
          MAX(created_at)                                              AS derniere_commande,
          MIN(created_at)                                              AS premiere_commande
        FROM commandes
        WHERE client_b2b_id IS NULL
        GROUP BY client_telephone
        ${havingClause}
        ORDER BY MAX(created_at) DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `, [...params, limit, offset]),

      query(`
        SELECT COUNT(*) AS total FROM (
          SELECT client_telephone
          FROM commandes
          WHERE client_b2b_id IS NULL
          GROUP BY client_telephone
          ${havingClause}
        ) sub
      `, params),
    ]);

    clients = rows.map((r: any) => ({ ...r, _type: 'b2c' }));
    total   = parseInt(count[0].total);
  }

  return {
    clients,
    total,
    page,
    limit,
    type,
    search,
    statut,
    statsB2B,
    statsB2C,
  };
};