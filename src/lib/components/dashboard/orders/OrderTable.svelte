<script lang="ts">
  import { Eye, MessageCircle, Phone } from 'lucide-svelte';
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

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-0">
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
                <span class="font-mono font-bold text-primary text-sm">
                  #{order.id}
                </span>
              </td>

              <!-- Client -->
              <td>
                <div class="font-medium text-sm">{order.client_nom}</div>
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
                    href="/dashboard/commandes/{order.id}"
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
  </div>
</div>