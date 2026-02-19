<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ClientsStatsCards from '$lib/components/dashboard/clients/ClientsStatsCards.svelte';
  import ClientsFilters    from '$lib/components/dashboard/clients/ClientsFilters.svelte';
  import ClientsTableB2B   from '$lib/components/dashboard/clients/ClientsTableB2B.svelte';
  import ClientsTableB2C   from '$lib/components/dashboard/clients/ClientsTableB2C.svelte';
  import ClientsPagination from '$lib/components/dashboard/clients/ClientsPagination.svelte';

  let { data } = $props();

  let totalPages = $derived(Math.ceil(data.total / data.limit));

  function setParam(key: string, value: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    goto(`?${params.toString()}`);
  }

  function switchType(t: string) {
    goto(`?type=${t}`);
  }

  function goToPage(p: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', p.toString());
    goto(`?${params.toString()}`);
  }
</script>

<svelte:head>
  <title>Clients — Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-6">

  <!-- Header -->
  <div>
    <h1 class="text-lg font-bold">Clients</h1>
    <p class="text-xs text-base-content/50 mt-1">B2B accounts and B2C customers</p>
  </div>

  <!-- Stats -->
  <ClientsStatsCards
    statsB2B={data.statsB2B}
    statsB2C={data.statsB2C}
    type={data.type}
    onSwitch={switchType}
  />

  <!-- Filtres -->
  <ClientsFilters
    type={data.type}
    statut={data.statut}
    search={data.search}
    total={data.total}
    onStatutChange={(s) => setParam('statut', s)}
    onSearchChange={(s) => setParam('search', s)}
  />

  <!-- Table -->
  <div class="card bg-base-100 border border-base-200 shadow-sm">
    <div class="card-body p-0">
      <div class="overflow-x-auto">
        <table class="table table-sm lg:table-md">
          {#if data.type === 'b2b'}
            <ClientsTableB2B clients={data.clients} />
          {:else}
            <ClientsTableB2C clients={data.clients} />
          {/if}
        </table>
      </div>

      <ClientsPagination
        page={data.page}
        {totalPages}
        onPageChange={goToPage}
      />
    </div>
  </div>

</div>