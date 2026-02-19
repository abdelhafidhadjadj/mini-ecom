import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const telephone = decodeURIComponent(params.telephone);

  if (!telephone) throw error(404, 'Client not found');

  const [commandes, stats] = await Promise.all([

    // Toutes les commandes de ce client
    query(`
      SELECT
        c.id, c.client_nom, c.client_wilaya,
        c.client_adresse, c.total, c.statut,
        c.notes, c.created_at,
        COUNT(lc.id) AS nb_lignes
      FROM commandes c
      LEFT JOIN lignes_commande lc ON lc.commande_id = c.id
      WHERE c.client_telephone = $1
        AND c.client_b2b_id IS NULL
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [telephone]),

    // Stats agrégées
    query(`
      SELECT
        MAX(client_nom)                                              AS client_nom,
        MAX(client_wilaya)                                          AS wilaya,
        COUNT(*)                                                    AS total_commandes,
        COALESCE(SUM(total) FILTER (WHERE statut != 'annulee'), 0) AS ca_total,
        COUNT(*) FILTER (WHERE statut = 'livre')                   AS livrees,
        COUNT(*) FILTER (WHERE statut = 'annulee')                 AS annulees,
        MAX(created_at)                                             AS derniere_commande,
        MIN(created_at)                                             AS premiere_commande
      FROM commandes
      WHERE client_telephone = $1
        AND client_b2b_id IS NULL
    `, [telephone]),

  ]);

  if (!stats[0] || parseInt(stats[0].total_commandes) === 0) {
    throw error(404, 'Client not found');
  }

  return {
    telephone,
    client: stats[0],
    commandes,
  };
};