<script lang="ts">
  import { ShoppingCart, ArrowRight, Wrench } from 'lucide-svelte';

  let { stats } = $props<{
    stats: {
      total_products: number;
      total_categories: number;
      total_catalogs: number;
    };
  }>();
</script>

<section class="relative overflow-hidden bg-base-900 min-h-[90vh] flex items-center">

  <!-- Grille de fond -->
  <div class="absolute inset-0 opacity-[0.04]"
    style="background-image: linear-gradient(var(--color-base-content) 1px, transparent 1px), linear-gradient(90deg, var(--color-base-content) 1px, transparent 1px); background-size: 40px 40px;">
  </div>

  <!-- Cercles décoratifs -->
  <div class="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
    style="background: radial-gradient(circle, oklch(var(--p)/0.15) 0%, transparent 70%);">
  </div>
  <div class="absolute -bottom-48 -left-24 w-[400px] h-[400px] rounded-full"
    style="background: radial-gradient(circle, oklch(var(--a)/0.1) 0%, transparent 70%);">
  </div>

  <div class="container mx-auto px-4 py-20 relative z-10">
    <div class="grid lg:grid-cols-2 gap-16 items-center">

      <!-- Contenu -->
      <div class="flex flex-col gap-8">

        <!-- Eyebrow -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-[2px] bg-primary"></div>
          <span class="text-primary text-xs font-bold uppercase tracking-[0.3em]">
            Algérie • Quincaillerie Professionnelle
          </span>
        </div>

        <!-- Titre -->
        <h1 class="text-5xl lg:text-7xl font-black leading-[0.95] tracking-tight">
          <span class="block text-base-content">OUTILS</span>
          <span class="block text-base-content">BOULONS</span>
          <span class="block text-primary">&amp; PLUS.</span>
        </h1>

        <!-- Sous-titre -->
        <p class="text-base-content/60 text-lg max-w-md leading-relaxed">
          Tout ce dont vous avez besoin pour vos projets professionnels.
          Qualité garantie, livraison rapide à travers l'Algérie.
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap gap-4">
          <a href="/products"
            class="btn btn-primary btn-lg gap-3 rounded-none font-bold tracking-wide uppercase text-sm px-8"
          >
            <ShoppingCart size={18} />
            Voir les produits
          </a>
          <a href="#catalogues"
            class="btn btn-ghost btn-lg gap-2 rounded-none border border-base-content/20 font-medium tracking-wide uppercase text-sm"
          >
            Catalogues
            <ArrowRight size={18} />
          </a>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-0 border border-base-content/10 mt-4">
          <div class="p-5 border-r border-base-content/10">
            <div class="text-4xl font-black text-primary tabular-nums">
              {stats?.total_products ?? 0}<span class="text-2xl">+</span>
            </div>
            <div class="text-xs text-base-content/50 uppercase tracking-widest mt-1">Produits</div>
          </div>
          <div class="p-5 border-r border-base-content/10">
            <div class="text-4xl font-black tabular-nums">
              {stats?.total_categories ?? 0}<span class="text-2xl">+</span>
            </div>
            <div class="text-xs text-base-content/50 uppercase tracking-widest mt-1">Catégories</div>
          </div>
          <div class="p-5">
            <div class="text-4xl font-black tabular-nums">
              {stats?.total_catalogs ?? 0}
            </div>
            <div class="text-xs text-base-content/50 uppercase tracking-widest mt-1">Catalogues</div>
          </div>
        </div>

      </div>

      <!-- Visuel décoratif -->
      <div class="hidden lg:flex items-center justify-center relative">
        <div class="relative w-[420px] h-[420px]">

          <!-- Cercle tournant -->
          <div class="absolute inset-0 rounded-full border border-primary/20 animate-spin"
            style="animation-duration: 20s;">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary"></div>
          </div>
          <div class="absolute inset-8 rounded-full border border-base-content/5 animate-spin"
            style="animation-duration: 15s; animation-direction: reverse;">
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-accent"></div>
          </div>

          <!-- Centre -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-48 h-48 bg-base-100 border border-base-content/10 shadow-2xl flex items-center justify-center">
              <Wrench size={80} class="text-primary opacity-80" />
            </div>
          </div>

          <!-- Labels -->
          <div class="absolute top-4 right-0 bg-primary text-primary-content text-xs font-bold px-3 py-1.5 uppercase tracking-widest">
            Pro Grade
          </div>
          <div class="absolute bottom-8 left-0 bg-base-content text-base-100 text-xs font-bold px-3 py-1.5 uppercase tracking-widest">
            Since 2020
          </div>

        </div>
      </div>

    </div>
  </div>

</section>