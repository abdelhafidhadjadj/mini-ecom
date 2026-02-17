<script lang="ts">
  import { Clock } from 'lucide-svelte';

  let { historique } = $props<{
    historique: {
      id: number;
      ancien_statut: string;
      nouveau_statut: string;
      commentaire?: string;
      created_at: string;
      agent_nom?: string;
    }[];
  }>();

  const statutLabels: Record<string, string> = {
    en_attente:     'Pending',
    confirmee:      'Confirmed',
    en_preparation: 'In progress',
    expedie:        'Shipped',
    livre:          'Delivered',
    annulee:        'Cancelled',
  };

  const statutColors: Record<string, string> = {
    en_attente:     'badge-warning',
    confirmee:      'badge-info',
    en_preparation: 'badge-primary',
    expedie:        'badge-accent',
    livre:          'badge-success',
    annulee:        'badge-error',
  };

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day:    '2-digit',
      month:  '2-digit',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-4 lg:p-5 gap-4">

    <!-- Header -->
    <h2 class="font-semibold flex items-center gap-2">
      <Clock size={16} class="text-primary" />
      Status History
    </h2>

    <!-- Timeline -->
    {#if historique.length === 0}
      <p class="text-sm text-base-content/40 text-center py-4">
        No status changes yet
      </p>
    {:else}
      <ul class="timeline timeline-vertical timeline-compact">
        {#each historique as item, i}
          <li>
            {#if i !== 0}
              <hr class="bg-base-300" />
            {/if}

            <div class="timeline-middle">
              <div
                class="w-3 h-3 rounded-full border-2"
                class:border-success={item.nouveau_statut === 'livre'}
                class:border-error={item.nouveau_statut === 'annulee'}
                class:border-primary={!['livre','annulee'].includes(item.nouveau_statut)}
                class:bg-success={item.nouveau_statut === 'livre'}
                class:bg-error={item.nouveau_statut === 'annulee'}
                class:bg-primary={!['livre','annulee'].includes(item.nouveau_statut)}
              ></div>
            </div>

            <div class="timeline-end pb-4 pl-3">
              <div class="flex flex-wrap items-center gap-2 mb-1">

                <!-- Ancien statut -->
                {#if item.ancien_statut}
                  <span class="badge badge-xs {statutColors[item.ancien_statut] ?? 'badge-ghost'}">
                    {statutLabels[item.ancien_statut] ?? item.ancien_statut}
                  </span>
                  <span class="text-xs text-base-content/40">→</span>
                {/if}

                <!-- Nouveau statut -->
                <span class="badge badge-xs {statutColors[item.nouveau_statut] ?? 'badge-ghost'}">
                  {statutLabels[item.nouveau_statut] ?? item.nouveau_statut}
                </span>

              </div>

              <!-- Commentaire -->
              {#if item.commentaire}
                <p class="text-xs text-base-content/70 italic mb-1">
                  "{item.commentaire}"
                </p>
              {/if}

              <!-- Meta -->
              <div class="flex items-center gap-2 text-xs text-base-content/40">
                <span>{formatDate(item.created_at)}</span>
                {#if item.agent_nom}
                  <span>·</span>
                  <span>{item.agent_nom}</span>
                {/if}
              </div>
            </div>

            {#if i !== historique.length - 1}
              <hr class="bg-base-300" />
            {/if}
          </li>
        {/each}
      </ul>
    {/if}

  </div>
</div>