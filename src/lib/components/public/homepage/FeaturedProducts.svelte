<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';
  import ProductCard from '$lib/components/public/products/ProductCard.svelte';

  let { produits } = $props<{
    produits: {
      id: number;
      nom: string;
      slug: string;
      prix: number;
      stock: number;
      unite?: string;
      image_url?: string | null;
      categorie_nom?: string;
    }[];
  }>();
</script>

<section class="py-20 lg:py-28 bg-base-200">
  <div class="container mx-auto px-4">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-[2px] bg-primary"></div>
          <span class="text-primary text-xs font-bold uppercase tracking-[0.3em]">Nouveautés</span>
        </div>
        <h2 class="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
          Derniers<br/>arrivages.
        </h2>
      </div>
      <a href="/products" class="btn btn-ghost gap-2 rounded-none border border-base-content/20 uppercase text-xs tracking-widest shrink-0">
        Voir tout
        <ArrowRight size={14} />
      </a>
    </div>

    <!-- Grid produits -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
      {#each produits as produit}
        <ProductCard {produit} />
      {/each}
    </div>

  </div>
</section>