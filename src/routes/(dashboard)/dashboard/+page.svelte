<script lang="ts">
  import { TrendingUp, Clock, Wrench, Package } from 'lucide-svelte';
  import StatCard from '$lib/components/dashboard/StatCard.svelte';
  import RecentOrdersTable from '$lib/components/dashboard/RecentOrdersTable.svelte';
  import LowStockList from '$lib/components/dashboard/LowStockList.svelte';

  let { data } = $props();

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }
</script>

<svelte:head>
  <title>Dashboard — Outillage Pro</title>
</svelte:head>

<div class="flex flex-col gap-4 lg:gap-6">

  <!-- Stats -->
  <div class="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
    <StatCard
      title="CA aujourd'hui"
      value={formatPrix(data.stats.ca_jour)}
      subtitle="{data.stats.commandes_jour} commande(s)"
      icon={TrendingUp}
      color="success"
    />
    <StatCard
      title="CA ce mois"
      value={formatPrix(data.stats.ca_mois)}
      subtitle="{data.stats.total_commandes} au total"
      icon={TrendingUp}
      color="primary"
    />
    <StatCard
      title="En attente"
      value={data.stats.en_attente}
      subtitle="À traiter"
      icon={Clock}
      color="warning"
    />
    <StatCard
      title="En préparation"
      value={data.stats.en_preparation}
      subtitle="En cours"
      icon={Wrench}
      color="info"
    />
  </div>

  <!-- Contenu -->
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
    <div class="xl:col-span-2">
      <RecentOrdersTable orders={data.recentOrders} />
    </div>
    <div>
      <LowStockList items={data.lowStock} />
    </div>
  </div>

</div>