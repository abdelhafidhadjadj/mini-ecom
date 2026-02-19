import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { query } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.userB2B) {
    throw redirect(302, '/b2b-auth/login');
  }

  // Charger infos complètes du client B2B
  const clients = await query(
    `SELECT 
       cb.id, cb.nom_entreprise, cb.contact_nom, cb.email,
       cb.telephone, cb.wilaya, cb.statut,
       tc.code AS type_client_code,
       tc.nom AS type_client_nom,
       tc.remise_defaut
     FROM clients_b2b cb
     JOIN types_client tc ON tc.id = cb.type_client_id
     WHERE cb.id = $1`,
    [locals.userB2B.id]
  );

  if (!clients[0]) {
    throw redirect(302, '/b2b-auth/login');
  }

  return {
    userB2B: clients[0],
  };
};