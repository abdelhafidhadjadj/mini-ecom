import type { RequestHandler } from './$types';
import { query } from '$lib/server/db';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) throw error(400, 'Invalid order id');

  const lignes = await query(`
    SELECT
      lc.id, lc.nom_produit, lc.quantite,
      lc.prix_unitaire, lc.total
    FROM lignes_commande lc
    WHERE lc.commande_id = $1
    ORDER BY lc.id ASC
  `, [id]);

  return json({ lignes });
};