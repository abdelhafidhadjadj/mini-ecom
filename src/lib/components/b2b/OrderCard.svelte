<script lang="ts">
  import { Eye } from 'lucide-svelte';
  import OrderStatusBadge from '$lib/components/dashboard/orders/OrderStatusBadge.svelte';

  let { order } = $props<{
    order: {
      id: number;
      created_at: string;
      total: number;
      statut: string;
      client_nom: string;
      client_telephone: string;
      client_wilaya: string;
    };
  }>();

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="card bg-base-100 border border-base-200 hover:shadow-lg transition-shadow">
  <div class="card-body p-4 lg:p-5">

    <div class="flex items-start justify-between gap-3 mb-3">
      <!-- Order number + date -->
      <div>
        <a
          href="/b2b/orders/{order.id}"
          class="font-mono font-bold text-lg text-warning hover:underline"
        >
          #{order.id}
        </a>
        <p class="text-xs text-base-content/50 mt-0.5">
          {formatDate(order.created_at)}
        </p>
      </div>

      <!-- Status -->
      <OrderStatusBadge statut={order.statut} size="sm" />
    </div>

    <!-- Delivery info -->
    <div class="grid sm:grid-cols-2 gap-2 text-sm mb-3 pb-3 border-b border-base-200">
      <div>
        <span class="text-base-content/50">Contact:</span>
        <span class="ml-2 font-medium">{order.client_nom}</span>
      </div>
      <div>
        <span class="text-base-content/50">Wilaya:</span>
        <span class="ml-2 font-medium">{order.client_wilaya}</span>
      </div>
    </div>

    <!-- Total + View button -->
    <div class="flex items-center justify-between">
      <div>
        <span class="text-xs text-base-content/50">Total</span>
        <p class="font-bold text-xl text-warning">{formatPrix(order.total)}</p>
      </div>
      <a
      
        href="/b2b/orders/{order.id}"
        class="btn btn-warning btn-sm gap-2"
      >
        <Eye size={14} />
        View Details
      </a>
    </div>

  </div>
</div>