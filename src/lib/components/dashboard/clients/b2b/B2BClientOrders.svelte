<script lang="ts">
  import { ShoppingCart, ChevronDown, ChevronRight } from 'lucide-svelte';
  import OrderStatusBadge from '$lib/components/dashboard/orders/OrderStatusBadge.svelte';

  let { commandes } = $props<{
    commandes: {
      id: number;
      total: number;
      statut: string;
      type_prix_nom?: string;
      nb_lignes: number;
      created_at: string;
      lignes?: {
        id: number;
        nom_produit: string;
        quantite: number;
        prix_unitaire: number;
        total: number;
      }[];
    }[];
  }>();

  // IDs des commandes actuellement ouvertes
  let openOrders = $state<Set<number>>(new Set());
  // Cache des lignes chargées
  let lignesCache = $state<Record<number, any[]>>({});
  let loadingId   = $state<number | null>(null);

  async function toggleOrder(id: number) {
    if (openOrders.has(id)) {
      openOrders.delete(id);
      openOrders = new Set(openOrders);
      return;
    }

    // Si déjà en cache, juste ouvrir
    if (lignesCache[id]) {
      openOrders.add(id);
      openOrders = new Set(openOrders);
      return;
    }

    // Charger les lignes via API
    loadingId = id;
    try {
      const res  = await fetch(`/api/orders/${id}/lines`);
      const data = await res.json();
      lignesCache[id] = data.lignes;
      lignesCache = { ...lignesCache };
      openOrders.add(id);
      openOrders = new Set(openOrders);
    } catch (e) {
      console.error('Failed to load order lines', e);
    } finally {
      loadingId = null;
    }
  }

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

  function formatDateTime(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
</script>

<div class="card bg-base-100 border border-base-200 shadow-sm">
  <div class="card-body p-0">

    <div class="p-4 border-b border-base-200 flex items-center gap-2">
      <ShoppingCart size={16} />
      <h2 class="font-semibold">Order History</h2>
      <span class="badge badge-ghost badge-sm ml-auto">{commandes.length}</span>
    </div>

    {#if commandes.length > 0}
      <div class="overflow-x-auto">
        <table class="table table-sm">
          <thead>
            <tr class="text-base-content/50">
              <th class="w-8"></th>
              <th>#</th>
              <th>Status</th>
              <th class="hidden md:table-cell">Pricing</th>
              <th>Total</th>
              <th class="hidden lg:table-cell">Items</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {#each commandes as commande}
              <!-- Ligne principale -->
              <tr
                class="hover cursor-pointer"
                onclick={() => toggleOrder(commande.id)}
              >
                <td>
                  {#if loadingId === commande.id}
                    <span class="loading loading-spinner loading-xs"></span>
                  {:else if openOrders.has(commande.id)}
                    <ChevronDown size={14} class="text-base-content/40" />
                  {:else}
                    <ChevronRight size={14} class="text-base-content/40" />
                  {/if}
                </td>
                <td>
                  <a
                    href="/dashboard/commandes/{commande.id}"
                    class="font-mono font-bold text-primary hover:underline"
                    onclick={(e) => e.stopPropagation()}
                  >
                    #{commande.id}
                  </a>
                </td>
                <td><OrderStatusBadge statut={commande.statut} /></td>
                <td class="hidden md:table-cell">
                  {#if commande.type_prix_nom}
                    <span class="badge badge-warning badge-xs">{commande.type_prix_nom}</span>
                  {:else}
                    <span class="text-base-content/30 text-xs">—</span>
                  {/if}
                </td>
                <td class="font-semibold text-sm">{formatPrix(commande.total)}</td>
                <td class="hidden lg:table-cell text-sm text-base-content/60">
                  {commande.nb_lignes} item{commande.nb_lignes > 1 ? 's' : ''}
                </td>
                <td class="text-xs text-base-content/50">{formatDateTime(commande.created_at)}</td>
              </tr>

              <!-- Lignes détail (expandable) -->
              {#if openOrders.has(commande.id) && lignesCache[commande.id]}
                <tr class="bg-base-200/30">
                  <td colspan="7" class="p-0">
                    <div class="px-8 py-3">
                      <table class="table table-xs w-full">
                        <thead>
                          <tr class="text-base-content/40">
                            <th>Product</th>
                            <th class="text-right">Qty</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {#each lignesCache[commande.id] as ligne}
                            <tr>
                              <td class="font-medium text-sm">{ligne.nom_produit}</td>
                              <td class="text-right text-sm">{ligne.quantite}</td>
                              <td class="text-right text-sm">{formatPrix(ligne.prix_unitaire)}</td>
                              <td class="text-right font-semibold text-sm">{formatPrix(ligne.total)}</td>
                            </tr>
                          {/each}
                        </tbody>
                        <tfoot>
                          <tr class="border-t border-base-300">
                            <td colspan="3" class="text-right text-xs text-base-content/50 font-medium">
                              Order Total
                            </td>
                            <td class="text-right font-bold text-primary">
                              {formatPrix(commande.total)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </td>
                </tr>
              {/if}

            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="py-12 text-center text-base-content/40">
        <ShoppingCart size={32} class="mx-auto mb-2 opacity-20" />
        <p class="text-sm">No orders yet</p>
      </div>
    {/if}

  </div>
</div>