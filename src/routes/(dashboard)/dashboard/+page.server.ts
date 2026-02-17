// src/routes/(dashboard)/dashboard/+page.server.ts
import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async () => {
  const [stats, recentOrders] = await Promise.all([

    // Stats générales
    query(`
      SELECT
        COUNT(*)                                           AS total_commandes,
        COUNT(*) FILTER (WHERE statut = 'en_attente')     AS en_attente,
        COUNT(*) FILTER (WHERE statut = 'en_preparation') AS en_preparation,
        COUNT(*) FILTER (WHERE statut = 'livre')          AS livrees,
        COALESCE(SUM(total) FILTER (
          WHERE statut != 'annulee'
          AND created_at >= date_trunc('month', NOW())
        ), 0)                                             AS ca_mois,
        COALESCE(SUM(total) FILTER (
          WHERE statut != 'annulee'
          AND created_at >= NOW() - INTERVAL '1 day'
        ), 0)                                             AS ca_jour,
        COUNT(*) FILTER (
          WHERE created_at >= NOW() - INTERVAL '1 day'
        )                                                 AS commandes_jour
      FROM commandes
    `),

    // 8 dernières commandes
    query(`
      SELECT
        id, client_nom, client_telephone,
        client_wilaya, total, statut, created_at
      FROM commandes
      ORDER BY created_at DESC
      LIMIT 8
    `),
  ]);

  // Produits en stock faible
  const lowStock = await query(`
    SELECT id, nom, stock, stock_minimum
    FROM produits
    WHERE stock <= stock_minimum AND actif = TRUE
    ORDER BY stock ASC
    LIMIT 5
  `);

  return {
    stats: stats[0],
    recentOrders,
    lowStock,
  };
};