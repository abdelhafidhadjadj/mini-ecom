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
        )                                                 AS commandes_jour,
        COUNT(*) FILTER (WHERE client_b2b_id IS NOT NULL) AS total_b2b,
        COUNT(*) FILTER (WHERE client_b2b_id IS NULL)     AS total_b2c
      FROM commandes
    `),

    // 8 dernières commandes avec infos B2B
    query(`
      SELECT
        c.id, c.client_nom, c.client_telephone,
        c.client_wilaya, c.total, c.statut, c.created_at,
        c.client_b2b_id,
        b.nom_entreprise,
        tc.nom AS type_client_nom
      FROM commandes c
      LEFT JOIN clients_b2b b   ON b.id  = c.client_b2b_id
      LEFT JOIN types_client tc ON tc.id = c.type_prix_applique
      ORDER BY c.created_at DESC
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

  // Clients B2B en attente d'approbation
  const pendingB2B = await query(`
    SELECT id, nom_entreprise, contact_nom, wilaya, created_at
    FROM clients_b2b
    WHERE statut = 'en_attente'
    ORDER BY created_at ASC
    LIMIT 5
  `);

  return {
    stats: stats[0],
    recentOrders,
    lowStock,
    pendingB2B,
  };
};