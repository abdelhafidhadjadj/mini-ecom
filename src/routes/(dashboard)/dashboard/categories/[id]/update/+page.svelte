<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import CategoryForm from '$lib/components/dashboard/catalogs/CategoryForm.svelte';

  let { data, form } = $props();
</script>

<svelte:head>
  <title>Edit {data.category.nom} — Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-6 max-w-2xl">

  <!-- Header -->
  <div class="flex items-center gap-3">
    <a
      href="/dashboard/categories"
      class="btn btn-ghost btn-sm btn-circle"
      aria-label="Back"
    >
      <ArrowLeft size={18} />
    </a>
    <div>
      <h1 class="text-lg font-bold">Edit Category</h1>
      <p class="text-xs text-base-content/50">
        {data.category.nom}
      </p>
    </div>
  </div>

  <!-- Error -->
  {#if form?.error}
    <div class="alert alert-error text-sm">
      {form.error}
    </div>
  {/if}

  <!-- Form -->
  <CategoryForm
    category={data.category}
    catalogues={data.catalogues}
    action="?"
  />

</div>