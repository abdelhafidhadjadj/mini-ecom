import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { query } from '$lib/server/db';
import { compare, hash } from 'bcrypt';

export const load: PageServerLoad = async ({ locals }) => {
  const clientId = locals.userB2B!.id;

  // Infos complètes du client
  const clients = await query(`
    SELECT
      cb.id, cb.nom_entreprise, cb.contact_nom, cb.email,
      cb.telephone, cb.wilaya, cb.adresse, cb.siret,
      cb.statut, cb.created_at,
      tc.code AS type_client_code,
      tc.nom AS type_client_nom,
      tc.remise_defaut,
      tc.description AS type_description
    FROM clients_b2b cb
    JOIN types_client tc ON tc.id = cb.type_client_id
    WHERE cb.id = $1
  `, [clientId]);

  // Stats du client
  const stats = await query(`
    SELECT
      COUNT(*) AS total_commandes,
      SUM(total) AS total_depense,
      MIN(created_at) AS first_order,
      MAX(created_at) AS last_order
    FROM commandes
    WHERE client_b2b_id = $1
  `, [clientId]);

  return {
    client: clients[0],
    stats: stats[0],
  };
};

export const actions: Actions = {
  
  changePassword: async ({ request, locals }) => {
    const clientId = locals.userB2B!.id;
    const data = await request.formData();
    
    const currentPassword = data.get('current_password')?.toString();
    const newPassword = data.get('new_password')?.toString();
    const confirmPassword = data.get('confirm_password')?.toString();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return fail(400, { 
        error: 'All fields are required',
        type: 'password'
      });
    }

    if (newPassword !== confirmPassword) {
      return fail(400, { 
        error: 'New passwords do not match',
        type: 'password'
      });
    }

    if (newPassword.length < 8) {
      return fail(400, { 
        error: 'New password must be at least 8 characters',
        type: 'password'
      });
    }

    // Vérifier password actuel
    const clients = await query(
      'SELECT password_hash FROM clients_b2b WHERE id = $1',
      [clientId]
    );

    const valid = await compare(currentPassword, clients[0].password_hash);
    if (!valid) {
      return fail(401, { 
        error: 'Current password is incorrect',
        type: 'password'
      });
    }

    // Hasher nouveau password
    const newPasswordHash = await hash(newPassword, 12);

    // Mettre à jour
    await query(
      'UPDATE clients_b2b SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, clientId]
    );

    return { 
      success: true, 
      message: 'Password changed successfully',
      type: 'password'
    };
  },

};