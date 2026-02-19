<script lang="ts">
  let { produits } = $props<{
    produits: {
      id: number;
      nom: string;
      slug: string;
      prix: number;
      image_url?: string | null;
    }[];
  }>();

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }
</script>

{#if produits.length > 0}
  <div class="flex flex-col gap-4">
    <h2 class="font-semibold text-base">Produits similaires</h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {#each produits as p}
        <a
          href="/products/{p.slug}"
          class="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
        >
          <div class="aspect-square overflow-hidden rounded-t-xl bg-base-200">
            <img
              src={p.image_url ?? '/placeholder.jpg'}
              alt={p.nom}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="p-3">
            <p class="text-sm font-medium line-clamp-2 leading-snug">{p.nom}</p>
            <p class="text-primary font-bold text-sm mt-1">{formatPrix(p.prix)}</p>
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}