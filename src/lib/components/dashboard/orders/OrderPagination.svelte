<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  let { page, totalPages, onPageChange } = $props<{
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
  }>();

  function getPages(): (number | '...')[] {
    const pages: (number | '...')[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        Math.abs(i - page) <= 1
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== '...'
      ) {
        pages.push('...');
      }
    }

    return pages;
  }
</script>

{#if totalPages > 1}
  <div class="flex items-center justify-between px-4 py-3 border-t border-base-200">

    <!-- Info -->
    <span class="text-xs text-base-content/50">
      Page {page} of {totalPages}
    </span>

    <!-- Buttons -->
    <div class="flex items-center gap-1">

      <!-- Prev -->
      <button
        class="btn btn-ghost btn-sm btn-circle"
        disabled={page <= 1}
        onclick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} />
      </button>

      <!-- Pages -->
      {#each getPages() as p}
        {#if p === '...'}
          <span class="btn btn-ghost btn-sm btn-circle pointer-events-none opacity-50">
            …
          </span>
        {:else}
          <button
            class="btn btn-sm btn-circle"
            class:btn-primary={p === page}
            class:btn-ghost={p !== page}
            onclick={() => onPageChange(p as number)}
          >
            {p}
          </button>
        {/if}
      {/each}

      <!-- Next -->
      <button
        class="btn btn-ghost btn-sm btn-circle"
        disabled={page >= totalPages}
        onclick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={16} />
      </button>

    </div>
  </div>
{/if}