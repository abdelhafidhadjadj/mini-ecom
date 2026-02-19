<script lang="ts">
  import { cartCount } from '$lib/stores/cart.store';
  import ProductGallery    from '$lib/components/public/products/ProductGallery.svelte';
  import ProductInfo       from '$lib/components/public/products/ProductInfo.svelte';
  import ProductDescription from '$lib/components/public/products/ProductDescription.svelte';
  import SimilarProducts   from '$lib/components/public/products/SimilarProducts.svelte';
  import CartDrawer        from '$lib/components/public/cart/CartDrawer.svelte';

  let { data } = $props();
  let cartOpen = $state(false);

  const imageUrl = $derived(
    data.images.find((i: any) => i.principale)?.url ?? data.images[0]?.url ?? null
  );
</script>

<svelte:head>
  <title>{data.produit.nom} — Outillage Pro</title>
  <meta name="description" content={data.produit.description?.replace(/<[^>]*>/g, '').slice(0, 160)} />
</svelte:head>

<!-- Cart Drawer -->
<CartDrawer open={cartOpen} onClose={() => cartOpen = false} />

<!-- Bouton panier flottant -->
<button
  class="fixed bottom-6 right-6 btn btn-primary btn-circle shadow-lg z-30"
  onclick={() => cartOpen = true}
>
  <span class="relative">
    🛒
    {#if $cartCount > 0}
      <span class="absolute -top-2 -right-2 badge badge-error badge-xs">
        {$cartCount}
      </span>
    {/if}
  </span>
</button>

<div class="max-w-6xl mx-auto px-4 py-6 lg:py-10 flex flex-col gap-8 lg:gap-12">

  <!-- Produit principal -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

    <!-- Galerie -->
    <ProductGallery images={data.images} nom={data.produit.nom} />

    <!-- Infos + actions -->
    <ProductInfo
      produit={data.produit}
      variantes={data.variantes}
      imageUrl={imageUrl}
    />

  </div>

  <!-- Description -->
  <ProductDescription description={data.produit.description} />

  <!-- Produits similaires -->
  <SimilarProducts produits={data.similaires} />

</div>