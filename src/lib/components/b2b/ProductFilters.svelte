<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Search, X } from 'lucide-svelte';

  let { catalogues, categories, search, catalogue, categorie, sort, total } = $props<{
    catalogues: { id: number; nom: string; slug: string }[];
    categories: { id: number; nom: string; slug: string }[];
    search: string;
    catalogue: string;
    categorie: string;
    sort: string;
    total: number;
  }>();

  let searchValue = $state(search);
  let searchTimeout: ReturnType<typeof setTimeout>;

  function onSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      updateParams({ search: searchValue || undefined, page: undefined });
    }, 400);
  }

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams($page.url.searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    goto(`?${params.toString()}`);
  }

  function clearFilters() {
    searchValue = '';
    goto('/b2b/products');
  }

  let hasFilters = $derived(search || catalogue || categorie);
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-4 gap-4">

    <!-- Search -->
    <div class="flex gap-2">
      <label class="input input-bordered flex items-center gap-2 flex-1">
        <Search size={16} class="text-base-content/40 shrink-0" />
        <input
          type="text"
          placeholder="Search products..."
          class="grow text-sm"
          bind:value={searchValue}
          oninput={onSearchInput}
        />
      </label>
      {#if hasFilters}
        <button
          class="btn btn-ghost btn-sm"
          onclick={clearFilters}
          title="Clear filters"
        >
          <X size={16} />
        </button>
      {/if}
    </div>

    <!-- Filters row -->
    <div class="flex flex-wrap gap-3">

      <!-- Catalogue filter -->
      <select
        class="select select-bordered select-sm w-full sm:w-auto"
        value={catalogue}
        onchange={(e) => updateParams({ catalogue: e.currentTarget.value || undefined, categorie: undefined, page: undefined })}
      >
        <option value="">All catalogs</option>
        {#each catalogues as cat}
          <option value={cat.slug}>{cat.nom}</option>
        {/each}
      </select>

      <!-- Category filter -->
      <select
        class="select select-bordered select-sm w-full sm:w-auto"
        value={categorie}
        onchange={(e) => updateParams({ categorie: e.currentTarget.value || undefined, page: undefined })}
      >
        <option value="">All categories</option>
        {#each categories as cat}
          <option value={cat.slug}>{cat.nom}</option>
        {/each}
      </select>

      <!-- Sort -->
      <select
        class="select select-bordered select-sm w-full sm:w-auto"
        value={sort}
        onchange={(e) => updateParams({ sort: e.currentTarget.value })}
      >
        <option value="nom_asc">Name A-Z</option>
        <option value="nom_desc">Name Z-A</option>
        <option value="prix_asc">Price Low-High</option>
        <option value="prix_desc">Price High-Low</option>
        <option value="recent">Most Recent</option>
      </select>

      <!-- Results count -->
      <div class="flex items-center text-sm text-base-content/60 ml-auto">
        <span class="font-medium">{total}</span>
        <span class="ml-1">products</span>
      </div>

    </div>

  </div>
</div>