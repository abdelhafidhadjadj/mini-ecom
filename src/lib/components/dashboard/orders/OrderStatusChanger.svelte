<script lang="ts">
  import { enhance } from '$app/forms';
  import { CheckCircle } from 'lucide-svelte';
  import OrderStatusBadge from '$lib/components/dashboard/orders/OrderStatusBadge.svelte';

  let { statut, orderId } = $props<{
    statut: string;
    orderId: number;
  }>();

  const statuts = [
    { value: 'en_attente',     label: 'Pending'      },
    { value: 'confirmee',      label: 'Confirmed'    },
    { value: 'en_preparation', label: 'In progress'  },
    { value: 'expedie',        label: 'Shipped'      },
    { value: 'livre',          label: 'Delivered'    },
    { value: 'annulee',        label: 'Cancelled'    },
  ];

  let selectedStatut = $state(statut);
  let commentaire    = $state('');
  let loading        = $state(false);
  let success        = $state(false);

  let changed = $derived(selectedStatut !== statut);
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-4 lg:p-5 gap-4">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="font-semibold flex items-center gap-2">
        <CheckCircle size={16} class="text-primary" />
        Update Status
      </h2>
      <OrderStatusBadge statut={statut} />
    </div>

    <!-- Success message -->
    {#if success}
      <div class="alert alert-success py-2 text-sm">
        ✅ Status updated successfully
      </div>
    {/if}

    <form
      method="POST"
      action="?/updateStatus"
      use:enhance={() => {
        loading = true;
        success = false;
        return async ({ update }) => {
          await update({ reset: false });
          loading = false;
          success = true;
          setTimeout(() => success = false, 3000);
        };
      }}
      class="flex flex-col gap-3"
    >

      <!-- Select statut -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="statut">
          <span class="label-text text-sm font-medium">New Status</span>
        </label>
        <select
          id="statut"
          name="statut"
          class="select select-bordered w-full"
          bind:value={selectedStatut}
        >
          {#each statuts as s}
            <option value={s.value}>{s.label}</option>
          {/each}
        </select>
      </div>

      <!-- Commentaire -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="commentaire">
          <span class="label-text text-sm font-medium">
            Comment
            <span class="text-base-content/40 font-normal">(optional)</span>
          </span>
        </label>
        <textarea
          id="commentaire"
          name="commentaire"
          class="textarea textarea-bordered w-full text-sm resize-none"
          placeholder="Add a note about this status change..."
          rows="2"
          bind:value={commentaire}
        ></textarea>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="btn btn-primary w-full"
        disabled={!changed || loading}
      >
        {#if loading}
          <span class="loading loading-spinner loading-sm"></span>
          Updating...
        {:else}
          Update Status
        {/if}
      </button>

    </form>

  </div>
</div>