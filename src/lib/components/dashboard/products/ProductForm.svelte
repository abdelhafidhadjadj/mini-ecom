<script lang="ts">
  import { enhance } from '$app/forms';
  import { Save, Loader } from 'lucide-svelte';
  import VariantManager from './VariantManager.svelte';
  import ImageUploader from './ImageUploader.svelte';
  import RichTextEditor from '$lib/components/dashboard/products/RichTextEditor.svelte';

  let { product = null, categories, action } = $props<{
    product?: {
      id?: number;
      nom: string;
      slug: string;
      description?: string;
      reference?: string;
      categorie_id: number;
      prix: number;
      unite_vente: string;
      stock: number;
      stock_minimum: number;
      actif: boolean;
      variantes?: any[];
      images?: any[];
      prix_b2b?: {
        revendeur?: number;
        grossiste?: number;
        super_grossiste?: number;
      };
    } | null;
    categories: { id: number; nom: string; catalogue_nom?: string }[];
    action: string;
  }>();

  const unites = [
    'pièce', 'lot 10', 'lot 50', 'lot 100',
    'lot 500', 'boîte', 'kg', 'mètre',
  ];

  let loading      = $state(false);
  let nom          = $state(product?.nom          ?? '');
  let slug         = $state(product?.slug         ?? '');
  let description  = $state(product?.description  ?? '');
  let reference    = $state(product?.reference    ?? '');
  let categorie_id = $state(product?.categorie_id ?? categories[0]?.id ?? 0);
  let prix         = $state(product?.prix         ?? 0);
  let unite_vente  = $state(product?.unite_vente  ?? 'pièce');
  let stock        = $state(product?.stock        ?? 0);
  let stock_minimum = $state(product?.stock_minimum ?? 5);
  let actif        = $state(product?.actif        ?? true);
  let slugEdited   = $state(!!product);

  // Prix B2B - null = auto-calculé
// Mode par défaut : pct
type Mode = 'pct' | 'fixed';

let modes = $state<Record<string, Mode>>({
  revendeur:       'pct',
  grossiste:       'pct',
  super_grossiste: 'pct',
});

let vals = $state<Record<string, number | null>>({
  revendeur:       product?.prix_b2b?.revendeur       ? null : null,
  grossiste:       product?.prix_b2b?.grossiste       ? null : null,
  super_grossiste: product?.prix_b2b?.super_grossiste ? null : null,
});

// À l'init, détecter si le produit existant a des prix B2B
// et deviner le mode (si prix ≠ % rond → fixed)
$effect(() => {
  if (product?.prix_b2b) {
    const tiers = ['revendeur', 'grossiste', 'super_grossiste'];
    const defaults = { revendeur: 0.90, grossiste: 0.80, super_grossiste: 0.70 };

    for (const key of tiers) {
      const p = product.prix_b2b[key];
      if (p !== undefined && product.prix) {
        const pct = (1 - p / product.prix) * 100;
        const isRoundPct = Math.abs(pct - Math.round(pct)) < 0.01;
        if (isRoundPct) {
          modes[key] = 'pct';
          vals[key] = Math.round(pct);
        } else {
          modes[key] = 'fixed';
          vals[key] = p;
        }
      }
    }
  }
});

// Calculer le prix final à envoyer au serveur
function computedPrix(key: string, defaultPct: number): number {
  const v = vals[key];
  if (v === null || v === undefined) {
    return Math.round(prix * (1 - defaultPct / 100) * 100) / 100;
  }
  if (modes[key] === 'pct') {
    return Math.round(prix * (1 - v / 100) * 100) / 100;
  }
  return v;
}

  function formatPrix(n: number): string {
    return n.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function generateSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function onNomInput() {
    if (!slugEdited) slug = generateSlug(nom);
  }

  function onSlugInput() {
    slugEdited = true;
    slug = generateSlug(slug);
  }
</script>

<form
  method="POST"
  {action}
  use:enhance={() => {
    loading = true;
    return async ({ update }) => {
      await update();
      loading = false;
    };
  }}
  class="flex flex-col gap-4 lg:gap-6"
>

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">

    <!-- ─── Colonne principale ──────────────────────────── -->
    <div class="xl:col-span-2 flex flex-col gap-4 lg:gap-6">

      <!-- Infos de base -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-4 lg:p-5 gap-4">
          <h3 class="font-semibold">Basic Information</h3>

          <!-- Nom -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="nom">
              <span class="label-text font-medium">
                Name <span class="text-error">*</span>
              </span>
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              class="input input-bordered w-full"
              placeholder="Ex: Boulon HEX M8x30"
              bind:value={nom}
              oninput={onNomInput}
              required
            />
          </div>

          <!-- Slug -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="slug">
              <span class="label-text font-medium">Slug <span class="text-error">*</span></span>
              <span class="label-text-alt text-base-content/40">Auto-generated</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              class="input input-bordered w-full font-mono text-sm"
              bind:value={slug}
              oninput={onSlugInput}
              required
            />
          </div>

          <!-- Référence technique -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="reference">
              <span class="label-text font-medium">Technical Reference</span>
              <span class="label-text-alt text-base-content/40">DIN, ISO, NF...</span>
            </label>
            <input
              id="reference"
              name="reference"
              type="text"
              class="input input-bordered w-full font-mono"
              placeholder="Ex: DIN 933, ISO 4014"
              bind:value={reference}
            />
          </div>

          <!-- Catégorie -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="categorie_id">
              <span class="label-text font-medium">
                Category <span class="text-error">*</span>
              </span>
            </label>
            <select
              id="categorie_id"
              name="categorie_id"
              class="select select-bordered w-full"
              bind:value={categorie_id}
              required
            >
              {#each categories as cat}
                <option value={cat.id}>{cat.nom}</option>
              {/each}
            </select>
          </div>

          <!-- Description -->
          <div class="form-control gap-1.5">
            <label class="label py-0">
              <span class="label-text font-medium">Description</span>
              <span class="label-text-alt text-base-content/40">Optional</span>
            </label>
            <RichTextEditor
              name="description"
              value={description}
              placeholder="Product description, specifications, usage..."
            />
          </div>

        </div>
      </div>

      <!-- Images -->
      <ImageUploader images={product?.images ?? []} />

      <!-- Variantes -->
      <VariantManager variants={product?.variantes ?? []} />

    </div>

    <!-- ─── Colonne droite ──────────────────────────────── -->
    <div class="flex flex-col gap-4 lg:gap-6">

      <!-- Prix & Stock -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-4 lg:p-5 gap-4">
          <h3 class="font-semibold">Pricing & Stock</h3>

          <!-- Prix Public -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="prix">
              <span class="label-text font-medium">
                Public Price (DA) <span class="text-error">*</span>
              </span>
            </label>
            <input
              id="prix"
              name="prix"
              type="number"
              class="input input-bordered w-full"
              placeholder="0"
              min="0"
              step="0.01"
              bind:value={prix}
              required
            />
          </div>

          <!-- Prix B2B -->
          <div class="divider text-xs my-2">B2B Pricing</div>
                  
          <div class="flex flex-col gap-3">
          
            {#each [
              { key: 'revendeur', label: 'Revendeur', defaultPct: 10 },
              { key: 'grossiste', label: 'Grossiste', defaultPct: 20 },
              { key: 'super_grossiste', label: 'Super Grossiste', defaultPct: 30 },
            ] as tier}
          
              {@const modeKey = `mode_${tier.key}`}
              {@const valKey  = `val_${tier.key}`}
            
              <div class="border border-base-300 rounded-lg p-3 flex flex-col gap-2">
              
                <!-- Label + toggle mode -->
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold">{tier.label}</span>
                  <div class="join">
                    <button
                      type="button"
                      class="join-item btn btn-xs"
                      class:btn-primary={modes[tier.key] === 'pct'}
                      onclick={() => modes[tier.key] = 'pct'}
                    >% Remise</button>
                    <button
                      type="button"
                      class="join-item btn btn-xs"
                      class:btn-primary={modes[tier.key] === 'fixed'}
                      onclick={() => modes[tier.key] = 'fixed'}
                    >Prix fixe</button>
                  </div>
                </div>
              
                <!-- Input -->
                <div class="flex items-center gap-2">
                  {#if modes[tier.key] === 'pct'}
                    <input
                      type="number"
                      class="input input-bordered input-sm w-full"
                      placeholder={`${tier.defaultPct}`}
                      min="0"
                      max="100"
                      step="0.1"
                      bind:value={vals[tier.key]}
                    />
                    <span class="text-sm text-base-content/60 shrink-0">%</span>
                    <!-- Prix résultant -->
                    {#if prix > 0}
                      <span class="text-xs text-base-content/40 shrink-0">
                        = {formatPrix(prix * (1 - (vals[tier.key] ?? tier.defaultPct) / 100))} DA
                      </span>
                    {/if}
                  {:else}
                    <input
                      type="number"
                      class="input input-bordered input-sm w-full"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      bind:value={vals[tier.key]}
                    />
                    <span class="text-sm text-base-content/60 shrink-0">DA</span>
                    <!-- % équivalent -->
                    {#if prix > 0 && vals[tier.key]}
                      <span class="text-xs text-base-content/40 shrink-0">
                        = -{formatPrix((1 - vals[tier.key] / prix) * 100)}%
                      </span>
                    {/if}
                  {/if}
                </div>
              
                <!-- Hidden inputs pour le serveur -->
                <input type="hidden" name={`prix_${tier.key}`}      value={computedPrix(tier.key, tier.defaultPct)} />
                <input type="hidden" name={`mode_${tier.key}`}      value={modes[tier.key]} />
              
              </div>
            
            {/each}
            
          </div>
    

      


          <!-- Unité de vente -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="unite_vente">
              <span class="label-text font-medium">Unit of Sale</span>
            </label>
            <select
              id="unite_vente"
              name="unite_vente"
              class="select select-bordered w-full"
              bind:value={unite_vente}
            >
              {#each unites as u}
                <option value={u}>{u}</option>
              {/each}
            </select>
          </div>

          <div class="divider my-0"></div>

          <!-- Stock actuel -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="stock">
              <span class="label-text font-medium">Current Stock</span>
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              class="input input-bordered w-full"
              placeholder="0"
              min="0"
              bind:value={stock}
            />
          </div>

          <!-- Stock minimum -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="stock_minimum">
              <span class="label-text font-medium">Minimum Stock</span>
              <span class="label-text-alt text-base-content/40">Alert threshold</span>
            </label>
            <input
              id="stock_minimum"
              name="stock_minimum"
              type="number"
              class="input input-bordered w-full"
              placeholder="5"
              min="0"
              bind:value={stock_minimum}
            />
          </div>

          <!-- Stock indicator -->
          <div
            class="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
            class:bg-error={stock === 0}
            class:text-error-content={stock === 0}
            class:bg-warning={stock > 0 && stock <= stock_minimum}
            class:text-warning-content={stock > 0 && stock <= stock_minimum}
            class:bg-success={stock > stock_minimum}
            class:text-success-content={stock > stock_minimum}
            class:bg-opacity-20={true}
          >
            <span class="font-medium">
              {#if stock === 0}
                ❌ Out of stock
              {:else if stock <= stock_minimum}
                ⚠️ Low stock ({stock} remaining)
              {:else}
                ✅ In stock ({stock} available)
              {/if}
            </span>
          </div>

        </div>
      </div>

      <!-- Visibility -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-4 lg:p-5 gap-3">
          <h3 class="font-semibold">Visibility</h3>
          <div
            class="flex items-center gap-3 border border-base-300 rounded-lg px-4 h-12 cursor-pointer"
            onclick={() => actif = !actif}
          >
            <input
              type="checkbox"
              name="actif"
              id="actif"
              class="toggle toggle-primary toggle-sm"
              bind:checked={actif}
              value="true"
            />
            <label for="actif" class="text-sm cursor-pointer select-none">
              {#if actif}
                <span class="text-success font-medium">Visible on site</span>
              {:else}
                <span class="text-base-content/50">Hidden from site</span>
              {/if}
            </label>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex flex-col gap-2">
        <button
          type="submit"
          class="btn btn-primary w-full gap-2"
          disabled={loading}
        >
          {#if loading}
            <Loader size={16} class="animate-spin" />
            Saving...
          {:else}
            <Save size={16} />
            {product ? 'Save Changes' : 'Create Product'}
          {/if}
        </button>
        <a href="/dashboard/produits" class="btn btn-ghost w-full">
          Cancel
        </a>
      </div>

    </div>

  </div>

</form>