<script lang="ts">
  import { Search, X } from 'lucide-svelte';

  let { catalogues, categories, search, catalogue, categorie, sort, onFilter } = $props<{
    catalogues:  { id: number; nom: string; slug: string }[];
    categories:  { id: number; nom: string; slug: string }[];
    search:      string;
    catalogue:   string;
    categorie:   string;
    sort:        string;
    onFilter:    (params: Record<string, string>) => void;
  }>();

  let searchValue = $state(search);
  let searchTimeout: ReturnType<typeof setTimeout>;

  const sortOptions = [
    { value: 'newest',     label: 'Plus récents'   },
    { value: 'price_asc',  label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant'},
    { value: 'name',       label: 'Nom A→Z'        },
  ];

  function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      onFilter({ search: searchValue, catalogue, categorie, sort });
    }, 400);
  }

  function resetFilters() {
    searchValue = '';
    onFilter({ search: '', catalogue: '', categorie: '', sort: 'newest' });
  }

  const hasFilters = $derived(!!search || !!catalogue || !!categorie);
</script>

<div class="flex flex-col gap-4">

  <!-- Search -->
  <label class="input input-bordered flex items-center gap-2">
    <Search size={15} class="text-base-content/40 shrink-0" />
    <input
      type="text"
      placeholder="Rechercher un produit..."
      class="grow text-sm"
      bind:value={searchValue}
      oninput={handleSearch}
    />
  </label>

  <!-- Sort -->
  <div class="flex flex-col gap-1.5">
    <span class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Trier par</span>
    <select
      class="select select-bordered select-sm w-full"
      value={sort}
      onchange={(e) => onFilter({ search, catalogue, categorie, sort: e.currentTarget.value })}
    >
      {#each sortOptions as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>

  <!-- Catalogues -->
  {#if catalogues.length > 0}
    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Catalogue</span>
      <div class="flex flex-col gap-1">
        <button
          onclick={() => onFilter({ search, catalogue: '', categorie, sort })}
          class="text-left text-sm px-2 py-1 rounded-lg transition-colors"
          class:bg-primary={catalogue === ''}
          class:text-primary-content={catalogue === ''}
          class:hover:bg-base-200={catalogue !== ''}
        >
          Tous
        </button>
        {#each catalogues as cat}
          <button
            onclick={() => onFilter({ search, catalogue: cat.slug, categorie, sort })}
            class="text-left text-sm px-2 py-1 rounded-lg transition-colors"
            class:bg-primary={catalogue === cat.slug}
            class:text-primary-content={catalogue === cat.slug}
            class:hover:bg-base-200={catalogue !== cat.slug}
          >
            {cat.nom}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Catégories -->
  {#if categories.length > 0}
    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Catégorie</span>
      <div class="flex flex-col gap-1">
        <button
          onclick={() => onFilter({ search, catalogue, categorie: '', sort })}
          class="text-left text-sm px-2 py-1 rounded-lg transition-colors"
          class:bg-primary={categorie === ''}
          class:text-primary-content={categorie === ''}
          class:hover:bg-base-200={categorie !== ''}
        >
          Toutes
        </button>
        {#each categories as cat}
          <button
            onclick={() => onFilter({ search, catalogue, categorie: cat.slug, sort })}
            class="text-left text-sm px-2 py-1 rounded-lg transition-colors"
            class:bg-primary={categorie === cat.slug}
            class:text-primary-content={categorie === cat.slug}
            class:hover:bg-base-200={categorie !== cat.slug}
          >
            {cat.nom}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Reset -->
  {#if hasFilters}
    <button
      class="btn btn-ghost btn-sm gap-1 text-error"
      onclick={resetFilters}
    >
      <X size={14} />
      Effacer les filtres
    </button>
  {/if}

</div>