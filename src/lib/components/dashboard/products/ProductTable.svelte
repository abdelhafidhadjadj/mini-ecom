<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import {
    Pencil, Trash2, ToggleLeft, ToggleRight,
    Plus, Wrench, Search, Package, AlertTriangle
  } from 'lucide-svelte';

  let { produits, categories, search, categorie, actif, total } = $props<{
    produits: {
      id: number;
      nom: string;
      slug: string;
      reference?: string;
      prix: number;
      unite_vente: string;
      stock: number;
      stock_minimum: number;
      actif: boolean;
      categorie_nom: string;
      nb_variantes: number;
      image_principale?: string;
    }[];
    categories: { id: number; nom: string }[];
    search: string;
    categorie: string;
    actif: string;
    total: number;
  }>();

  let deletingId  = $state<number | null>(null);
  let togglingId  = $state<number | null>(null);
  let searchValue = $state(search);
  let searchTimeout: ReturnType<typeof setTimeout>;

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

  function onSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const params = new URLSearchParams($page.url.searchParams);
      if (searchValue) params.set('search', searchValue);
      else params.delete('search');
      params.delete('page');
      goto(`?${params.toString()}`);
    }, 400);
  }

  function filterCategorie(val: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (val) params.set('categorie', val);
    else params.delete('categorie');
    params.delete('page');
    goto(`?${params.toString()}`);
  }

  function filterActif(val: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (val) params.set('actif', val);
    else params.delete('actif');
    params.delete('page');
    goto(`?${params.toString()}`);
  }

  function stockStatus(stock: number, min: number) {
    if (stock === 0)    return { label: 'Out of stock', class: 'badge-error'   };
    if (stock <= min)   return { label: 'Low stock',    class: 'badge-warning' };
    return               { label: 'In stock',           class: 'badge-success' };
  }
</script>

<div class="flex flex-col gap-4">

  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <Wrench size={18} class="text-primary" />
      <h2 class="font-semibold">Products</h2>
      <span class="badge badge-ghost badge-sm">{total}</span>
    </div>
    <a href="/dashboard/products/add" class="btn btn-primary btn-sm gap-2">
      <Plus size={16} />
      New Product
    </a>
  </div>

  <!-- Filters -->
  <div class="card bg-base-100 shadow-sm border border-base-200">
    <div class="card-body p-3 lg:p-4">
      <div class="flex flex-col sm:flex-row gap-3">

        <!-- Search -->
        <label class="input input-bordered flex items-center gap-2 flex-1">
          <Search size={16} class="text-base-content/40 shrink-0" />
          <input
            type="text"
            placeholder="Search by name or reference..."
            class="grow text-sm"
            bind:value={searchValue}
            oninput={onSearchInput}
          />
        </label>

        <!-- Filter categorie -->
        <select
          class="select select-bordered text-sm w-full sm:w-48"
          value={categorie}
          onchange={(e) => filterCategorie(e.currentTarget.value)}
        >
          <option value="">All categories</option>
          {#each categories as cat}
            <option value={cat.id}>{cat.nom}</option>
          {/each}
        </select>

        <!-- Filter actif -->
        <select
          class="select select-bordered text-sm w-full sm:w-36"
          value={actif}
          onchange={(e) => filterActif(e.currentTarget.value)}
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

      </div>
    </div>
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
              <th>Price</th>
              <th class="hidden sm:table-cell">Stock</th>
              <th class="text-center">Status</th>
              <th class="w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each produits as produit}
              {@const stock = stockStatus(produit.stock, produit.stock_minimum)}
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
                  <div class="flex items-center gap-2 mt-0.5">
                    {#if produit.reference}
                      <span class="font-mono text-xs bg-base-200 px-1.5 py-0.5 rounded">
                        {produit.reference}
                      </span>
                    {/if}
                    {#if produit.nb_variantes > 0}
                      <span class="text-xs text-base-content/40">
                        {produit.nb_variantes} variant{produit.nb_variantes > 1 ? 's' : ''}
                      </span>
                    {/if}
                  </div>
                </td>

                <!-- Categorie -->
                <td class="hidden md:table-cell text-sm text-base-content/70">
                  {produit.categorie_nom}
                </td>

                <!-- Prix -->
                <td class="whitespace-nowrap">
                  <div class="font-semibold text-sm">{formatPrix(produit.prix)}</div>
                  <div class="text-xs text-base-content/40">/{produit.unite_vente}</div>
                </td>

                <!-- Stock -->
                <td class="hidden sm:table-cell">
                  <div class="flex items-center gap-1.5">
                    {#if produit.stock <= produit.stock_minimum}
                      <AlertTriangle size={12} class="text-warning shrink-0" />
                    {/if}
                    <span class="badge badge-sm {stock.class}">
                      {produit.stock}
                    </span>
                  </div>
                </td>

                <!-- Toggle actif -->
                <td class="text-center">
                  <form method="POST" action="?/toggle" use:enhance={() => {
                    togglingId = produit.id;
                    return async ({ update }) => {
                      await update();
                      togglingId = null;
                    };
                  }}>
                    <input type="hidden" name="id" value={produit.id} />
                    <input type="hidden" name="actif" value={produit.actif} />
                    <button
                      type="submit"
                      class="btn btn-ghost btn-xs"
                      disabled={togglingId === produit.id}
                    >
                      {#if produit.actif}
                        <ToggleRight size={18} class="text-success" />
                      {:else}
                        <ToggleLeft size={18} class="text-base-content/30" />
                      {/if}
                    </button>
                  </form>
                </td>

                <!-- Actions -->
                <td>
                  <div class="flex items-center gap-1">
                    <a
                      href="/dashboard/products/{produit.id}/update"
                      class="btn btn-ghost btn-xs btn-circle tooltip"
                      data-tip="Edit"
                    >
                      <Pencil size={14} />
                    </a>
                    <form method="POST" action="?/delete" use:enhance={() => {
                      deletingId = produit.id;
                      return async ({ update }) => {
                        await update();
                        deletingId = null;
                      };
                    }}>
                      <input type="hidden" name="id" value={produit.id} />
                      <button
                        type="submit"
                        class="btn btn-ghost btn-xs btn-circle tooltip text-error hover:bg-error/10"
                        data-tip="Delete"
                        disabled={deletingId === produit.id}
                        onclick={(e) => {
                          if (!confirm('Delete this product?')) e.preventDefault();
                        }}
                      >
                        {#if deletingId === produit.id}
                          <span class="loading loading-spinner loading-xs"></span>
                        {:else}
                          <Trash2 size={14} />
                        {/if}
                      </button>
                    </form>
                  </div>
                </td>

              </tr>
            {/each}

            {#if produits.length === 0}
              <tr>
                <td colspan="7" class="text-center py-12 text-base-content/40">
                  <div class="flex flex-col items-center gap-2">
                    <Wrench size={32} class="opacity-20" />
                    <span class="text-sm">No products found</span>
                    <a href="/dashboard/products/add" class="btn btn-primary btn-sm mt-2">
                      Add first product
                    </a>
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