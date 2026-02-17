<script lang="ts">
  import { enhance } from '$app/forms';
  import { Pencil, Trash2, ToggleLeft, ToggleRight, Plus, Layers } from 'lucide-svelte';

  let { categories } = $props<{
    categories: {
      id: number;
      nom: string;
      slug: string;
      ordre: number;
      actif: boolean;
      catalogue_nom: string;
      catalogue_id: number;
      nb_produits: number;
      created_at: string;
    }[];
  }>();

  let deletingId = $state<number | null>(null);
  let togglingId = $state<number | null>(null);

  // Grouper par catalogue
  let grouped = $derived(
    categories.reduce((acc, cat) => {
      const key = cat.catalogue_nom;
      if (!acc[key]) acc[key] = [];
      acc[key].push(cat);
      return acc;
    }, {} as Record<string, typeof categories>)
  );
</script>

<div class="flex flex-col gap-4">

  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <Layers size={18} class="text-primary" />
      <h2 class="font-semibold">Categories</h2>
      <span class="badge badge-ghost badge-sm">{categories.length}</span>
    </div>
    <a href="/dashboard/categories/add" class="btn btn-primary btn-sm gap-2">
      <Plus size={16} />
      New
    </a>
  </div>

  <!-- Groupes par catalogue -->
  {#each Object.entries(grouped) as [catalogueName, cats]}
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-0">

        <!-- Catalogue header -->
        <div class="flex items-center gap-2 px-4 lg:px-5 py-3 bg-base-200/50 border-b border-base-200">
          <Layers size={14} class="text-base-content/50" />
          <span class="font-medium text-sm">{catalogueName}</span>
          <span class="badge badge-ghost badge-xs">{cats.length}</span>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="table table-sm lg:table-md">
            <thead>
              <tr class="text-base-content/60">
                <th class="w-12">Order</th>
                <th>Name</th>
                <th class="hidden md:table-cell">Slug</th>
                <th class="text-center">Products</th>
                <th class="text-center">Status</th>
                <th class="w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each cats as category}
                <tr class="hover">

                  <!-- Ordre -->
                  <td class="text-center">
                    <span class="badge badge-ghost badge-sm font-mono">
                      {category.ordre}
                    </span>
                  </td>

                  <!-- Nom -->
                  <td class="font-medium text-sm">{category.nom}</td>

                  <!-- Slug -->
                  <td class="hidden md:table-cell">
                    <span class="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                      {category.slug}
                    </span>
                  </td>

                  <!-- Nb produits -->
                  <td class="text-center">
                    <span class="badge badge-ghost badge-sm">
                      {category.nb_produits}
                    </span>
                  </td>

                  <!-- Toggle actif -->
                  <td class="text-center">
                    <form method="POST" action="?/toggle" use:enhance={() => {
                      togglingId = category.id;
                      return async ({ update }) => {
                        await update();
                        togglingId = null;
                      };
                    }}>
                      <input type="hidden" name="id" value={category.id} />
                      <input type="hidden" name="actif" value={category.actif} />
                      <button
                        type="submit"
                        class="btn btn-ghost btn-xs"
                        disabled={togglingId === category.id}
                      >
                        {#if category.actif}
                          <ToggleRight size={18} class="text-success" />
                        {:else}
                          <ToggleLeft size={18} class="text-base-content/30" />
                        {/if}
                      </button>
                    </form>
                  </td>

                  <!-- Actions -->
                  <td>
                    <div class="flex items-center gap-1">

                      <!-- Edit -->
                      <a
                        href="/dashboard/categories/{category.id}/update"
                        class="btn btn-ghost btn-xs btn-circle tooltip"
                        data-tip="Edit"
                      >
                        <Pencil size={14} />
                      </a>

                      <!-- Delete -->
                      <form method="POST" action="?/delete" use:enhance={() => {
                        deletingId = category.id;
                        return async ({ update }) => {
                          await update();
                          deletingId = null;
                        };
                      }}>
                        <input type="hidden" name="id" value={category.id} />
                        <button
                          type="submit"
                          class="btn btn-ghost btn-xs btn-circle tooltip text-error hover:bg-error/10"
                          data-tip="Delete"
                          disabled={deletingId === category.id}
                          onclick={(e) => {
                            if (!confirm('Delete this category?')) e.preventDefault();
                          }}
                        >
                          {#if deletingId === category.id}
                            <span class="loading loading-spinner loading-xs"></span>
                          {:else}
                            <Trash2 size={14} />
                          {/if}
                        </button>
                      </form>

                    </div>
                  </td>

                </tr>
              {/each}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  {/each}

  <!-- Empty state -->
  {#if categories.length === 0}
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body items-center py-12 text-base-content/40">
        <Layers size={32} class="opacity-20" />
        <p class="text-sm mt-2">No categories yet</p>
        <a href="/dashboard/categories/add" class="btn btn-primary btn-sm mt-3">
          Create first category
        </a>
      </div>
    </div>
  {/if}

</div>