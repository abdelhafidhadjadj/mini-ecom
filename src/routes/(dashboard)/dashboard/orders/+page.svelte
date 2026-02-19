<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import OrderFilters from '$lib/components/dashboard/orders/OrderFilters.svelte';
  import OrderTable from '$lib/components/dashboard/orders/OrderTable.svelte';
  import OrderPagination from '$lib/components/dashboard/orders/OrderPagination.svelte';

  let { data } = $props();

  const statuts = [
    { value: '',               label: 'All',         count: data.stats.total          },
    { value: 'en_attente',     label: 'Pending',     count: data.stats.en_attente     },
    { value: 'confirmee',      label: 'Confirmed',   count: data.stats.confirmee      },
    { value: 'en_preparation', label: 'In progress', count: data.stats.en_preparation },
    { value: 'expedie',        label: 'Shipped',     count: data.stats.expedie        },
    { value: 'livre',          label: 'Delivered',   count: data.stats.livre          },
    { value: 'annulee',        label: 'Cancelled',   count: data.stats.annulee        },
  ];

  const types = [
    { value: '',    label: 'All',  count: data.stats.total },
    { value: 'b2c', label: 'B2C',  count: data.stats.b2c   },
    { value: 'b2b', label: 'B2B',  count: data.stats.b2b   },
  ];

  let totalPages = $derived(Math.ceil(data.total / data.limit));

  function filterByStatut(statut: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (statut) params.set('statut', statut);
    else params.delete('statut');
    params.delete('page');
    goto(`?${params.toString()}`);
  }

  function filterByType(type: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (type) params.set('type', type);
    else params.delete('type');
    params.delete('page');
    goto(`?${params.toString()}`);
  }

  function filterBySearch(search: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    params.delete('page');
    goto(`?${params.toString()}`);
  }

  function goToPage(p: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', p.toString());
    goto(`?${params.toString()}`);
  }
</script>

<svelte:head>
  <title>Orders — Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-6">

  <OrderFilters
    {statuts}
    {types}
    statut={data.statut}
    type={data.type}
    search={data.search}
    total={data.total}
    onStatutChange={filterByStatut}
    onTypeChange={filterByType}
    onSearchChange={filterBySearch}
  />

  <div class="card bg-base-100 shadow-sm border border-base-200">
    <div class="card-body p-0">
      <OrderTable orders={data.commandes} />
      <OrderPagination
        page={data.page}
        {totalPages}
        onPageChange={goToPage}
      />
    </div>
  </div>

</div>