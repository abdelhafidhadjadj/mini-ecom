import type { PageServerLoad, Actions } from './$types';
import { query, withTransaction } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    throw error(404, 'Order not found');
  }

  const [commandes, lignes, historique] = await Promise.all([

    // Commande principale
    query(`
      SELECT
        c.id, c.client_nom, c.client_telephone,
        c.client_wilaya, c.client_adresse,
        c.total, c.statut, c.notes,
        c.whatsapp_entreprise_sent,
        c.whatsapp_client_sent,
        c.created_at, c.updated_at,
        u.nom AS agent_nom
      FROM commandes c
      LEFT JOIN utilisateurs u ON u.id = c.agent_id
      WHERE c.id = $1
    `, [id]),

    // Lignes de commande
    query(`
      SELECT
        lc.id, lc.nom_produit, lc.quantite,
        lc.prix_unitaire, lc.total,
        lc.produit_id, lc.variante_id
      FROM lignes_commande lc
      WHERE lc.commande_id = $1
      ORDER BY lc.id ASC
    `, [id]),

    // Historique statuts
    query(`
      SELECT
        h.id, h.ancien_statut, h.nouveau_statut,
        h.commentaire, h.created_at,
        u.nom AS agent_nom
      FROM historique_commandes h
      LEFT JOIN utilisateurs u ON u.id = h.agent_id
      WHERE h.commande_id = $1
      ORDER BY h.created_at DESC
    `, [id]),

  ]);

  if (!commandes[0]) {
    throw error(404, 'Order not found');
  }

  return {
    commande:   commandes[0],
    lignes,
    historique,
  };
};

export const actions: Actions = {

  // ─── Changer le statut ──────────────────────────────────
  updateStatus: async ({ params, request, locals }) => {
    const id          = parseInt(params.id);
    const data        = await request.formData();
    const newStatut   = data.get('statut')?.toString();
    const commentaire = data.get('commentaire')?.toString() ?? '';

    const validStatuts = [
      'en_attente', 'confirmee', 'en_preparation',
      'expedie', 'livre', 'annulee'
    ];

    if (!newStatut || !validStatuts.includes(newStatut)) {
      return fail(400, { error: 'Invalid status' });
    }

    try {
      await withTransaction(async (client) => {

        // Récupérer ancien statut
        const current = await client.query(
          'SELECT statut FROM commandes WHERE id = $1',
          [id]
        );

        const oldStatut = current.rows[0]?.statut;

        // Mettre à jour le statut
        await client.query(
          'UPDATE commandes SET statut = $1 WHERE id = $2',
          [newStatut, id]
        );

        // Enregistrer dans l'historique
        await client.query(`
          INSERT INTO historique_commandes
            (commande_id, ancien_statut, nouveau_statut, commentaire, agent_id)
          VALUES ($1, $2, $3, $4, $5)
        `, [id, oldStatut, newStatut, commentaire, locals.user?.id]);

      });

      return { success: true };

    } catch (err: any) {
      console.error('[Order] Update status error:', err.message);
      return fail(500, { error: 'Server error' });
    }
  },
};