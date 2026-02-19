<script lang="ts">
  import { enhance } from '$app/forms';
  import { Package, Plus, Minus, Edit3 } from 'lucide-svelte';

  let { product, onClose } = $props<{
    product: {
      id: number;
      nom: string;
      stock: number;
      stock_minimum: number;
      unite_vente: string;
    };
    onClose: () => void;
  }>();

  let operation = $state<'set' | 'add' | 'remove'>('add');
  let quantity  = $state(0);
  let note      = $state('');
  let loading   = $state(false);

  let newStock = $derived(
    operation === 'set' ? quantity :
    operation === 'add' ? product.stock + quantity :
    Math.max(0, product.stock - quantity)
  );
</script>

<div class="modal modal-open">
  <div class="modal-box max-w-md">

    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="font-bold text-lg">Adjust Stock</h3>
        <p class="text-sm text-base-content/50 mt-1">{product.nom}</p>
      </div>
      <button
        type="button"
        class="btn btn-ghost btn-sm btn-circle"
        onclick={onClose}
      >
        ✕
      </button>
    </div>

    <!-- Current stock -->
    <div class="bg-base-200/50 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-base-content/60">Current Stock</span>
        <div class="flex items-center gap-2">
          <Package size={16} class="text-base-content/40" />
          <span class="font-mono font-bold text-xl">
            {product.stock}
          </span>
          <span class="text-xs text-base-content/40">
            {product.unite_vente}
          </span>
        </div>
      </div>
    </div>

    <form
      method="POST"
      action="?/adjust"
      use:enhance={() => {
        loading = true;
        return async ({ update, result }) => {
          await update();
          loading = false;
          if (result.type === 'success') {
            onClose();
          }
        };
      }}
      class="flex flex-col gap-4"
    >

      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="operation" value={operation} />

      <!-- Operation type -->
      <div class="flex gap-2">
        <button
          type="button"
          class="btn btn-sm flex-1 gap-2"
          class:btn-primary={operation === 'add'}
          class:btn-ghost={operation !== 'add'}
          onclick={() => operation = 'add'}
        >
          <Plus size={14} />
          Add
        </button>
        <button
          type="button"
          class="btn btn-sm flex-1 gap-2"
          class:btn-error={operation === 'remove'}
          class:btn-ghost={operation !== 'remove'}
          onclick={() => operation = 'remove'}
        >
          <Minus size={14} />
          Remove
        </button>
        <button
          type="button"
          class="btn btn-sm flex-1 gap-2"
          class:btn-warning={operation === 'set'}
          class:btn-ghost={operation !== 'set'}
          onclick={() => operation = 'set'}
        >
          <Edit3 size={14} />
          Set
        </button>
      </div>

      <!-- Quantity -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="quantity">
          <span class="label-text font-medium">
            {#if operation === 'set'}
              New Stock Value
            {:else if operation === 'add'}
              Quantity to Add
            {:else}
              Quantity to Remove
            {/if}
          </span>
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          class="input input-bordered w-full text-center font-mono text-lg"
          placeholder="0"
          min="0"
          bind:value={quantity}
          required
        />
      </div>

      <!-- Preview -->
      {#if quantity > 0}
        <div class="alert shadow-sm" class:alert-success={operation === 'add'} class:alert-error={operation === 'remove'} class:alert-warning={operation === 'set'}>
          <div class="flex items-center justify-between w-full">
            <span class="text-sm font-medium">New stock will be:</span>
            <span class="font-mono font-bold text-lg">{newStock}</span>
          </div>
        </div>

        {#if newStock <= product.stock_minimum && newStock > 0}
          <div class="alert alert-warning text-sm">
            ⚠️ Stock will be below minimum ({product.stock_minimum})
          </div>
        {:else if newStock === 0}
          <div class="alert alert-error text-sm">
            ❌ Product will be out of stock
          </div>
        {/if}
      {/if}

      <!-- Note -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="note">
          <span class="label-text font-medium">Note</span>
          <span class="label-text-alt text-base-content/40">Optional</span>
        </label>
        <textarea
          id="note"
          name="note"
          class="textarea textarea-bordered resize-none text-sm"
          placeholder="Reason for adjustment..."
          rows="2"
          bind:value={note}
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 mt-2">
        <button
          type="button"
          class="btn btn-ghost flex-1"
          onclick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary flex-1"
          disabled={loading || quantity <= 0}
        >
          {#if loading}
            <span class="loading loading-spinner loading-sm"></span>
            Saving...
          {:else}
            Confirm
          {/if}
        </button>
      </div>

    </form>

  </div>
  <div class="modal-backdrop" onclick={onClose}></div>
</div>