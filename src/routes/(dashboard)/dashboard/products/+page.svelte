<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ProductTable from '$lib/components/dashboard/products/ProductTable.svelte';
  import OrderPagination from '$lib/components/dashboard/orders/OrderPagination.svelte';

  let { data } = $props();

  let totalPages = $derived(Math.ceil(data.total / data.limit));

  function goToPage(p: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', p.toString());
    goto(`?${params.toString()}`);
  }
</script>

<svelte:head>
  <title>Products — Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-6">

  <ProductTable
    produits={data.produits}
    categories={data.categories}
    search={data.search}
    categorie={data.categorie}
    actif={data.actif}
    total={data.total}
  />

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