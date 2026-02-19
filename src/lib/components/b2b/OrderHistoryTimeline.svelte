<script lang="ts">
  import { Clock } from 'lucide-svelte';
  import OrderStatusBadge from '$lib/components/dashboard/orders/OrderStatusBadge.svelte';

  let { historique } = $props<{
    historique: {
      id: number;
      ancien_statut: string | null;
      nouveau_statut: string;
      commentaire: string | null;
      created_at: string;
      agent_nom: string | null;
    }[];
  }>();

  function formatDateShort(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-0">
    <div class="flex items-center gap-2 p-5 border-b border-base-200">
      <Clock size={18} class="text-primary" />
      <h2 class="font-semibold">Order History</h2>
    </div>

    <div class="p-5">
      <ul class="timeline timeline-vertical">
        {#each historique as event, i}
          <li>
            {#if i > 0}
              <hr class="bg-base-300" />
            {/if}
            <div class="timeline-start timeline-box bg-base-200 border-base-300">
              <div class="flex items-center justify-between gap-2 mb-1">
                <OrderStatusBadge statut={event.nouveau_statut} size="xs" />
                <span class="text-xs text-base-content/50">
                  {formatDateShort(event.created_at)}
                </span>
              </div>
              {#if event.commentaire}
                <p class="text-xs mt-1">{event.commentaire}</p>
              {/if}
              {#if event.agent_nom}
                <p class="text-xs text-base-content/40 mt-1">
                  by {event.agent_nom}
                </p>
              {/if}
            </div>
            <div class="timeline-middle">
              <div class="w-3 h-3 rounded-full bg-warning"></div>
            </div>
            <hr class="bg-base-300" />
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>