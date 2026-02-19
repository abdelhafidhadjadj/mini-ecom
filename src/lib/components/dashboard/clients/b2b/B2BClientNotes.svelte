<script lang="ts">
  import { enhance } from '$app/forms';
  import { FileText, Edit3 } from 'lucide-svelte';

  let { notes = '' } = $props<{ notes?: string }>();

  let showEdit   = $state(false);
  let notesValue = $state(notes);
</script>

<div class="card bg-base-100 border border-base-200 shadow-sm">
  <div class="card-body p-4 gap-3">

    <div class="flex items-center justify-between">
      <h2 class="font-semibold flex items-center gap-2">
        <FileText size={16} />
        Admin Notes
      </h2>
      <button
        class="btn btn-ghost btn-xs gap-1"
        onclick={() => showEdit = !showEdit}
      >
        <Edit3 size={12} />
        Edit
      </button>
    </div>

    {#if showEdit}
      <form
        method="POST"
        action="?/updateNotes"
        use:enhance={() => {
          return async ({ update }) => {
            await update();
            showEdit = false;
          };
        }}
        class="flex flex-col gap-2"
      >
        <textarea
          name="notes"
          class="textarea textarea-bordered text-sm w-full"
          rows="4"
          placeholder="Internal notes about this client..."
          bind:value={notesValue}
        ></textarea>
        <div class="flex gap-2 justify-end">
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onclick={() => showEdit = false}
          >Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save</button>
        </div>
      </form>
    {:else}
      {#if notesValue}
        <p class="text-sm text-base-content/70 whitespace-pre-wrap">{notesValue}</p>
      {:else}
        <p class="text-sm text-base-content/30 italic">No notes yet</p>
      {/if}
    {/if}

  </div>
</div>