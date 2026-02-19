<script lang="ts">
  import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-svelte';
  import { cart, cartTotal } from '$lib/stores/cart.store';

  let { open = false, onClose } = $props<{
    open: boolean;
    onClose: () => void;
  }>();

  function formatPrix(n: number): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }
</script>

<!-- Backdrop -->
{#if open}
  <div
    class="fixed inset-0 bg-black/40 z-40 transition-opacity"
    onclick={onClose}
  ></div>
{/if}

<!-- Drawer -->
<div
  class="fixed top-0 right-0 h-full w-full max-w-sm bg-base-100 shadow-2xl z-50 flex flex-col transition-transform duration-300"
  class:translate-x-0={open}
  class:translate-x-full={!open}
>

  <!-- Header -->
  <div class="flex items-center justify-between p-4 border-b border-base-200">
    <div class="flex items-center gap-2">
      <ShoppingCart size={18} />
      <h2 class="font-semibold">Mon Panier</h2>
      <span class="badge badge-primary badge-sm">{$cart.length}</span>
    </div>
    <button class="btn btn-ghost btn-sm btn-circle" onclick={onClose}>
      <X size={18} />
    </button>
  </div>

  <!-- Items -->
  <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
    {#if $cart.length === 0}
      <div class="flex flex-col items-center justify-center h-full gap-3 text-base-content/40">
        <ShoppingCart size={48} class="opacity-20" />
        <p class="text-sm">Votre panier est vide</p>
        <button class="btn btn-primary btn-sm" onclick={onClose}>
          Continuer les achats
        </button>
      </div>
    {:else}
      {#each $cart as item}
        <div class="card bg-base-200/50 border border-base-200">
          <div class="card-body p-3 gap-2">

            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <p class="font-medium text-sm leading-snug">{item.nom}</p>
                {#if item.variante_nom}
                  <p class="text-xs text-base-content/50">{item.variante_nom}</p>
                {/if}
              </div>
              <button
                class="btn btn-ghost btn-xs btn-circle text-error shrink-0"
                onclick={() => cart.remove(item.produit_id, item.variante_id)}
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <!-- Quantité -->
              <div class="flex items-center gap-1">
                <button
                  class="btn btn-xs btn-outline btn-square"
                  onclick={() => cart.updateQuantite(item.produit_id, item.variante_id ?? null, item.quantite - 1)}
                >
                  <Minus size={10} />
                </button>
                <span class="text-sm font-medium w-6 text-center">{item.quantite}</span>
                <button
                  class="btn btn-xs btn-outline btn-square"
                  onclick={() => cart.updateQuantite(item.produit_id, item.variante_id ?? null, item.quantite + 1)}
                >
                  <Plus size={10} />
                </button>
              </div>
              <!-- Prix -->
              <span class="font-bold text-primary text-sm">
                {formatPrix(item.prix * item.quantite)}
              </span>
            </div>

          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Footer -->
  {#if $cart.length > 0}
    <div class="p-4 border-t border-base-200 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="font-medium">Total</span>
        <span class="text-xl font-bold text-primary">{formatPrix($cartTotal)}</span>
      </div>
      <a href="/cart" class="btn btn-primary w-full" onclick={onClose}>
        Voir le panier & Commander
      </a>
    </div>
  {/if}

</div>