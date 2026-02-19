<script lang="ts">
  let { description } = $props<{ description: string }>();
</script>

{#if description}
  <div class="card bg-base-100 border border-base-200 shadow-sm">
    <div class="card-body p-5 gap-3">
      <h2 class="font-semibold text-base">Description</h2>
      <div class="prose prose-sm max-w-none text-base-content/80">
        {@html description}
      </div>
    </div>
  </div>
{/if}