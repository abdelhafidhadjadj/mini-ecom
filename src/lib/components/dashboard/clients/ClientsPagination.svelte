<script lang="ts">
  let { page, totalPages, onPageChange } = $props<{
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
  }>();
</script>

{#if totalPages > 1}
  <div class="flex justify-center gap-2 p-4 border-t border-base-200">
    {#each Array(totalPages) as _, i}
      <button
        onclick={() => onPageChange(i + 1)}
        class="btn btn-xs"
        class:btn-primary={page === i + 1}
        class:btn-ghost={page !== i + 1}
      >
        {i + 1}
      </button>
    {/each}
  </div>
{/if}