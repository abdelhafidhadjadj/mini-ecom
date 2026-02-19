<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import OrderCard from '$lib/components/b2b/OrderCard.svelte';
  import OrderFilters from '$lib/components/b2b/OrderFilters.svelte';
  import OrderPagination from '$lib/components/dashboard/orders/OrderPagination.svelte';
  import { ShoppingCart } from 'lucide-svelte';

  let { data } = $props();

  let totalPages = $derived(Math.ceil(data.total / data.limit));

  function goToPage(p: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', p.toString());
    goto(`?${params.toString()}`);
  }

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }
</script>

<svelte:head>
  <title>My Orders — B2B Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-6">

  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">My Orders</h1>
      <p class="text-base-content/60 mt-1">
        {data.stats.total_commandes} total orders — {formatPrix(data.stats.total_depense || 0)} spent
      </p>
    </div>
  </div>

  <!-- Filters -->
  <OrderFilters statut={data.statut} stats={data.stats} />

  <!-- Orders grid -->
  {#if data.commandes.length > 0}
    <div class="grid lg:grid-cols-2 gap-4 lg:gap-6">
      {#each data.commandes as order}
        <OrderCard {order} />
      {/each}
    </div>
  {:else}
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body py-16 text-center text-base-content/40">
        <ShoppingCart size={48} class="mx-auto mb-3 opacity-20" />
        <p class="text-lg font-medium">No orders found</p>
        <p class="text-sm">Start shopping to see your orders here</p>
        <a href="/b2b/products" class="btn btn-warning btn-sm mt-4">
          Browse Products
        </a>
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