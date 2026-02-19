import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, locals }) => {
  const id = parseInt(params.id);
  const clientId = locals.userB2B!.id;

  if (isNaN(id)) throw error(404, 'Order not found');

  const [commandes, lignes, historique] = await Promise.all([

    query(`
      SELECT
        id, created_at, updated_at, total, statut,
        client_nom, client_telephone, client_wilaya, client_adresse,
        notes
      FROM commandes
      WHERE id = $1 AND client_b2b_id = $2
    `, [id, clientId]),

    query(`
      SELECT
        id, nom_produit, quantite, prix_unitaire, total
      FROM lignes_commande
      WHERE commande_id = $1
      ORDER BY id ASC
    `, [id]),

    query(`
      SELECT
        id, ancien_statut, nouveau_statut, commentaire, created_at,
        (SELECT nom FROM utilisateurs WHERE id = agent_id) AS agent_nom
      FROM historique_commandes
      WHERE commande_id = $1
      ORDER BY created_at DESC
    `, [id]),

  ]);

  if (!commandes[0]) throw error(404, 'Order not found');

  return {
    commande: commandes[0],
    lignes,
    historique,
  };
};