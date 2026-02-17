<script lang="ts">
  import CatalogTable from '$lib/components/dashboard/catalogs/CatalogTable.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Catalogues — Dashboard</title>
</svelte:head>

<CatalogTable catalogs={data.catalogues} />