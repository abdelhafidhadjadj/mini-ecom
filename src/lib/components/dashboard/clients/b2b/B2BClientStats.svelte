<script lang="ts">
  let { stats } = $props<{
    stats: {
      total: number;
      ca_total: number;
      livrees: number;
      annulees: number;
    };
  }>();

  function formatPrix(n: number): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }
</script>

<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">

  <div class="card bg-base-100 border border-base-200 shadow-sm">
    <div class="card-body p-4 gap-1">
      <span class="text-xs text-base-content/50">Total Orders</span>
      <span class="text-2xl font-bold">{stats.total}</span>
    </div>
  </div>

  <div class="card bg-success/10 border border-success/20 shadow-sm">
    <div class="card-body p-4 gap-1">
      <span class="text-xs text-success">CA Total</span>
      <span class="text-lg font-bold text-success">{formatPrix(stats.ca_total)}</span>
    </div>
  </div>

  <div class="card bg-base-100 border border-base-200 shadow-sm">
    <div class="card-body p-4 gap-1">
      <span class="text-xs text-base-content/50">Delivered</span>
      <span class="text-2xl font-bold">{stats.livrees}</span>
    </div>
  </div>

  <div class="card bg-base-100 border border-base-200 shadow-sm">
    <div class="card-body p-4 gap-1">
      <span class="text-xs text-base-content/50">Cancelled</span>
      <span class="text-2xl font-bold">{stats.annulees}</span>
    </div>
  </div>

</div>