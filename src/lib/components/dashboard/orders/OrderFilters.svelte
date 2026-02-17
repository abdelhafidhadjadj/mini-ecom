<script lang="ts">
  import { Search, Filter } from 'lucide-svelte';

  let { statuts, statut, search, total, onStatutChange, onSearchChange } = $props<{
    statuts: { value: string; label: string; count: number }[];
    statut: string;
    search: string;
    total: number;
    onStatutChange: (s: string) => void;
    onSearchChange: (s: string) => void;
  }>();

  let searchValue = $state(search);
  let searchTimeout: ReturnType<typeof setTimeout>;

  function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      onSearchChange(searchValue);
    }, 400);
  }
</script>

<div class="flex flex-col gap-3">

  <!-- Status filters -->
  <div class="flex flex-wrap gap-2">
    {#each statuts as s}
      <button
        onclick={() => onStatutChange(s.value)}
        class="btn btn-sm gap-2"
        class:btn-primary={statut === s.value}
        class:btn-ghost={statut !== s.value}
      >
        {s.label}
        <span class="badge badge-xs">{s.count}</span>
      </button>
    {/each}
  </div>

  <!-- Search bar -->
  <div class="card bg-base-100 shadow-sm border border-base-200">
    <div class="card-body p-3 lg:p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <label class="input input-bordered flex items-center gap-2 flex-1">
          <Search size={16} class="text-base-content/40 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, phone, wilaya..."
            class="grow text-sm"
            bind:value={searchValue}
            oninput={handleSearch}
          />
        </label>
        <div class="flex items-center gap-2 text-sm text-base-content/50 shrink-0">
          <Filter size={14} />
          <span>{total} result{total > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  </div>

</div>