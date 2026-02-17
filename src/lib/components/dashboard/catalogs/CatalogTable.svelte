<script lang="ts">
  import { enhance } from '$app/forms';
  import { Pencil, Trash2, ToggleLeft, ToggleRight, Plus, FolderOpen } from 'lucide-svelte';

  let { catalogs } = $props<{
    catalogs: {
      id: number;
      nom: string;
      slug: string;
      description?: string;
      ordre: number;
      actif: boolean;
      nb_categories: number;
      created_at: string;
    }[];
  }>();

  let deletingId = $state<number | null>(null);
  let togglingId = $state<number | null>(null);
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-0">

    <!-- Header -->
    <div class="flex items-center justify-between p-4 lg:p-5 border-b border-base-200">
      <div class="flex items-center gap-2">
        <FolderOpen size={18} class="text-primary" />
        <h2 class="font-semibold">Catalogues</h2>
        <span class="badge badge-ghost badge-sm">{catalogs.length}</span>
      </div>
      <a href="/dashboard/catalogues/add" class="btn btn-primary btn-sm gap-2">
        <Plus size={16} />
        New
      </a>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="table table-sm lg:table-md">
        <thead>
          <tr class="bg-base-200/50 text-base-content/60">
            <th class="w-12">Order</th>
            <th>Name</th>
            <th class="hidden md:table-cell">Slug</th>
            <th class="text-center">Categories</th>
            <th class="text-center">Status</th>
            <th class="w-28">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each catalogs as catalog}
            <tr class="hover">

              <!-- Ordre -->
              <td class="text-center">
                <span class="badge badge-ghost badge-sm font-mono">
                  {catalog.ordre}
                </span>
              </td>

              <!-- Nom -->
              <td>
                <div class="font-medium text-sm">{catalog.nom}</div>
                {#if catalog.description}
                  <div class="text-xs text-base-content/50 truncate max-w-48">
                    {catalog.description}
                  </div>
                {/if}
              </td>

              <!-- Slug -->
              <td class="hidden md:table-cell">
                <span class="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                  {catalog.slug}
                </span>
              </td>

              <!-- Nb catégories -->
              <td class="text-center">
                <span class="badge badge-ghost badge-sm">
                  {catalog.nb_categories}
                </span>
              </td>

              <!-- Toggle actif -->
              <td class="text-center">
                <form method="POST" action="?/toggle" use:enhance={() => {
                  togglingId = catalog.id;
                  return async ({ update }) => {
                    await update();
                    togglingId = null;
                  };
                }}>
                  <input type="hidden" name="id" value={catalog.id} />
                  <input type="hidden" name="actif" value={catalog.actif} />
                  <button
                    type="submit"
                    class="btn btn-ghost btn-xs gap-1"
                    disabled={togglingId === catalog.id}
                  >
                    {#if catalog.actif}
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
                    href="/dashboard/catalogues/{catalog.id}/update"
                    class="btn btn-ghost btn-xs btn-circle tooltip"
                    data-tip="Edit"
                  >
                    <Pencil size={14} />
                  </a>

                  <!-- Delete -->
                  <form method="POST" action="?/delete" use:enhance={() => {
                    deletingId = catalog.id;
                    return async ({ update }) => {
                      await update();
                      deletingId = null;
                    };
                  }}>
                    <input type="hidden" name="id" value={catalog.id} />
                    <button
                      type="submit"
                      class="btn btn-ghost btn-xs btn-circle tooltip text-error hover:bg-error/10"
                      data-tip="Delete"
                      disabled={deletingId === catalog.id}
                      onclick={(e) => {
                        if (!confirm('Delete this catalog?')) e.preventDefault();
                      }}
                    >
                      {#if deletingId === catalog.id}
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

          {#if catalogs.length === 0}
            <tr>
              <td colspan="6" class="text-center py-12 text-base-content/40">
                <div class="flex flex-col items-center gap-2">
                  <FolderOpen size={32} class="opacity-20" />
                  <span class="text-sm">No catalogs yet</span>
                  <a href="/dashboard/catalogues/add" class="btn btn-primary btn-sm mt-2">
                    Create first catalog
                  </a>
                </div>
              </td>
            </tr>
          {/if}

        </tbody>
      </table>
    </div>

  </div>
</div>