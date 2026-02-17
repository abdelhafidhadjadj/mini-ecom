<script lang="ts">
  import { enhance } from '$app/forms';
  import { Save, Loader } from 'lucide-svelte';

  let { catalog = null, action } = $props<{
    catalog?: {
      id?: number;
      nom: string;
      slug: string;
      description?: string;
      ordre: number;
      actif: boolean;
    } | null;
    action: string;
  }>();

  let loading     = $state(false);
  let nom         = $state(catalog?.nom         ?? '');
  let slug        = $state(catalog?.slug        ?? '');
  let description = $state(catalog?.description ?? '');
  let ordre       = $state(catalog?.ordre       ?? 0);
  let actif       = $state(catalog?.actif       ?? true);
  let slugEdited  = $state(!!catalog);

  function generateSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function onNomInput() {
    if (!slugEdited) {
      slug = generateSlug(nom);
    }
  }

  function onSlugInput() {
    slugEdited = true;
    slug = generateSlug(slug);
  }
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-4 lg:p-6">

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
      class="flex flex-col gap-5"
    >

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
          placeholder="Ex: Boulonnerie"
          bind:value={nom}
          oninput={onNomInput}
          required
        />
      </div>

      <!-- Slug -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="slug">
          <span class="label-text font-medium">
            Slug <span class="text-error">*</span>
          </span>
          <span class="label-text-alt text-base-content/40">
            Auto-generated
          </span>
        </label>
        <div class="relative">
          <input
            id="slug"
            name="slug"
            type="text"
            class="input input-bordered w-full font-mono text-sm pr-24"
            placeholder="ex: boulonnerie"
            bind:value={slug}
            oninput={onSlugInput}
            required
          />
          <!-- Preview URL -->
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/30">
            /catalogue/{slug || '...'}
          </span>
        </div>
      </div>

      <!-- Description -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="description">
          <span class="label-text font-medium">Description</span>
          <span class="label-text-alt text-base-content/40">Optional</span>
        </label>
        <textarea
          id="description"
          name="description"
          class="textarea textarea-bordered w-full resize-none"
          placeholder="Short description of this catalog..."
          rows="3"
          bind:value={description}
        ></textarea>
      </div>

      <!-- Ordre + Actif -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- Ordre -->
        <div class="form-control gap-1.5">
          <label class="label py-0" for="ordre">
            <span class="label-text font-medium">Display Order</span>
          </label>
          <input
            id="ordre"
            name="ordre"
            type="number"
            class="input input-bordered w-full"
            min="0"
            bind:value={ordre}
          />
          <span class="text-xs text-base-content/40 px-1">
            Lower number = shown first
          </span>
        </div>

        <!-- Actif -->
        <div class="form-control gap-1.5">
          <label class="label py-0">
            <span class="label-text font-medium">Visibility</span>
          </label>
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

      <!-- Divider -->
      <div class="divider my-0"></div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row justify-end gap-3">
        <a href="/dashboard/catalogues" class="btn btn-ghost w-full sm:w-auto">
          Cancel
        </a>
        <button
          type="submit"
          class="btn btn-primary w-full sm:w-auto gap-2"
          disabled={loading}
        >
          {#if loading}
            <Loader size={16} class="animate-spin" />
            Saving...
          {:else}
            <Save size={16} />
            {catalog ? 'Save Changes' : 'Create Catalog'}
          {/if}
        </button>
      </div>

    </form>

  </div>
</div>