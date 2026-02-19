<script lang="ts">
  import { Eye, MessageCircle, Phone, Building2 } from 'lucide-svelte';
  import OrderStatusBadge from '$lib/components/dashboard/orders/OrderStatusBadge.svelte';

  let { orders } = $props<{
    orders: {
      id: number;
      client_nom: string;
      client_telephone: string;
      client_wilaya: string;
      total: number;
      statut: string;
      whatsapp_entreprise_sent: boolean;
      created_at: string;
      client_b2b_id: number | null;
      nom_entreprise: string | null;
      type_client_nom: string | null;
      type_client_code: string | null;
    }[];
  }>();

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

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

<div class="overflow-x-auto">
  <table class="table table-sm lg:table-md">

    <thead>
      <tr class="bg-base-200/50 text-base-content/60">
        <th class="w-16">#</th>
        <th>Client</th>
        <th class="hidden md:table-cell">Wilaya</th>
        <th>Total</th>
        <th>Status</th>
        <th class="hidden lg:table-cell">Date</th>
        <th class="hidden sm:table-cell">WA</th>
        <th class="w-24">Actions</th>
      </tr>
    </thead>

    <tbody>
      {#each orders as order}
        <tr class="hover">

          <!-- ID -->
          <td>
            <div class="flex flex-col gap-1">
              <span class="font-mono font-bold text-primary text-sm">
                #{order.id}
              </span>
              <!-- Badge B2B / B2C -->
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
              <!-- Client B2B -->
              <div class="flex items-center gap-1.5">
                <Building2 size={13} class="text-warning shrink-0" />
                <span class="font-semibold text-sm">{order.nom_entreprise}</span>
              </div>
              <div class="text-xs text-base-content/50 mt-0.5">{order.client_nom}</div>
              {#if order.type_client_nom}
                <div class="mt-0.5">
                  <span class="badge badge-warning badge-xs opacity-70">
                    {order.type_client_nom}
                  </span>
                </div>
              {/if}
            {:else}
              <!-- Client B2C -->
              <div class="font-medium text-sm">{order.client_nom}</div>
            {/if}
            <div class="text-xs text-base-content/50 flex items-center gap-1 mt-0.5">
              <Phone size={10} />
              {order.client_telephone}
            </div>
          </td>

          <!-- Wilaya -->
          <td class="hidden md:table-cell text-sm">
            {order.client_wilaya}
          </td>

          <!-- Total -->
          <td class="font-semibold text-sm whitespace-nowrap">
            {formatPrix(order.total)}
          </td>

          <!-- Status -->
          <td>
            <OrderStatusBadge statut={order.statut} />
          </td>

          <!-- Date -->
          <td class="hidden lg:table-cell text-xs text-base-content/50 whitespace-nowrap">
            {formatDate(order.created_at)}
          </td>

          <!-- WhatsApp sent -->
          <td class="hidden sm:table-cell">
            {#if order.whatsapp_entreprise_sent}
              <span class="badge badge-success badge-xs">✓</span>
            {:else}
              <span class="badge badge-ghost badge-xs">—</span>
            {/if}
          </td>

          <!-- Actions -->
          <td>
            <div class="flex items-center gap-1">
              <a
                href="/dashboard/orders/{order.id}"
                class="btn btn-ghost btn-xs btn-circle tooltip"
                data-tip="View details"
              >
                <Eye size={14} />
              </a>
              <a
                href="https://wa.me/{order.client_telephone.replace('+', '')}"
                target="_blank"
                rel="noopener"
                class="btn btn-ghost btn-xs btn-circle tooltip text-success"
                data-tip="WhatsApp"
              >
                <MessageCircle size={14} />
              </a>
            </div>
          </td>

        </tr>
      {/each}

      {#if orders.length === 0}
        <tr>
          <td colspan="8" class="text-center py-12 text-base-content/40">
            <div class="flex flex-col items-center gap-2">
              <span class="text-3xl">📋</span>
              <span class="text-sm">No orders found</span>
            </div>
          </td>
        </tr>
      {/if}
    </tbody>

  </table>
</div>