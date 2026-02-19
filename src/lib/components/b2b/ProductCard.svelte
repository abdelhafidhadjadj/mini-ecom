<script lang="ts">
  import { ShoppingCart, Package } from 'lucide-svelte';

  let { product, onAddToCart } = $props<{
    product: {
      id: number;
      nom: string;
      slug: string;
      prix: number;
      unite_vente: string;
      description?: string;
      categorie_nom: string;
      categorie_slug: string;
      catalogue_nom: string;
      reference?: string;
      image_principale?: string;
    };
    onAddToCart?: (productId: number) => void;
  }>();

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }
</script>

<div class="card bg-base-100 border border-base-200 hover:shadow-xl hover:border-warning transition-all duration-200 group h-full flex flex-col">
  
  <!-- Image -->
  <figure class="relative overflow-hidden bg-base-200 aspect-square">
    <a href="/products/{product.slug}" class="block w-full h-full">
      {#if product.image_principale}
        <img
          src={product.image_principale}
          alt={product.nom}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      {:else}
        <div class="w-full h-full flex items-center justify-center">
          <Package size={48} class="text-base-content/20" />
        </div>
      {/if}
    </a>
    
    <!-- B2B Badge -->
    <div class="absolute top-2 left-2">
      <span class="badge badge-warning badge-sm font-bold">B2B Price</span>
    </div>
  </figure>

  <div class="card-body p-4 flex-1 flex flex-col">
    
    <!-- Category + Catalog -->
    <div class="flex items-center gap-2 text-xs text-base-content/60 mb-1">
      <span>{product.catalogue_nom}</span>
      <span>•</span>
      <span>{product.categorie_nom}</span>
    </div>

    <!-- Title -->
    <a
      href="/products/{product.slug}"
      class="card-title text-base leading-tight mb-2 hover:text-warning transition-colors line-clamp-2 flex-1"
    >
      {product.nom}
    </a>

    <!-- Reference -->
    {#if product.reference}
      <div class="mb-2">
        <span class="font-mono text-xs bg-base-200 px-2 py-1 rounded">
          {product.reference}
        </span>
      </div>
    {/if}

    <!-- Description -->
    {#if product.description}
      <p class="text-xs text-base-content/60 line-clamp-2 mb-3">
        {@html product.description.replace(/<[^>]*>/g, '').substring(0, 80)}...
      </p>
    {/if}

    <!-- Price + Add to cart -->
    <div class="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-base-200">
      <div>
        <div class="font-bold text-lg text-warning">
          {formatPrix(product.prix)}
        </div>
        <div class="text-xs text-base-content/50">
          per {product.unite_vente}
        </div>
      </div>
      
      <button
        class="btn btn-warning btn-sm gap-1.5"
        onclick={() => onAddToCart?.(product.id)}
      >
        <ShoppingCart size={14} />
        <span class="hidden sm:inline">Add</span>
      </button>
    </div>

  </div>

</div>