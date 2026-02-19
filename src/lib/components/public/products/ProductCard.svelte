<script lang="ts">
  import { ShoppingCart, Package } from 'lucide-svelte';
  import { cart } from '$lib/stores/cart.store';

  let { produit } = $props<{
    produit: {
      id: number;
      nom: string;
      slug: string;
      prix: number;
      stock: number;
      unite?: string;
      image_url?: string | null;
      catalogue_nom?: string;
      categorie_nom?: string;
    };
  }>();

  let added      = $state(false);
  let imgError   = $state(false);

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

  function quickAdd(e: Event) {
    e.preventDefault();
    cart.add({
      produit_id:  produit.id,
      variante_id: null,
      nom:         produit.nom,
      prix:        produit.prix,
      quantite:    1,
      image_url:   produit.image_url,
      slug:        produit.slug,
    });
    added = true;
    setTimeout(() => added = false, 1500);
  }
</script>

<a
  href="/products/{produit.slug}"
  class="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group flex flex-col"
>
  <!-- Image -->
  <div class="aspect-square overflow-hidden rounded-t-xl bg-base-200 relative">

    {#if produit.image_url && !imgError}
      <img
        src={produit.image_url}
        alt={produit.nom}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onerror={() => imgError = true}
      />
    {:else}
      <!-- Placeholder SVG inline — pas besoin de fichier externe -->
      <div class="w-full h-full flex items-center justify-center bg-base-200">
        <Package size={48} class="text-base-content/20" />
      </div>
    {/if}

    <!-- Badge stock -->
    {#if produit.stock <= 0}
      <div class="absolute top-2 left-2">
        <span class="badge badge-error badge-sm">Rupture</span>
      </div>
    {:else if produit.stock <= 5}
      <div class="absolute top-2 left-2">
        <span class="badge badge-warning badge-sm">Stock limité</span>
      </div>
    {/if}

    <!-- Bouton add rapide -->
    <button
      class="absolute bottom-2 right-2 btn btn-primary btn-sm btn-circle shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      onclick={quickAdd}
      title="Ajouter au panier"
    >
      {#if added}
        <span class="text-xs font-bold">✓</span>
      {:else}
        <ShoppingCart size={14} />
      {/if}
    </button>

  </div>

  <!-- Infos -->
  <div class="p-3 flex flex-col gap-1.5 flex-1">
    {#if produit.categorie_nom}
      <span class="text-xs text-base-content/40">{produit.categorie_nom}</span>
    {/if}
    <p class="text-sm font-medium leading-snug line-clamp-2 flex-1">{produit.nom}</p>
    <div class="flex items-center justify-between mt-1">
      <span class="font-bold text-primary">{formatPrix(produit.prix)}</span>
      {#if produit.unite}
        <span class="text-xs text-base-content/40">/{produit.unite}</span>
      {/if}
    </div>
  </div>

</a>