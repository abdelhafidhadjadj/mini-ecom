<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import OrderStatusBadge from '$lib/components/dashboard/orders/OrderStatusBadge.svelte';
  import OrderItemsTable from '$lib/components/b2b/OrderItemsTable.svelte';
  import OrderHistoryTimeline from '$lib/components/b2b/OrderHistoryTimeline.svelte';
  import OrderDeliveryInfo from '$lib/components/b2b/OrderDeliveryInfo.svelte';

  let { data } = $props();

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

<svelte:head>
  <title>Order #{data.commande.id} — B2B Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-6">

  <!-- Header -->
  <div class="flex items-center gap-3">
    <a href="/b2b/orders" class="btn btn-ghost btn-sm btn-circle">
      <ArrowLeft size={18} />
    </a>
    <div class="flex-1">
      <h1 class="text-2xl font-bold">Order #{data.commande.id}</h1>
      <p class="text-sm text-base-content/50">
        Placed on {formatDate(data.commande.created_at)}
      </p>
    </div>
    <OrderStatusBadge statut={data.commande.statut} size="md" />
  </div>

  <div class="grid lg:grid-cols-3 gap-6">

    <!-- Left: Items + Timeline -->
    <div class="lg:col-span-2 flex flex-col gap-6">
      <OrderItemsTable lignes={data.lignes} total={data.commande.total} />
      <OrderHistoryTimeline historique={data.historique} />
    </div>

    <!-- Right: Delivery info -->
    <OrderDeliveryInfo
      commande={data.commande}
      total={data.commande.total}
      itemsCount={data.lignes.length}
    />

  </div>

</div>