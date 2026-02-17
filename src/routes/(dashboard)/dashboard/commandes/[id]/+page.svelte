<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import OrderInfo from '$lib/components/dashboard/orders/OrderInfo.svelte';
  import OrderItems from '$lib/components/dashboard/orders/OrderItems.svelte';
  import OrderStatusChanger from '$lib/components/dashboard/orders/OrderStatusChanger.svelte';
  import OrderTimeline from '$lib/components/dashboard/orders/OrderTimeline.svelte';
  import OrderStatusBadge from '$lib/components/dashboard/orders/OrderStatusBadge.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Order #{data.commande.id} — Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-6">

  <!-- ─── Header ──────────────────────────────────────── -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

    <!-- Back + titre -->
    <div class="flex items-center gap-3">
      <a
        href="/dashboard/commandes"
        class="btn btn-ghost btn-sm btn-circle"
        aria-label="Back"
      >
        <ArrowLeft size={18} />
      </a>
      <div>
        <h1 class="text-lg font-bold">
          Order <span class="font-mono text-primary">#{data.commande.id}</span>
        </h1>
        <p class="text-xs text-base-content/50">
          {new Date(data.commande.created_at).toLocaleDateString('fr-DZ', {
            day: '2-digit', month: 'long', year: 'numeric'
          })}
        </p>
      </div>
    </div>

    <!-- Statut actuel -->
    <OrderStatusBadge statut={data.commande.statut} size="md" />

  </div>

  <!-- ─── Contenu ──────────────────────────────────────── -->
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">

    <!-- Colonne gauche — infos + items -->
    <div class="xl:col-span-2 flex flex-col gap-4 lg:gap-6">
      <OrderInfo commande={data.commande} />
      <OrderItems lignes={data.lignes} total={data.commande.total} />
    </div>

    <!-- Colonne droite — statut + timeline -->
    <div class="flex flex-col gap-4 lg:gap-6">
      <OrderStatusChanger
        statut={data.commande.statut}
        orderId={data.commande.id}
      />
      <OrderTimeline historique={data.historique} />
    </div>

  </div>

</div>