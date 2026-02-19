<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';

  let { client } = $props<{
    client: {
      nom_entreprise: string;
      statut: string;
      type_client_nom?: string;
      created_at: string;
    };
  }>();

  const statutBadge: Record<string, string> = {
    en_attente: 'badge-warning',
    approuve:   'badge-success',
    rejete:     'badge-error',
    suspendu:   'badge-neutral',
  };

  const statutLabel: Record<string, string> = {
    en_attente: 'Pending Approval',
    approuve:   'Approved',
    rejete:     'Rejected',
    suspendu:   'Suspended',
  };

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
</script>

<div class="flex items-center gap-3">
  <a href="/dashboard/clients?type=b2b" class="btn btn-ghost btn-sm btn-circle">
    <ArrowLeft size={18} />
  </a>
  <div class="flex-1">
    <div class="flex items-center gap-3 flex-wrap">
      <h1 class="text-lg font-bold">{client.nom_entreprise}</h1>
      <span class="badge {statutBadge[client.statut]}">
        {statutLabel[client.statut]}
      </span>
      {#if client.type_client_nom}
        <span class="badge badge-warning badge-outline">
          {client.type_client_nom}
        </span>
      {/if}
    </div>
    <p class="text-xs text-base-content/50 mt-0.5">
      B2B Client — registered {formatDate(client.created_at)}
    </p>
  </div>
</div>