<script lang="ts">
  import { Package } from 'lucide-svelte';

  let { lignes, total } = $props<{
    lignes: {
      id: number;
      nom_produit: string;
      quantite: number;
      prix_unitaire: number;
      total: number;
    }[];
    total: number;
  }>();

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-0">
    <div class="flex items-center gap-2 p-5 border-b border-base-200">
      <Package size={18} class="text-primary" />
      <h2 class="font-semibold">Order Items</h2>
      <span class="badge badge-ghost badge-sm">{lignes.length}</span>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-sm lg:table-md">
        <thead>
          <tr class="text-base-content/60">
            <th>Product</th>
            <th class="text-center">Qty</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {#each lignes as ligne}
            <tr>
              <td class="font-medium">{ligne.nom_produit}</td>
              <td class="text-center font-mono">{ligne.quantite}</td>
              <td class="text-right">{formatPrix(ligne.prix_unitaire)}</td>
              <td class="text-right font-semibold">{formatPrix(ligne.total)}</td>
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr class="font-bold">
            <td colspan="3" class="text-right">Total</td>
            <td class="text-right text-lg text-warning">
              {formatPrix(total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</div>