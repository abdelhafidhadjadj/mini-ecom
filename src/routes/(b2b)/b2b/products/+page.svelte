<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ProductCard from '$lib/components/b2b/ProductCard.svelte';
  import ProductFilters from '$lib/components/b2b/ProductFilters.svelte';
  import OrderPagination from '$lib/components/dashboard/orders/OrderPagination.svelte';
  import { Package } from 'lucide-svelte';

  let { data } = $props();

  let totalPages = $derived(Math.ceil(data.total / data.limit));

  function goToPage(p: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', p.toString());
    goto(`?${params.toString()}`);
  }

  function handleAddToCart(productId: number) {
    // TODO: Implement cart logic
    console.log('Add to cart:', productId);
    alert('Cart functionality coming soon!');
  }
</script>

<svelte:head>
  <title>Products — B2B Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-6">

  <!-- Header -->
  <div>
    <h1 class="text-2xl font-bold">Browse Products</h1>
    <p class="text-base-content/60 mt-1">
      Exclusive B2B prices — {data.userB2B.remise_defaut}% discount
    </p>
  </div>

  <!-- Filters -->
  <ProductFilters
    catalogues={data.catalogues}
    categories={data.categories}
    search={data.search}
    catalogue={data.catalogue}
    categorie={data.categorie}
    sort={data.sort}
    total={data.total}
  />

  <!-- Products grid -->
  {#if data.produits.length > 0}
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each data.produits as product}
        <ProductCard {product} onAddToCart={handleAddToCart} />
      {/each}
    </div>
  {:else}
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body py-16 text-center text-base-content/40">
        <Package size={48} class="mx-auto mb-3 opacity-20" />
        <p class="text-lg font-medium">No products found</p>
        <p class="text-sm">Try adjusting your filters</p>
      </div>
    </div>
  {/if}

  <!-- Pagination -->
  {#if totalPages > 1}
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <OrderPagination
        page={data.page}
        {totalPages}
        onPageChange={goToPage}
      />
    </div>
  {/if}

</div>