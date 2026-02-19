<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { cartCount } from '$lib/stores/cart.store';
  import ProductCard     from '$lib/components/public/products/ProductCard.svelte';
  import ProductsFilters from '$lib/components/public/products/ProductsFilters.svelte';
  import CartDrawer      from '$lib/components/public/cart/CartDrawer.svelte';
  import { SlidersHorizontal, X } from 'lucide-svelte';

  let { data } = $props();

  let cartOpen     = $state(false);
  let filtersOpen  = $state(false);
  let totalPages   = $derived(Math.ceil(data.total / data.limit));

  function applyFilters(params: Record<string, string>) {
    const p = new URLSearchParams();
    if (params.search)    p.set('search',    params.search);
    if (params.catalogue) p.set('catalogue', params.catalogue);
    if (params.categorie) p.set('categorie', params.categorie);
    if (params.sort && params.sort !== 'newest') p.set('sort', params.sort);
    goto(`?${p.toString()}`);
  }

  function goToPage(p: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', p.toString());
    goto(`?${params.toString()}`);
  }
</script>

<svelte:head>
  <title>Produits — Outillage Pro</title>
</svelte:head>

<CartDrawer open={cartOpen} onClose={() => cartOpen = false} />

<!-- Bouton panier flottant -->
<button
  class="fixed bottom-6 right-6 btn btn-primary btn-circle shadow-lg z-30"
  onclick={() => cartOpen = true}
>
  <span class="relative text-lg">🛒
    {#if $cartCount > 0}
      <span class="absolute -top-2 -right-2 badge badge-error badge-xs">{$cartCount}</span>
    {/if}
  </span>
</button>

<div class="max-w-7xl mx-auto px-4 py-6 lg:py-10">

  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold">Produits</h1>
      <p class="text-sm text-base-content/50 mt-1">{data.total} produit{data.total > 1 ? 's' : ''}</p>
    </div>

    <!-- Bouton filtres mobile -->
    <button
      class="btn btn-outline btn-sm gap-2 lg:hidden"
      onclick={() => filtersOpen = true}
    >
      <SlidersHorizontal size={15} />
      Filtres
    </button>
  </div>

  <div class="flex gap-6">

    <!-- Sidebar filtres — desktop -->
    <aside class="hidden lg:block w-56 shrink-0">
      <div class="card bg-base-100 border border-base-200 shadow-sm p-4 sticky top-24">
        <ProductsFilters
          catalogues={data.catalogues}
          categories={data.categories}
          search={data.search}
          catalogue={data.catalogue}
          categorie={data.categorie}
          sort={data.sort}
          onFilter={applyFilters}
        />
      </div>
    </aside>

    <!-- Grille produits -->
    <div class="flex-1 flex flex-col gap-6">

      {#if data.produits.length > 0}
        <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
          {#each data.produits as produit}
            <ProductCard {produit} />
          {/each}
        </div>
      {:else}
        <div class="flex flex-col items-center justify-center py-20 text-base-content/40 gap-3">
          <span class="text-5xl">📦</span>
          <p class="text-sm">Aucun produit trouvé</p>
          <button
            class="btn btn-ghost btn-sm"
            onclick={() => applyFilters({ search: '', catalogue: '', categorie: '', sort: 'newest' })}
          >
            Effacer les filtres
          </button>
        </div>
      {/if}

      <!-- Pagination -->
      {#if totalPages > 1}
        <div class="flex justify-center gap-2">
          {#each Array(totalPages) as _, i}
            <button
              onclick={() => goToPage(i + 1)}
              class="btn btn-sm"
              class:btn-primary={data.page === i + 1}
              class:btn-ghost={data.page !== i + 1}
            >
              {i + 1}
            </button>
          {/each}
        </div>
      {/if}

    </div>
  </div>

</div>

<!-- Drawer filtres mobile -->
{#if filtersOpen}
  <div class="fixed inset-0 bg-black/40 z-40" onclick={() => filtersOpen = false}></div>
  <div class="fixed top-0 left-0 h-full w-72 bg-base-100 z-50 p-5 overflow-y-auto shadow-2xl">
    <div class="flex items-center justify-between mb-4">
      <span class="font-semibold">Filtres</span>
      <button class="btn btn-ghost btn-sm btn-circle" onclick={() => filtersOpen = false}>
        <X size={16} />
      </button>
    </div>
    <ProductsFilters
      catalogues={data.catalogues}
      categories={data.categories}
      search={data.search}
      catalogue={data.catalogue}
      categorie={data.categorie}
      sort={data.sort}
      onFilter={(p) => { applyFilters(p); filtersOpen = false; }}
    />
  </div>
{/if}