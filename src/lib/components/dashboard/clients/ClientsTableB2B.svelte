<script lang="ts">
  import { goto } from '$app/navigation';
  import { Building2 } from 'lucide-svelte';

  let { clients } = $props<{
    clients: {
      id: number;
      nom_entreprise: string;
      contact_nom: string;
      email: string;
      wilaya?: string;
      statut: string;
      type_client_nom?: string;
      total_commandes: number;
      ca_total: number;
      created_at: string;
    }[];
  }>();

  const statutBadge: Record<string, string> = {
    en_attente: 'badge-warning',
    approuve:   'badge-success',
    rejete:     'badge-error',
    suspendu:   'badge-neutral',
  };

  const statutLabel: Record<string, string> = {
    en_attente: 'Pending',
    approuve:   'Approved',
    rejete:     'Rejected',
    suspendu:   'Suspended',
  };

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }
</script>

<thead>
  <tr class="bg-base-200/50 text-base-content/60">
    <th>Company</th>
    <th class="hidden md:table-cell">Contact</th>
    <th class="hidden lg:table-cell">Wilaya</th>
    <th>Type</th>
    <th>Status</th>
    <th class="hidden lg:table-cell">Orders</th>
    <th class="hidden xl:table-cell">CA Total</th>
    <th class="hidden md:table-cell">Since</th>
    <th class="w-20"></th>
  </tr>
</thead>

<tbody>
  {#each clients as client}
    <tr
      class="hover cursor-pointer"
      onclick={() => goto(`/dashboard/clients/b2b/${client.id}`)}
    >
      <td>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-warning/20 text-warning flex items-center justify-center text-xs font-bold shrink-0">
            {client.nom_entreprise.charAt(0).toUpperCase()}
          </div>
          <span class="font-semibold text-sm">{client.nom_entreprise}</span>
        </div>
      </td>
      <td class="hidden md:table-cell">
        <div class="text-sm">{client.contact_nom}</div>
        <div class="text-xs text-base-content/50">{client.email}</div>
      </td>
      <td class="hidden lg:table-cell text-sm">{client.wilaya ?? '—'}</td>
      <td>
        {#if client.type_client_nom}
          <span class="badge badge-warning badge-sm">{client.type_client_nom}</span>
        {:else}
          <span class="text-base-content/30 text-xs">—</span>
        {/if}
      </td>
      <td>
        <span class="badge badge-sm {statutBadge[client.statut]}">
          {statutLabel[client.statut]}
        </span>
      </td>
      <td class="hidden lg:table-cell text-sm font-medium">{client.total_commandes}</td>
      <td class="hidden xl:table-cell text-sm font-semibold">{formatPrix(client.ca_total)}</td>
      <td class="hidden md:table-cell text-xs text-base-content/50">{formatDate(client.created_at)}</td>
      <td>
        <a
          href="/dashboard/clients/b2b/{client.id}"
          class="btn btn-ghost btn-xs"
          onclick={(e) => e.stopPropagation()}
        >View</a>
      </td>
    </tr>
  {/each}

  {#if clients.length === 0}
    <tr>
      <td colspan="9" class="text-center py-12 text-base-content/40">
        <div class="flex flex-col items-center gap-2">
          <Building2 size={32} class="opacity-20" />
          <span class="text-sm">No B2B clients found</span>
        </div>
      </td>
    </tr>
  {/if}
</tbody>