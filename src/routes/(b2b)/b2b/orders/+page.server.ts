import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, url }) => {
  const clientId = locals.userB2B!.id;
  
  const statut = url.searchParams.get('statut') ?? '';
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const limit = 15;
  const offset = (page - 1) * limit;

  const conditions: string[] = ['client_b2b_id = $1'];
  const params: any[] = [clientId];
  let paramIndex = 2;

  if (statut) {
    conditions.push(`statut = $${paramIndex}`);
    params.push(statut);
    paramIndex++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');

  const [commandes, countResult, stats] = await Promise.all([

    query(`
      SELECT
        id, created_at, total, statut,
        client_nom, client_telephone, client_wilaya
      FROM commandes
      ${where}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset]),

    query(`
      SELECT COUNT(*) as total
      FROM commandes
      ${where}
    `, params),

    query(`
      SELECT
        COUNT(*) AS total_commandes,
        SUM(total) AS total_depense,
        COUNT(*) FILTER (WHERE statut = 'en_attente') AS en_attente,
        COUNT(*) FILTER (WHERE statut = 'confirmee') AS confirmee,
        COUNT(*) FILTER (WHERE statut = 'en_preparation') AS en_preparation,
        COUNT(*) FILTER (WHERE statut = 'expedie') AS expedie,
        COUNT(*) FILTER (WHERE statut = 'livre') AS livre,
        COUNT(*) FILTER (WHERE statut = 'annulee') AS annulee
      FROM commandes
      WHERE client_b2b_id = $1
    `, [clientId]),

  ]);

  return {
    commandes,
    total: parseInt(countResult[0].total),
    page,
    limit,
    statut,
    stats: stats[0],
  };
};