<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import B2CClientStats  from '$lib/components/dashboard/clients/b2c/B2CClientStats.svelte';
  import B2CClientOrders from '$lib/components/dashboard/clients/b2c/B2CClientOrders.svelte';
  import B2CClientInfo   from '$lib/components/dashboard/clients/b2c/B2CClientInfo.svelte';

  let { data } = $props();

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>{data.client.client_nom} — B2C Client</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-6">

  <!-- Header -->
  <div class="flex items-center gap-3">
    <a href="/dashboard/clients?type=b2c" class="btn btn-ghost btn-sm btn-circle">
      <ArrowLeft size={18} />
    </a>
    <div class="flex-1">
      <div class="flex items-center gap-3">
        <h1 class="text-lg font-bold">{data.client.client_nom}</h1>
        <span class="badge badge-info">B2C</span>
      </div>
      <p class="text-xs text-base-content/50 mt-0.5">
        Customer since {formatDate(data.client.premiere_commande)}
      </p>
    </div>
  </div>

  <!-- Contenu -->
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">

    <div class="xl:col-span-2 flex flex-col gap-4 lg:gap-6">
      <B2CClientStats stats={data.client} />
      <B2CClientOrders commandes={data.commandes} />
    </div>

    <div class="flex flex-col gap-4 lg:gap-6">
      <B2CClientInfo client={data.client} telephone={data.telephone} />
    </div>

  </div>

</div>