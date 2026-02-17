<script lang="ts">
  import { Package } from 'lucide-svelte';

  let { lignes, total } = $props<{
    lignes: {
      id: number;
      nom_produit: string;
      quantite: number;
      prix_unitaire: number;
      total: number;
      produit_id?: number;
    }[];
    total: number;
  }>();

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-0">

    <!-- Header -->
    <div class="flex items-center gap-2 p-4 lg:p-5 border-b border-base-200">
      <Package size={16} class="text-primary" />
      <h2 class="font-semibold">Order Items</h2>
      <span class="badge badge-ghost badge-sm">{lignes.length} item{lignes.length > 1 ? 's' : ''}</span>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="table table-sm lg:table-md">
        <thead>
          <tr class="bg-base-200/50 text-base-content/60">
            <th>Product</th>
            <th class="text-center w-24">Qty</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {#each lignes as ligne}
            <tr class="hover">

              <!-- Produit -->
              <td>
                <div class="flex items-center gap-2">
                  <div class="bg-base-200 rounded-lg p-1.5 shrink-0">
                    <Package size={14} class="text-base-content/40" />
                  </div>
                  <div>
                    <p class="font-medium text-sm">{ligne.nom_produit}</p>
                    {#if ligne.produit_id}
                      <a
                        href="/dashboard/produits/{ligne.produit_id}/modifier"
                        class="text-xs text-primary hover:underline"
                      >
                        View product →
                      </a>
                    {/if}
                  </div>
                </div>
              </td>

              <!-- Quantité -->
              <td class="text-center">
                <span class="badge badge-ghost badge-sm font-mono">
                  x{ligne.quantite}
                </span>
              </td>

              <!-- Prix unitaire -->
              <td class="text-right text-sm text-base-content/70 whitespace-nowrap">
                {formatPrix(ligne.prix_unitaire)}
              </td>

              <!-- Total ligne -->
              <td class="text-right font-semibold text-sm whitespace-nowrap">
                {formatPrix(ligne.total)}
              </td>

            </tr>
          {/each}
        </tbody>

        <!-- Footer total -->
        <tfoot>
          <tr class="border-t-2 border-base-200">
            <td colspan="3" class="text-right font-semibold text-sm">
              Order Total
            </td>
            <td class="text-right">
              <span class="text-lg font-bold text-primary">
                {formatPrix(total)}
              </span>
            </td>
          </tr>
        </tfoot>

      </table>
    </div>

  </div>
</div>