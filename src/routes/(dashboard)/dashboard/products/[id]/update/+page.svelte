<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import ProductForm from '$lib/components/dashboard/products/ProductForm.svelte';

  let { data, form } = $props();
</script>

<svelte:head>
  <title>Edit {data.product.nom} — Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-6">

  <!-- Header -->
  <div class="flex items-center gap-3">
    <a
      href="/dashboard/products"
      class="btn btn-ghost btn-sm btn-circle"
      aria-label="Back"
    >
      <ArrowLeft size={18} />
    </a>
    <div>
      <h1 class="text-lg font-bold">Edit Product</h1>
      <p class="text-xs text-base-content/50">
        {data.product.nom}
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
  <ProductForm
    product={data.product}
    categories={data.categories}
    action="?"
  />

</div>