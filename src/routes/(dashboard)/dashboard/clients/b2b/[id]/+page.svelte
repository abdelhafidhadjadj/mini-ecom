<script lang="ts">
  import B2BClientHeader     from '$lib/components/dashboard/clients/b2b/B2BClientHeader.svelte';
  import B2BClientApproveAlert from '$lib/components/dashboard/clients/b2b/B2BClientApproveAlert.svelte';
  import B2BClientStats      from '$lib/components/dashboard/clients/b2b/B2BClientStats.svelte';
  import B2BClientOrders     from '$lib/components/dashboard/clients/b2b/B2BClientOrders.svelte';
  import B2BClientInfo       from '$lib/components/dashboard/clients/b2b/B2BClientInfo.svelte';
  import B2BClientManagement from '$lib/components/dashboard/clients/b2b/B2BClientManagement.svelte';
  import B2BClientNotes      from '$lib/components/dashboard/clients/b2b/B2BClientNotes.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.client.nom_entreprise} — B2B Client</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-6">

  <B2BClientHeader client={data.client} />

  {#if data.client.statut === 'en_attente'}
    <B2BClientApproveAlert typesClient={data.typesClient} />
  {/if}

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">

    <!-- Colonne gauche -->
    <div class="xl:col-span-2 flex flex-col gap-4 lg:gap-6">
      <B2BClientStats stats={data.statsCommandes} />
      <B2BClientOrders commandes={data.commandes} />
    </div>

    <!-- Colonne droite -->
    <div class="flex flex-col gap-4 lg:gap-6">
      <B2BClientInfo client={data.client} />
      {#if data.client.statut !== 'en_attente'}
        <B2BClientManagement client={data.client} typesClient={data.typesClient} />
      {/if}
      <B2BClientNotes notes={data.client.notes} />
    </div>

  </div>

</div>