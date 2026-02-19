<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let { statut, stats } = $props<{
    statut: string;
    stats: {
      en_attente: number;
      confirmee: number;
      en_preparation: number;
      expedie: number;
      livre: number;
      annulee: number;
    };
  }>();

  function filterStatut(s: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (s) params.set('statut', s);
    else params.delete('statut');
    params.delete('page');
    goto(`?${params.toString()}`);
  }

  const filters = [
    { label: 'All', value: '', count: null },
    { label: 'Pending', value: 'en_attente', count: stats.en_attente, class: 'badge-warning' },
    { label: 'Confirmed', value: 'confirmee', count: stats.confirmee, class: 'badge-info' },
    { label: 'In Progress', value: 'en_preparation', count: stats.en_preparation, class: 'badge-primary' },
    { label: 'Shipped', value: 'expedie', count: stats.expedie, class: 'badge-accent' },
    { label: 'Delivered', value: 'livre', count: stats.livre, class: 'badge-success' },
    { label: 'Cancelled', value: 'annulee', count: stats.annulee, class: 'badge-error' },
  ];
</script>

<div class="flex flex-wrap gap-2">
  {#each filters as filter}
    <button
      class="btn btn-sm gap-2"
      class:btn-warning={statut === filter.value}
      class:btn-ghost={statut !== filter.value}
      onclick={() => filterStatut(filter.value)}
    >
      {filter.label}
      {#if filter.count !== null}
        <span class="badge badge-xs" class:badge-warning={statut === filter.value}>
          {filter.count}
        </span>
      {/if}
    </button>
  {/each}
</div>