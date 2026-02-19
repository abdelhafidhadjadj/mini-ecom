<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';

  let { catalogues } = $props<{
    catalogues: {
      id: number;
      nom: string;
      slug: string;
      description?: string;
      product_count: number;
    }[];
  }>();

  // Couleurs alternées pour les cards
  const accents = [
    'border-primary bg-primary/5 hover:bg-primary/10',
    'border-accent bg-accent/5 hover:bg-accent/10',
    'border-secondary bg-secondary/5 hover:bg-secondary/10',
    'border-success bg-success/5 hover:bg-success/10',
  ];
</script>

<section id="catalogues" class="py-20 lg:py-28 bg-base-100">
  <div class="container mx-auto px-4">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-[2px] bg-primary"></div>
          <span class="text-primary text-xs font-bold uppercase tracking-[0.3em]">Nos Catalogues</span>
        </div>
        <h2 class="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
          Tout ce qu'il<br/>vous faut.
        </h2>
      </div>
      <a href="/products" class="btn btn-ghost gap-2 rounded-none border border-base-content/20 uppercase text-xs tracking-widest shrink-0">
        Tous les produits
        <ArrowRight size={14} />
      </a>
    </div>

    <!-- Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each catalogues as catalogue, i}
        <a
          href="/catalog/{catalogue.slug}"
          class="group relative border-l-4 border p-6 transition-all duration-300 {accents[i % accents.length]}"
        >
          <!-- Numéro -->
          <div class="text-6xl font-black opacity-10 absolute top-4 right-4 leading-none tabular-nums">
            {String(i + 1).padStart(2, '0')}
          </div>

          <div class="relative z-10 flex flex-col gap-4 h-full min-h-[160px]">
            <h3 class="text-xl font-bold leading-tight group-hover:opacity-70 transition-opacity">
              {catalogue.nom}
            </h3>
            {#if catalogue.description}
              <p class="text-sm text-base-content/60 line-clamp-2 flex-1">
                {catalogue.description}
              </p>
            {:else}
              <div class="flex-1"></div>
            {/if}
            <div class="flex items-center justify-between">
              <span class="text-xs text-base-content/40 uppercase tracking-widest">
                {catalogue.product_count} produits
              </span>
              <ArrowRight size={16} class="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
            </div>
          </div>
        </a>
      {/each}
    </div>

  </div>
</section>