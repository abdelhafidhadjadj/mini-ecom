<script lang="ts">
  import { cartCount } from '$lib/stores/cart.store';
  import HeroSection      from '$lib/components/public/homepage/HeroSection.svelte';
  import CataloguesSection from '$lib/components/public/homepage/CataloguesSection.svelte';
  import FeaturedProducts  from '$lib/components/public/homepage/FeaturedProducts.svelte';
  import FeaturesSection   from '$lib/components/public/homepage/FeaturesSection.svelte';
  import CTASection        from '$lib/components/public/homepage/CTASection.svelte';
  import CartDrawer        from '$lib/components/public/cart/CartDrawer.svelte';

  let { data } = $props();
  let cartOpen = $state(false);
</script>

<svelte:head>
  <title>Outillage Pro — Quincaillerie Professionnelle en Algérie</title>
  <meta name="description" content="Votre partenaire de confiance pour l'outillage et la boulonnerie en Algérie. Prix compétitifs et livraison rapide." />
</svelte:head>

<CartDrawer open={cartOpen} onClose={() => cartOpen = false} />

<!-- Bouton panier flottant -->
<button
  class="fixed bottom-6 right-6 btn btn-primary btn-circle shadow-xl z-30 w-14 h-14"
  onclick={() => cartOpen = true}
>
  <span class="relative">
    <span class="text-xl">🛒</span>
    {#if $cartCount > 0}
      <span class="absolute -top-3 -right-3 badge badge-error badge-sm font-bold">
        {$cartCount}
      </span>
    {/if}
  </span>
</button>

<HeroSection stats={data.stats} />
<CataloguesSection catalogues={data.catalogues} />
<FeaturedProducts produits={data.featuredProducts} />
<FeaturesSection />
<CTASection />