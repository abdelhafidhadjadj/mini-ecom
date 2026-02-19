<script lang="ts">
  import StockTable from '$lib/components/dashboard/stock/StockTable.svelte';
  import StockAdjustModal from '$lib/components/dashboard/stock/StockAdjustModal.svelte';

  let { data } = $props();

  let selectedProduct = $state<any>(null);
</script>

<svelte:head>
  <title>Stock Management — Dashboard</title>
</svelte:head>

<StockTable
  produits={data.produits}
  stats={data.stats}
  filter={data.filter}
  onAdjust={(product) => selectedProduct = product}
/>

{#if selectedProduct}
  <StockAdjustModal
    product={selectedProduct}
    onClose={() => selectedProduct = null}
  />
{/if}