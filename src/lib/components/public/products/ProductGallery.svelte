<script lang="ts">
  let { images, nom } = $props<{
    nom: string;
    images: { id: number; url: string; principale: boolean }[];
  }>();

  let activeIndex = $state(0);
  const activeImage = $derived(images[activeIndex]?.url ?? '/placeholder.jpg');
</script>

<div class="flex flex-col gap-3">

  <!-- Image principale -->
  <div class="aspect-square rounded-xl overflow-hidden bg-base-200 border border-base-200">
    <img
      src={activeImage}
      alt={nom}
      class="w-full h-full object-cover transition-all duration-200"
    />
  </div>

  <!-- Miniatures -->
  {#if images.length > 1}
    <div class="flex gap-2 overflow-x-auto pb-1">
      {#each images as image, i}
        <button
          onclick={() => activeIndex = i}
          class="shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all"
          class:border-primary={activeIndex === i}
          class:border-base-200={activeIndex !== i}
        >
          <img
            src={image.url}
            alt="{nom} {i + 1}"
            class="w-full h-full object-cover"
          />
        </button>
      {/each}
    </div>
  {/if}

</div>