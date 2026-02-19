<script lang="ts">
  import { Search, Filter } from 'lucide-svelte';

  let { type, statut, search, total, onStatutChange, onSearchChange } = $props<{
    type: string;
    statut: string;
    search: string;
    total: number;
    onStatutChange: (s: string) => void;
    onSearchChange: (s: string) => void;
  }>();

  const statutsB2B = [
    { value: '',           label: 'All'       },
    { value: 'en_attente', label: 'Pending'   },
    { value: 'approuve',   label: 'Approved'  },
    { value: 'rejete',     label: 'Rejected'  },
    { value: 'suspendu',   label: 'Suspended' },
  ];

  let searchValue   = $state(search);
  let searchTimeout: ReturnType<typeof setTimeout>;

  function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => onSearchChange(searchValue), 400);
  }
</script>

<div class="flex flex-col gap-3">

  {#if type === 'b2b'}
    <div class="flex flex-wrap gap-2">
      {#each statutsB2B as s}
        <button
          onclick={() => onStatutChange(s.value)}
          class="btn btn-sm gap-1"
          class:btn-primary={statut === s.value && s.value === ''}
          class:btn-ghost={statut !== s.value}
          class:btn-warning={statut === s.value && s.value === 'en_attente'}
          class:btn-success={statut === s.value && s.value === 'approuve'}
          class:btn-error={statut === s.value && s.value === 'rejete'}
          class:btn-neutral={statut === s.value && s.value === 'suspendu'}
        >
          {s.label}
        </button>
      {/each}
    </div>
  {/if}

  <div class="card bg-base-100 border border-base-200 shadow-sm">
    <div class="card-body p-3">
      <div class="flex gap-3 items-center">
        <label class="input input-bordered flex items-center gap-2 flex-1">
          <Search size={15} class="text-base-content/40" />
          <input
            type="text"
            placeholder={type === 'b2b'
              ? 'Search by company, contact, email...'
              : 'Search by name, phone, wilaya...'}
            class="grow text-sm"
            bind:value={searchValue}
            oninput={handleSearch}
          />
        </label>
        <div class="text-sm text-base-content/50 flex items-center gap-1.5 shrink-0">
          <Filter size={14} />
          {total} result{total > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  </div>

</div>