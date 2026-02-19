<script lang="ts">
  import { ArrowRight, ShoppingCart, Building2 } from 'lucide-svelte';

  let { orders } = $props<{
    orders: {
      id: number;
      client_nom: string;
      client_telephone: string;
      client_wilaya: string;
      total: number;
      statut: string;
      created_at: string;
      client_b2b_id?: number | null;
      nom_entreprise?: string | null;
      type_client_nom?: string | null;
    }[];
  }>();

  const statutConfig: Record<string, { label: string; class: string }> = {
    en_attente:     { label: 'En attente',  class: 'badge-warning' },
    confirmee:      { label: 'Confirmée',   class: 'badge-info'    },
    en_preparation: { label: 'Préparation', class: 'badge-primary' },
    expedie:        { label: 'Expédiée',    class: 'badge-accent'  },
    livre:          { label: 'Livrée',      class: 'badge-success' },
    annulee:        { label: 'Annulée',     class: 'badge-error'   },
  };

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-0">

    <!-- Header -->
    <div class="flex items-center justify-between p-5 border-b border-base-200">
      <div class="flex items-center gap-2">
        <ShoppingCart size={18} />
        <h2 class="font-semibold">Commandes récentes</h2>
      </div>
      <a href="/dashboard/orders" class="btn btn-ghost btn-xs gap-1 text-primary">
        Voir tout
        <ArrowRight size={14} />
      </a>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr class="text-base-content/50">
            <th>#</th>
            <th>Client</th>
            <th>Wilaya</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {#each orders as order}
            <tr class="hover">

              <!-- ID + badge -->
              <td>
                <div class="flex flex-col gap-1">
                  <a
                    href="/dashboard/orders/{order.id}"
                    class="font-mono font-bold text-primary hover:underline"
                  >
                    #{order.id}
                  </a>
                  {#if order.client_b2b_id}
                    <span class="badge badge-warning badge-xs">B2B</span>
                  {:else}
                    <span class="badge badge-info badge-xs">B2C</span>
                  {/if}
                </div>
              </td>

              <!-- Client -->
              <td>
                {#if order.client_b2b_id && order.nom_entreprise}
                  <div class="flex items-center gap-1">
                    <Building2 size={12} class="text-warning shrink-0" />
                    <span class="font-semibold text-sm">{order.nom_entreprise}</span>
                  </div>
                  <div class="text-xs text-base-content/50">{order.client_nom}</div>
                  {#if order.type_client_nom}
                    <span class="badge badge-warning badge-xs opacity-70 mt-0.5">
                      {order.type_client_nom}
                    </span>
                  {/if}
                {:else}
                  <div class="font-medium text-sm">{order.client_nom}</div>
                  <div class="text-xs text-base-content/50">{order.client_telephone}</div>
                {/if}
              </td>

              <td class="text-sm">{order.client_wilaya}</td>
              <td class="font-semibold text-sm">{formatPrix(order.total)}</td>

              <td>
                <span class="badge badge-sm {statutConfig[order.statut]?.class}">
                  {statutConfig[order.statut]?.label ?? order.statut}
                </span>
              </td>

              <td class="text-xs text-base-content/50">
                {formatDate(order.created_at)}
              </td>

            </tr>
          {/each}

          {#if orders.length === 0}
            <tr>
              <td colspan="6" class="text-center py-8 text-base-content/40">
                Aucune commande pour le moment
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>

  </div>
</div>