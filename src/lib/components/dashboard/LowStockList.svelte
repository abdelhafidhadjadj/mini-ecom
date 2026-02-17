<script lang="ts">
  import { ArrowRight, PackageX, AlertTriangle } from 'lucide-svelte';

  let { items } = $props<{
    items: {
      id: number;
      nom: string;
      stock: number;
      stock_minimum: number;
    }[];
  }>();
</script>

<div class="card bg-base-100 shadow-sm border border-base-200 h-full">
  <div class="card-body p-0">

    <!-- Header -->
    <div class="flex items-center justify-between p-4 lg:p-5 border-b border-base-200">
      <div class="flex items-center gap-2">
        <PackageX size={18} class="text-error shrink-0" />
        <h2 class="font-semibold text-sm lg:text-base">Stock faible</h2>
        {#if items.length > 0}
          <span class="badge badge-error badge-sm">{items.length}</span>
        {/if}
      </div>
      <a
        href="/dashboard/stock"
        class="btn btn-ghost btn-xs gap-1 text-primary shrink-0"
      >
        <span class="hidden sm:inline">Voir tout</span>
        <ArrowRight size={14} />
      </a>
    </div>

    <!-- Liste -->
    <div class="p-3 lg:p-4 flex flex-col gap-2 overflow-y-auto max-h-80 lg:max-h-none">
      {#each items as produit}
        <a
          href="/dashboard/produits/{produit.id}/modifier"
          class="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-base-200/60 transition-colors group"
        >
          <!-- Icône + infos -->
          <div class="flex items-center gap-2.5 min-w-0">
            <div
              class="rounded-lg p-1.5 shrink-0"
              class:bg-error={produit.stock === 0}
              class:text-error-content={produit.stock === 0}
              class:bg-warning={produit.stock > 0}
              class:text-warning-content={produit.stock > 0}
            >
              <AlertTriangle size={14} />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {produit.nom}
              </p>
              <p class="text-xs text-base-content/50">
                Min requis : {produit.stock_minimum}
              </p>
            </div>
          </div>

          <!-- Badge stock -->
          <div class="shrink-0">
            {#if produit.stock === 0}
              <span class="badge badge-error badge-sm font-medium">
                Rupture
              </span>
            {:else}
              <span class="badge badge-warning badge-sm font-medium">
                {produit.stock} restant{produit.stock > 1 ? 's' : ''}
              </span>
            {/if}
          </div>
        </a>
      {/each}

      {#if items.length === 0}
        <div class="flex flex-col items-center justify-center py-8 gap-2 text-base-content/40">
          <span class="text-3xl">✅</span>
          <p class="text-sm">Tous les stocks sont OK</p>
        </div>
      {/if}
    </div>

  </div>
</div>