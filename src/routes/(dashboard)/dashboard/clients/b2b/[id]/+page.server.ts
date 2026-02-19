import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) throw error(404, 'Client not found');

  const [clients, commandes, typesClient] = await Promise.all([

    query(`
      SELECT
        b.id, b.nom_entreprise, b.contact_nom,
        b.email, b.telephone, b.wilaya, b.adresse,
        b.statut, b.siret, b.notes, b.created_at, b.updated_at,
        tc.id   AS type_client_id,
        tc.nom  AS type_client_nom,
        tc.code AS type_client_code,
        tc.remise_defaut
      FROM clients_b2b b
      LEFT JOIN types_client tc ON tc.id = b.type_client_id
      WHERE b.id = $1
    `, [id]),

    query(`
      SELECT
        c.id, c.total, c.statut,
        c.client_wilaya, c.created_at,
        tc.nom AS type_prix_nom,
        COUNT(lc.id) AS nb_lignes
      FROM commandes c
      LEFT JOIN types_client tc ON tc.id = c.type_prix_applique
      LEFT JOIN lignes_commande lc ON lc.commande_id = c.id
      WHERE c.client_b2b_id = $1
      GROUP BY c.id, tc.nom
      ORDER BY c.created_at DESC
    `, [id]),

    query(`
      SELECT id, code, nom, remise_defaut
      FROM types_client
      WHERE code != 'public'
      ORDER BY ordre ASC
    `),

  ]);

  if (!clients[0]) throw error(404, 'Client not found');

  const statsCommandes = {
    total:    commandes.length,
    ca_total: commandes
      .filter((c: any) => c.statut !== 'annulee')
      .reduce((sum: number, c: any) => sum + parseFloat(c.total), 0),
    livrees:  commandes.filter((c: any) => c.statut === 'livre').length,
    annulees: commandes.filter((c: any) => c.statut === 'annulee').length,
  };

  return {
    client:   clients[0],
    commandes,
    typesClient,
    statsCommandes,
  };
};

export const actions: Actions = {

  approve: async ({ request, params }) => {
    const id             = parseInt(params.id);
    const data           = await request.formData();
    const type_client_id = parseInt(data.get('type_client_id')?.toString() ?? '');
    if (isNaN(type_client_id)) return fail(400, { error: 'Select a client type' });
    try {
      await query(
        `UPDATE clients_b2b SET statut = 'approuve', type_client_id = $1 WHERE id = $2`,
        [type_client_id, id]
      );
      return { success: true, action: 'approve' };
    } catch { return fail(500, { error: 'Server error' }); }
  },

  reject: async ({ params }) => {
    const id = parseInt(params.id);
    try {
      await query(`UPDATE clients_b2b SET statut = 'rejete' WHERE id = $1`, [id]);
      return { success: true, action: 'reject' };
    } catch { return fail(500, { error: 'Server error' }); }
  },

  suspend: async ({ params }) => {
    const id = parseInt(params.id);
    try {
      await query(`UPDATE clients_b2b SET statut = 'suspendu' WHERE id = $1`, [id]);
      return { success: true, action: 'suspend' };
    } catch { return fail(500, { error: 'Server error' }); }
  },

  reactivate: async ({ params }) => {
    const id = parseInt(params.id);
    try {
      await query(`UPDATE clients_b2b SET statut = 'approuve' WHERE id = $1`, [id]);
      return { success: true, action: 'reactivate' };
    } catch { return fail(500, { error: 'Server error' }); }
  },

  changeType: async ({ request, params }) => {
    const id             = parseInt(params.id);
    const data           = await request.formData();
    const type_client_id = parseInt(data.get('type_client_id')?.toString() ?? '');
    if (isNaN(type_client_id)) return fail(400, { error: 'Invalid type' });
    try {
      await query(
        `UPDATE clients_b2b SET type_client_id = $1 WHERE id = $2`,
        [type_client_id, id]
      );
      return { success: true, action: 'changeType' };
    } catch { return fail(500, { error: 'Server error' }); }
  },

  updateNotes: async ({ request, params }) => {
    const id    = parseInt(params.id);
    const data  = await request.formData();
    const notes = data.get('notes')?.toString() ?? '';
    try {
      await query(`UPDATE clients_b2b SET notes = $1 WHERE id = $2`, [notes, id]);
      return { success: true, action: 'updateNotes' };
    } catch { return fail(500, { error: 'Server error' }); }
  },
};