<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import CatalogForm from '$lib/components/dashboard/catalogs/CatalogForm.svelte';

  let { form } = $props();
</script>

<svelte:head>
  <title>New Catalog — Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-6 max-w-2xl">

  <!-- Header -->
  <div class="flex items-center gap-3">
    <a
      href="/dashboard/catalogues"
      class="btn btn-ghost btn-sm btn-circle"
      aria-label="Back"
    >
      <ArrowLeft size={18} />
    </a>
    <div>
      <h1 class="text-lg font-bold">New Catalog</h1>
      <p class="text-xs text-base-content/50">
        Create a new product catalog
      </p>
    </div>
  </div>

  <!-- Error global -->
  {#if form?.error}
    <div class="alert alert-error text-sm">
      {form.error}
    </div>
  {/if}

  <!-- Form -->
  <CatalogForm action="?" />

</div>