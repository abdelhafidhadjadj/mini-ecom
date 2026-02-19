<script lang="ts">
  import { Plus, Trash2, Star, Loader } from 'lucide-svelte';

  let { images = [], produitId = 'temp' } = $props<{
    images?: {
      id?: number;
      url: string;
      ordre: number;
      principale: boolean;
    }[];
    produitId?: string | number;
  }>();

  let items = $state(images.map(img => ({ ...img, _key: Math.random() })));
  let fileInput: HTMLInputElement;
  let uploading = $state(false);

  async function onFilesSelected(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;

    uploading = true;

    for (const file of Array.from(files)) {
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('produit_id', String(produitId));

        const res = await fetch('/api/upload', { method: 'POST', body: fd });

        if (!res.ok) {
          const err = await res.json();
          alert(err.message ?? 'Upload failed');
          continue;
        }

        const { url } = await res.json();

        items = [...items, {
          _key:       Math.random(),
          url,
          ordre:      items.length,
          principale: items.length === 0,
        }];
      } catch {
        alert('Upload error, please try again');
      }
    }

    uploading = false;
    fileInput.value = '';
  }

  function removeImage(key: number) {
    items = items
      .filter(img => img._key !== key)
      .map((img, i) => ({
        ...img,
        ordre:      i,
        principale: i === 0 ? true : img.principale,
      }));
  }

  function setPrimary(key: number) {
    items = items.map(img => ({
      ...img,
      principale: img._key === key,
    }));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    items = newItems.map((img, i) => ({ ...img, ordre: i }));
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    items = newItems.map((img, i) => ({ ...img, ordre: i }));
  }
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-4 lg:p-5 gap-4">

    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-semibold">Product Images</h3>
        <p class="text-xs text-base-content/40 mt-0.5">
          First image is the main one. Max 5MB per image.
        </p>
      </div>
      <span class="badge badge-ghost badge-sm">{items.length} / 10</span>
    </div>

    {#if items.length > 0}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {#each items as img, i (img._key)}

          {#if img.id}
            <input type="hidden" name="image_id_{i}" value={img.id} />
          {/if}
          <input type="hidden" name="image_url_{i}" value={img.url} />
          <input type="hidden" name="image_ordre_{i}" value={img.ordre} />
          <input type="hidden" name="image_principale_{i}" value={img.principale} />

          <div class="relative group aspect-square">
            <img
              src={img.url}
              alt="Product image {i + 1}"
              class="w-full h-full object-cover rounded-lg border-2 transition-colors"
              class:border-primary={img.principale}
              class:border-base-200={!img.principale}
            />

            {#if img.principale}
              <div class="absolute top-1.5 left-1.5">
                <span class="badge badge-primary badge-xs gap-1">
                  <Star size={8} />
                  Main
                </span>
              </div>
            {/if}

            <div class="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
              {#if !img.principale}
                <button type="button" class="btn btn-xs btn-warning gap-1"
                  onclick={() => setPrimary(img._key)} title="Set as main">
                  <Star size={11} />
                </button>
              {/if}
              {#if i > 0}
                <button type="button" class="btn btn-xs btn-ghost btn-circle bg-white/20 text-white"
                  onclick={() => moveUp(i)}>↑</button>
              {/if}
              {#if i < items.length - 1}
                <button type="button" class="btn btn-xs btn-ghost btn-circle bg-white/20 text-white"
                  onclick={() => moveDown(i)}>↓</button>
              {/if}
              <button type="button" class="btn btn-xs btn-error btn-circle"
                onclick={() => removeImage(img._key)}>
                <Trash2 size={11} />
              </button>
            </div>
          </div>

        {/each}
      </div>
    {/if}

    {#if items.length < 10}
      <button
        type="button"
        class="border-2 border-dashed border-base-300 hover:border-primary hover:bg-primary/5 rounded-lg p-6 transition-colors cursor-pointer w-full"
        onclick={() => fileInput.click()}
        disabled={uploading}
      >
        <div class="flex flex-col items-center gap-2 text-base-content/40">
          {#if uploading}
            <Loader size={24} class="animate-spin" />
            <span class="text-sm font-medium">Uploading...</span>
          {:else}
            <Plus size={24} />
            <span class="text-sm font-medium">Click to upload images</span>
            <span class="text-xs">PNG, JPG, WebP — Max 5MB each</span>
          {/if}
        </div>
      </button>
    {/if}

    <input type="hidden" name="images_count" value={items.length} />

    <input
      bind:this={fileInput}
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      onchange={onFilesSelected}
    />

  </div>
</div>