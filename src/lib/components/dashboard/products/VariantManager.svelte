<script lang="ts">
  import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-svelte';

  let { variants = [] } = $props<{
    variants?: {
      id?: number;
      nom: string;
      reference: string;
      prix_supplement: number;
      stock: number;
      actif: boolean;
    }[];
  }>();

  let items = $state(variants.map(v => ({ ...v, _key: Math.random() })));
  let expanded = $state(true);

  function addVariant() {
    items = [...items, {
      _key:            Math.random(),
      nom:             '',
      reference:       '',
      prix_supplement: 0,
      stock:           0,
      actif:           true,
    }];
  }

  function removeVariant(key: number) {
    items = items.filter(v => v._key !== key);
  }
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-0">

    <!-- Header -->
    <button
      type="button"
      class="flex items-center justify-between p-4 lg:p-5 w-full text-left hover:bg-base-200/30 transition-colors"
      onclick={() => expanded = !expanded}
    >
      <div class="flex items-center gap-2">
        <span class="font-semibold">Variants</span>
        <span class="badge badge-ghost badge-sm">{items.length}</span>
        <span class="text-xs text-base-content/40">
          (sizes, grades, dimensions...)
        </span>
      </div>
      {#if expanded}
        <ChevronUp size={16} class="text-base-content/40" />
      {:else}
        <ChevronDown size={16} class="text-base-content/40" />
      {/if}
    </button>

    {#if expanded}
      <div class="border-t border-base-200">

        {#if items.length === 0}
          <div class="p-6 text-center text-base-content/40 text-sm">
            No variants yet — add one if this product comes in different sizes or grades
          </div>
        {:else}

          <!-- Table header -->
          <div class="grid grid-cols-12 gap-2 px-4 py-2 bg-base-200/50 text-xs text-base-content/50 font-medium">
            <div class="col-span-4">Name</div>
            <div class="col-span-3">Reference</div>
            <div class="col-span-2 text-right">Price +</div>
            <div class="col-span-2 text-right">Stock</div>
            <div class="col-span-1"></div>
          </div>

          <!-- Variants list -->
          <div class="flex flex-col divide-y divide-base-200">
            {#each items as item, i (item._key)}
              <div class="grid grid-cols-12 gap-2 px-4 py-3 items-center">

                <!-- Champs cachés pour soumission -->
                {#if item.id}
                  <input type="hidden" name="variant_id_{i}" value={item.id} />
                {/if}
                <input type="hidden" name="variant_actif_{i}" value={item.actif} />

                <!-- Nom -->
                <div class="col-span-4">
                  <input
                    type="text"
                    name="variant_nom_{i}"
                    class="input input-bordered input-sm w-full text-sm"
                    placeholder="Ex: M8x20"
                    bind:value={item.nom}
                    required
                  />
                </div>

                <!-- Référence -->
                <div class="col-span-3">
                  <input
                    type="text"
                    name="variant_reference_{i}"
                    class="input input-bordered input-sm w-full text-sm font-mono"
                    placeholder="Ex: DIN933-M8"
                    bind:value={item.reference}
                  />
                </div>

                <!-- Prix supplément -->
                <div class="col-span-2">
                  <input
                    type="number"
                    name="variant_prix_{i}"
                    class="input input-bordered input-sm w-full text-sm text-right"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    bind:value={item.prix_supplement}
                  />
                </div>

                <!-- Stock -->
                <div class="col-span-2">
                  <input
                    type="number"
                    name="variant_stock_{i}"
                    class="input input-bordered input-sm w-full text-sm text-right"
                    placeholder="0"
                    min="0"
                    bind:value={item.stock}
                  />
                </div>

                <!-- Delete -->
                <div class="col-span-1 flex justify-end">
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10"
                    onclick={() => removeVariant(item._key)}
                    aria-label="Remove variant"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

              </div>
            {/each}
          </div>

        {/if}

        <!-- Input pour nombre de variantes -->
        <input type="hidden" name="variants_count" value={items.length} />

        <!-- Add button -->
        <div class="p-4 border-t border-base-200">
          <button
            type="button"
            class="btn btn-ghost btn-sm gap-2 w-full border border-dashed border-base-300 hover:border-primary hover:text-primary"
            onclick={addVariant}
          >
            <Plus size={16} />
            Add Variant
          </button>
        </div>

      </div>
    {/if}

  </div>
</div>