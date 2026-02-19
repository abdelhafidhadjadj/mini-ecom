<script lang="ts">
  import { goto } from '$app/navigation';
  import { User } from 'lucide-svelte';

  let { clients } = $props<{
    clients: {
      telephone: string;
      client_nom: string;
      wilaya?: string;
      total_commandes: number;
      ca_total: number;
      derniere_commande: string;
      premiere_commande: string;
    }[];
  }>();

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
    <th>Customer</th>
    <th class="hidden md:table-cell">Wilaya</th>
    <th>Orders</th>
    <th>CA Total</th>
    <th class="hidden lg:table-cell">Last Order</th>
    <th class="hidden lg:table-cell">First Order</th>
    <th class="w-20"></th>
  </tr>
</thead>

<tbody>
  {#each clients as client}
    <tr
      class="hover cursor-pointer"
      onclick={() => goto(`/dashboard/clients/b2c/${client.telephone}`)}
    >
      <td>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-info/20 text-info flex items-center justify-center text-xs font-bold shrink-0">
            {client.client_nom.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="font-medium text-sm">{client.client_nom}</div>
            <div class="text-xs text-base-content/50">{client.telephone}</div>
          </div>
        </div>
      </td>
      <td class="hidden md:table-cell text-sm">{client.wilaya ?? '—'}</td>
      <td class="font-medium text-sm">{client.total_commandes}</td>
      <td class="font-semibold text-sm">{formatPrix(client.ca_total)}</td>
      <td class="hidden lg:table-cell text-xs text-base-content/50">{formatDate(client.derniere_commande)}</td>
      <td class="hidden lg:table-cell text-xs text-base-content/50">{formatDate(client.premiere_commande)}</td>
      <td>
        <a
          href="/dashboard/clients/b2c/{client.telephone}"
          class="btn btn-ghost btn-xs"
          onclick={(e) => e.stopPropagation()}
        >View</a>
      </td>
    </tr>
  {/each}

  {#if clients.length === 0}
    <tr>
      <td colspan="7" class="text-center py-12 text-base-content/40">
        <div class="flex flex-col items-center gap-2">
          <User size={32} class="opacity-20" />
          <span class="text-sm">No B2C customers found</span>
        </div>
      </td>
    </tr>
  {/if}
</tbody>