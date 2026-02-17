<script lang="ts">
  import CategoryTable from '$lib/components/dashboard/catalogs/CategoryTable.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Categories — Dashboard</title>
</svelte:head>

<CategoryTable categories={data.categories} />