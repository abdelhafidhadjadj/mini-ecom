<script lang="ts">
  import { enhance } from '$app/forms';
  import { Tag, PauseCircle, RotateCcw } from 'lucide-svelte';

  let { client, typesClient } = $props<{
    client: {
      statut: string;
      type_client_id?: number;
    };
    typesClient: { id: number; nom: string }[];
  }>();
</script>

<div class="card bg-base-100 border border-base-200 shadow-sm">
  <div class="card-body p-4 gap-4">

    <h2 class="font-semibold flex items-center gap-2">
      <Tag size={16} class="text-primary" />
      Account Management
    </h2>

    {#if client.statut === 'approuve'}

      <!-- Changer type -->
      <form method="POST" action="?/changeType" use:enhance class="flex flex-col gap-2">
        <label class="text-xs text-base-content/50 uppercase tracking-wide">Client Type</label>
        <div class="flex gap-2">
          <select name="type_client_id" class="select select-bordered select-sm flex-1">
            {#each typesClient as tc}
              <option value={tc.id} selected={tc.id === client.type_client_id}>
                {tc.nom}
              </option>
            {/each}
          </select>
          <button type="submit" class="btn btn-primary btn-sm">Save</button>
        </div>
      </form>

      <div class="divider my-0"></div>

      <!-- Suspendre -->
      <form method="POST" action="?/suspend" use:enhance>
        <button class="btn btn-warning btn-sm btn-outline w-full gap-2">
          <PauseCircle size={14} />
          Suspend Account
        </button>
      </form>

    {:else if client.statut === 'suspendu' || client.statut === 'rejete'}

      <form method="POST" action="?/reactivate" use:enhance>
        <button class="btn btn-success btn-sm w-full gap-2">
          <RotateCcw size={14} />
          Reactivate Account
        </button>
      </form>

    {/if}

  </div>
</div>