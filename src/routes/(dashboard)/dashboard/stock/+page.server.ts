import type { PageServerLoad, Actions } from './$types';
import { query, withTransaction } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  const filter = url.searchParams.get('filter') ?? 'low'; // low, out, all

  let condition = '';
  if (filter === 'low') {
    condition = 'WHERE p.stock <= p.stock_minimum AND p.stock > 0';
  } else if (filter === 'out') {
    condition = 'WHERE p.stock = 0';
  }

  const produits = await query(`
    SELECT
      p.id, p.nom, p.reference,
      p.stock, p.stock_minimum,
      p.prix, p.unite_vente,
      c.nom AS categorie_nom,
      (
        SELECT url FROM produit_images
        WHERE produit_id = p.id AND principale = TRUE
        LIMIT 1
      ) AS image_principale
    FROM produits p
    JOIN categories c ON c.id = p.categorie_id
    ${condition}
    ORDER BY
      CASE
        WHEN p.stock = 0 THEN 0
        WHEN p.stock <= p.stock_minimum THEN 1
        ELSE 2
      END,
      p.stock ASC,
      p.nom ASC
  `);

  // Stats globales
  const stats = await query(`
    SELECT
      COUNT(*) FILTER (WHERE stock = 0) AS out_of_stock,
      COUNT(*) FILTER (WHERE stock > 0 AND stock <= stock_minimum) AS low_stock,
      COUNT(*) AS total_products,
      SUM(stock) AS total_stock_units
    FROM produits
    WHERE actif = TRUE
  `);

  return {
    produits,
    stats: stats[0],
    filter,
  };
};

export const actions: Actions = {

  // ─── Ajuster stock ─────────────────────────────────────
  adjust: async ({ request }) => {
    const data      = await request.formData();
    const id        = parseInt(data.get('id')?.toString() ?? '');
    const operation = data.get('operation')?.toString(); // 'set', 'add', 'remove'
    const quantity  = parseInt(data.get('quantity')?.toString() ?? '0');
    const note      = data.get('note')?.toString().trim() ?? '';

    if (isNaN(id) || !operation || isNaN(quantity)) {
      return fail(400, { error: 'Invalid data' });
    }

    try {
      await withTransaction(async (client) => {

        // Récupérer stock actuel
        const current = await client.query(
          'SELECT stock FROM produits WHERE id = $1',
          [id]
        );

        const oldStock = current.rows[0]?.stock ?? 0;
        let newStock = oldStock;

        if (operation === 'set') {
          newStock = quantity;
        } else if (operation === 'add') {
          newStock = oldStock + quantity;
        } else if (operation === 'remove') {
          newStock = Math.max(0, oldStock - quantity);
        }

        // Mettre à jour stock
        await client.query(
          'UPDATE produits SET stock = $1 WHERE id = $2',
          [newStock, id]
        );

        // TODO: Enregistrer dans historique mouvements stock
        // (optionnel pour cette version)

      });

      return { success: true };

    } catch (err: any) {
      console.error('[Stock] Adjust error:', err.message);
      return fail(500, { error: 'Server error' });
    }
  },

};