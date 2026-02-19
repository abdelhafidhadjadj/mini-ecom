<script lang="ts">
  import { enhance } from '$app/forms';
  import { CheckCircle, XCircle } from 'lucide-svelte';

  let { typesClient } = $props<{
    typesClient: { id: number; nom: string; remise_defaut: number }[];
  }>();

  let showApproveForm = $state(false);
  let selectedType    = $state(typesClient[0]?.id);
</script>

<div class="alert bg-warning/10 border border-warning/30">
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
    <div class="flex-1">
      <p class="font-semibold text-warning">Registration pending approval</p>
      <p class="text-sm text-base-content/60 mt-0.5">
        This client is waiting for account activation.
      </p>
    </div>
    <div class="flex gap-2 shrink-0">
      <button
        class="btn btn-success btn-sm gap-2"
        onclick={() => showApproveForm = !showApproveForm}
      >
        <CheckCircle size={15} />
        Approve
      </button>
      <form method="POST" action="?/reject" use:enhance>
        <button class="btn btn-error btn-sm btn-outline gap-2">
          <XCircle size={15} />
          Reject
        </button>
      </form>
    </div>
  </div>

  {#if showApproveForm}
    <form
      method="POST"
      action="?/approve"
      use:enhance={() => {
        return async ({ update }) => {
          await update();
          showApproveForm = false;
        };
      }}
      class="w-full mt-3 pt-3 border-t border-warning/20 flex items-center gap-3"
    >
      <select
        name="type_client_id"
        class="select select-bordered select-sm flex-1"
        bind:value={selectedType}
      >
        {#each typesClient as tc}
          <option value={tc.id}>{tc.nom} (-{tc.remise_defaut}%)</option>
        {/each}
      </select>
      <button type="submit" class="btn btn-success btn-sm">Confirm</button>
      <button
        type="button"
        class="btn btn-ghost btn-sm"
        onclick={() => showApproveForm = false}
      >Cancel</button>
    </form>
  {/if}
</div>