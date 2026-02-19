import type { PageServerLoad } from './$types';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  const clientId = locals.userB2B!.id;

  // Stats du client
  const stats = await query(`
    SELECT
      COUNT(*) AS total_commandes,
      SUM(total) AS total_depense,
      COUNT(*) FILTER (WHERE statut = 'en_attente') AS commandes_en_attente,
      COUNT(*) FILTER (WHERE statut = 'livre') AS commandes_livrees
    FROM commandes
    WHERE client_b2b_id = $1
  `, [clientId]);

  // Dernières commandes
  const recentOrders = await query(`
    SELECT
      id, created_at, total, statut
    FROM commandes
    WHERE client_b2b_id = $1
    ORDER BY created_at DESC
    LIMIT 5
  `, [clientId]);

  // Produits populaires (les plus commandés par ce client)
  const popularProducts = await query(`
    SELECT
      p.id, p.nom, p.slug,
      SUM(lc.quantite) AS total_commande,
      (
        SELECT url FROM produit_images
        WHERE produit_id = p.id AND principale = TRUE
        LIMIT 1
      ) AS image_principale,
      pc.prix
    FROM lignes_commande lc
    JOIN commandes c ON c.id = lc.commande_id
    JOIN produits p ON p.id = lc.produit_id
    JOIN prix_client pc ON pc.produit_id = p.id
    WHERE c.client_b2b_id = $1
      AND pc.type_client_id = $2
    GROUP BY p.id, p.nom, p.slug, pc.prix
    ORDER BY total_commande DESC
    LIMIT 6
  `, [clientId, locals.userB2B!.type_client_id]);

  return {
    stats: stats[0],
    recentOrders,
    popularProducts,
  };
};