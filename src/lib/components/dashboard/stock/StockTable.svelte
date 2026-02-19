<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Package, AlertTriangle, XCircle, Edit } from 'lucide-svelte';

  let { produits, stats, filter, onAdjust } = $props<{
    produits: {
      id: number;
      nom: string;
      reference?: string;
      stock: number;
      stock_minimum: number;
      prix: number;
      unite_vente: string;
      categorie_nom: string;
      image_principale?: string;
    }[];
    stats: {
      out_of_stock: number;
      low_stock: number;
      total_products: number;
      total_stock_units: number;
    };
    filter: string;
    onAdjust: (product: any) => void;
  }>();



  function filterBy(f: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (f) params.set('filter', f);
    else params.delete('filter');
    goto(`?${params.toString()}`);
  }

  function openAdjustModal(product: any) {
    onAdjust(product);
  }

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

  function stockStatus(stock: number, min: number) {
    if (stock === 0) return { label: 'Out of stock', class: 'badge-error', icon: XCircle };
    if (stock <= min) return { label: 'Low stock', class: 'badge-warning', icon: AlertTriangle };
    return { label: 'In stock', class: 'badge-success', icon: Package };
  }
</script>

<div class="flex flex-col gap-4 lg:gap-6">

  <!-- Stats Cards -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">

    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-base-content/50">Out of Stock</span>
          <XCircle size={16} class="text-error" />
        </div>
        <p class="text-2xl font-bold text-error">{stats.out_of_stock}</p>
      </div>
    </div>

    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-base-content/50">Low Stock</span>
          <AlertTriangle size={16} class="text-warning" />
        </div>
        <p class="text-2xl font-bold text-warning">{stats.low_stock}</p>
      </div>
    </div>

    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-base-content/50">Total Products</span>
          <Package size={16} class="text-primary" />
        </div>
        <p class="text-2xl font-bold">{stats.total_products}</p>
      </div>
    </div>

    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-base-content/50">Total Units</span>
          <Package size={16} class="text-info" />
        </div>
        <p class="text-2xl font-bold">{stats.total_stock_units?.toLocaleString() ?? 0}</p>
      </div>
    </div>

  </div>

  <!-- Filters -->
  <div class="flex flex-wrap gap-2">
    <button
      class="btn btn-sm gap-2"
      class:btn-error={filter === 'out'}
      class:btn-ghost={filter !== 'out'}
      onclick={() => filterBy('out')}
    >
      <XCircle size={14} />
      Out of Stock
      <span class="badge badge-xs">{stats.out_of_stock}</span>
    </button>

    <button
      class="btn btn-sm gap-2"
      class:btn-warning={filter === 'low'}
      class:btn-ghost={filter !== 'low'}
      onclick={() => filterBy('low')}
    >
      <AlertTriangle size={14} />
      Low Stock
      <span class="badge badge-xs">{stats.low_stock}</span>
    </button>

    <button
      class="btn btn-sm gap-2"
      class:btn-primary={filter === 'all'}
      class:btn-ghost={filter !== 'all'}
      onclick={() => filterBy('all')}
    >
      <Package size={14} />
      All Products
      <span class="badge badge-xs">{stats.total_products}</span>
    </button>
  </div>

  <!-- Table -->
  <div class="card bg-base-100 shadow-sm border border-base-200">
    <div class="card-body p-0">
      <div class="overflow-x-auto">
        <table class="table table-sm lg:table-md">
          <thead>
            <tr class="bg-base-200/50 text-base-content/60">
              <th class="w-12">Image</th>
              <th>Product</th>
              <th class="hidden md:table-cell">Category</th>
              <th class="text-center">Current</th>
              <th class="text-center">Min</th>
              <th>Status</th>
              <th class="w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each produits as produit}
              {@const status = stockStatus(produit.stock, produit.stock_minimum)}
              {@const StatusIcon = status.icon}
              <tr class="hover">

                <!-- Image -->
                <td>
                  <div class="w-10 h-10 rounded-lg bg-base-200 overflow-hidden flex items-center justify-center shrink-0">
                    {#if produit.image_principale}
                      <img
                        src={produit.image_principale}
                        alt={produit.nom}
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    {:else}
                      <Package size={16} class="text-base-content/20" />
                    {/if}
                  </div>
                </td>

                <!-- Nom + ref -->
                <td>
                  <div class="font-medium text-sm">{produit.nom}</div>
                  {#if produit.reference}
                    <span class="font-mono text-xs bg-base-200 px-1.5 py-0.5 rounded">
                      {produit.reference}
                    </span>
                  {/if}
                </td>

                <!-- Catégorie -->
                <td class="hidden md:table-cell text-sm text-base-content/70">
                  {produit.categorie_nom}
                </td>

                <!-- Stock actuel -->
                <td class="text-center">
                  <span class="font-mono font-bold text-sm">
                    {produit.stock}
                  </span>
                </td>

                <!-- Stock minimum -->
                <td class="text-center">
                  <span class="font-mono text-xs text-base-content/50">
                    {produit.stock_minimum}
                  </span>
                </td>

                <!-- Status -->
                <td>
                  <span class="badge badge-sm {status.class} gap-1">
                    <StatusIcon size={10} />
                    {status.label}
                  </span>
                </td>

                <!-- Actions -->
                <td>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle tooltip"
                    data-tip="Adjust stock"
                    onclick={() => openAdjustModal(produit)}
                  >
                    <Edit size={14} />
                  </button>
                </td>

              </tr>
            {/each}

            {#if produits.length === 0}
              <tr>
                <td colspan="7" class="text-center py-12 text-base-content/40">
                  <div class="flex flex-col items-center gap-2">
                    <Package size={32} class="opacity-20" />
                    <span class="text-sm">
                      {#if filter === 'out'}
                        No products out of stock
                      {:else if filter === 'low'}
                        No low stock alerts
                      {:else}
                        No products found
                      {/if}
                    </span>
                  </div>
                </td>
              </tr>
            {/if}

          </tbody>
        </table>
      </div>
    </div>
  </div>

</div>

