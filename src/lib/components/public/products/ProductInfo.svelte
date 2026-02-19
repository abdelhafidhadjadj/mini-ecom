<script lang="ts">
  import { ShoppingCart, Package, Tag, MessageCircle } from 'lucide-svelte';
  import { cart } from '$lib/stores/cart.store';

  let { produit, variantes } = $props<{
    produit: {
      id: number;
      nom: string;
      slug: string;
      prix: number;
      stock: number;
      unite?: string;
      catalogue_nom?: string;
      catalogue_slug?: string;
      categorie_nom?: string;
      categorie_slug?: string;
    };
    variantes: {
      id: number;
      nom: string;
      prix_supplement: number;
      stock: number;
    }[];
    imageUrl?: string | null;
  }>();

  let selectedVariante = $state<number | null>(
    variantes.length > 0 ? variantes[0].id : null
  );
  let quantite = $state(1);
  let added    = $state(false);

  const varianteActive = $derived(
    variantes.find(v => v.id === selectedVariante) ?? null
  );

  const prixFinal = $derived(
    produit.prix + (varianteActive?.prix_supplement ?? 0)
  );

  const stockDisponible = $derived(
    varianteActive ? varianteActive.stock : produit.stock
  );

  const enStock = $derived(stockDisponible > 0);

  function formatPrix(n: number): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

  function addToCart() {
    cart.add({
      produit_id:   produit.id,
      variante_id:  selectedVariante,
      nom:          produit.nom,
      variante_nom: varianteActive?.nom ?? null,
      prix:         prixFinal,
      quantite,
      slug:         produit.slug,
    });

    added = true;
    setTimeout(() => added = false, 2000);
  }

  function orderWhatsApp() {
    const varianteTxt = varianteActive ? ` (${varianteActive.nom})` : '';
    const msg = encodeURIComponent(
      `Bonjour, je souhaite commander :\n\n• ${produit.nom}${varianteTxt} x${quantite} — ${formatPrix(prixFinal * quantite)}\n\nMerci`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
</script>

<div class="flex flex-col gap-5">

  <!-- Breadcrumb -->
  <div class="text-xs breadcrumbs text-base-content/50">
    <ul>
      <li><a href="/">Accueil</a></li>
      {#if produit.catalogue_slug}
        <li><a href="/catalog/{produit.catalogue_slug}">{produit.catalogue_nom}</a></li>
      {/if}
      {#if produit.categorie_slug}
        <li><a href="/category/{produit.categorie_slug}">{produit.categorie_nom}</a></li>
      {/if}
      <li class="text-base-content/30">{produit.nom}</li>
    </ul>
  </div>

  <!-- Nom -->
  <h1 class="text-2xl lg:text-3xl font-bold leading-tight">{produit.nom}</h1>

  <!-- Prix -->
  <div class="flex items-baseline gap-2">
    <span class="text-3xl font-bold text-primary">{formatPrix(prixFinal)}</span>
    {#if produit.unite}
      <span class="text-sm text-base-content/50">/ {produit.unite}</span>
    {/if}
    {#if varianteActive?.prix_supplement > 0}
      <span class="text-sm text-base-content/40">
        ({formatPrix(produit.prix)} + {formatPrix(varianteActive.prix_supplement)})
      </span>
    {/if}
  </div>

  <!-- Stock -->
  <div class="flex items-center gap-2">
    <Package size={15} class={enStock ? 'text-success' : 'text-error'} />
    {#if enStock}
      <span class="text-sm text-success font-medium">
        En stock ({stockDisponible} {produit.unite ?? 'unités'})
      </span>
    {:else}
      <span class="text-sm text-error font-medium">Rupture de stock</span>
    {/if}
  </div>

  <!-- Variantes -->
  {#if variantes.length > 0}
    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium">Variante</span>
      <div class="flex flex-wrap gap-2">
        {#each variantes as v}
          <button
            onclick={() => selectedVariante = v.id}
            class="btn btn-sm"
            class:btn-primary={selectedVariante === v.id}
            class:btn-outline={selectedVariante !== v.id}
            disabled={v.stock === 0}
          >
            {v.nom}
            {#if v.prix_supplement > 0}
              <span class="text-xs opacity-70">+{formatPrix(v.prix_supplement)}</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Quantité -->
  <div class="flex flex-col gap-2">
    <span class="text-sm font-medium">Quantité</span>
    <div class="flex items-center gap-2">
      <button
        class="btn btn-sm btn-outline btn-square"
        onclick={() => quantite = Math.max(1, quantite - 1)}
      >−</button>
      <input
        type="number"
        min="1"
        max={stockDisponible}
        bind:value={quantite}
        class="input input-bordered input-sm w-16 text-center"
      />
      <button
        class="btn btn-sm btn-outline btn-square"
        onclick={() => quantite = Math.min(stockDisponible, quantite + 1)}
      >+</button>
    </div>
  </div>

  <!-- Actions -->
  <div class="flex flex-col sm:flex-row gap-3">
    <button
      class="btn btn-primary flex-1 gap-2"
      onclick={addToCart}
      disabled={!enStock}
    >
      {#if added}
        <span class="text-success">✓</span> Ajouté !
      {:else}
        <ShoppingCart size={18} />
        Ajouter au panier
      {/if}
    </button>

    <button
      class="btn btn-success gap-2"
      onclick={orderWhatsApp}
    >
      <MessageCircle size={18} />
      Commander via WhatsApp
    </button>
  </div>

</div>