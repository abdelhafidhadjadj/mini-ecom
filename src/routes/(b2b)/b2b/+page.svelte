<script lang="ts">
  import { Package, ShoppingCart, CheckCircle, Clock } from 'lucide-svelte';
  import OrderStatusBadge from '$lib/components/dashboard/orders/OrderStatusBadge.svelte';

  let { data } = $props();

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
</script>

<svelte:head>
  <title>B2B Dashboard — {data.userB2B.nom_entreprise}</title>
</svelte:head>

<div class="flex flex-col gap-6 lg:gap-8">

  <!-- Header -->
  <div>
    <h1 class="text-2xl lg:text-3xl font-bold">Welcome back, {data.userB2B.contact_nom}!</h1>
    <p class="text-base-content/60 mt-1">
      {data.userB2B.type_client_nom} — {data.userB2B.remise_defaut}% discount on all products
    </p>
  </div>

  <!-- Stats Cards -->
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-base-content/60">Total Orders</span>
          <ShoppingCart size={20} class="text-primary" />
        </div>
        <p class="text-3xl font-bold">{data.stats.total_commandes || 0}</p>
      </div>
    </div>

    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-base-content/60">Total Spent</span>
          <Package size={20} class="text-success" />
        </div>
        <p class="text-3xl font-bold">{formatPrix(data.stats.total_depense || 0)}</p>
      </div>
    </div>

    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-base-content/60">Pending</span>
          <Clock size={20} class="text-warning" />
        </div>
        <p class="text-3xl font-bold">{data.stats.commandes_en_attente || 0}</p>
      </div>
    </div>

    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-base-content/60">Delivered</span>
          <CheckCircle size={20} class="text-success" />
        </div>
        <p class="text-3xl font-bold">{data.stats.commandes_livrees || 0}</p>
      </div>
    </div>

  </div>

  <div class="grid lg:grid-cols-2 gap-6 lg:gap-8">

    <!-- Recent Orders -->
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-0">
        <div class="flex items-center justify-between p-5 border-b border-base-200">
          <h2 class="font-semibold">Recent Orders</h2>
          <a href="/b2b/dashboard/orders" class="text-sm text-primary hover:underline">
            View all →
          </a>
        </div>

        {#if data.recentOrders.length > 0}
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead>
                <tr class="text-base-content/60">
                  <th>Order #</th>
                  <th>Date</th>
                  <th class="text-right">Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {#each data.recentOrders as order}
                  <tr class="hover">
                    <td>
                      <a
                        href="/b2b/dashboard/orders/{order.id}"
                        class="font-mono text-sm text-primary hover:underline"
                      >
                        #{order.id}
                      </a>
                    </td>
                    <td class="text-sm">{formatDate(order.created_at)}</td>
                    <td class="text-right font-semibold">{formatPrix(order.total)}</td>
                    <td>
                      <OrderStatusBadge statut={order.statut} size="xs" />
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {:else}
          <div class="p-12 text-center text-base-content/40">
            <ShoppingCart size={32} class="mx-auto mb-2 opacity-20" />
            <p class="text-sm">No orders yet</p>
            <a href="/b2b/dashboard/products" class="btn btn-primary btn-sm mt-3">
              Browse Products
            </a>
          </div>
        {/if}

      </div>
    </div>

    <!-- Popular Products -->
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-0">
        <div class="flex items-center justify-between p-5 border-b border-base-200">
          <h2 class="font-semibold">Your Frequently Ordered</h2>
          <a href="/b2b/dashboard/products" class="text-sm text-primary hover:underline">
            Browse all →
          </a>
        </div>

        {#if data.popularProducts.length > 0}
          <div class="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {#each data.popularProducts as product}
              
              <a
                href="/products/{product.slug}"
                class="flex flex-col gap-2 p-3 rounded-lg border border-base-200 hover:border-primary hover:shadow transition-all"
              >
                <div class="aspect-square bg-base-200 rounded-lg overflow-hidden">
                  {#if product.image_principale}
                    <img
                      src={product.image_principale}
                      alt={product.nom}
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  {:else}
                    <div class="w-full h-full flex items-center justify-center">
                      <Package size={24} class="text-base-content/20" />
                    </div>
                  {/if}
                </div>
                <div>
                  <p class="text-xs font-medium line-clamp-2">{product.nom}</p>
                  <p class="text-sm font-bold text-primary mt-1">
                    {formatPrix(product.prix)}
                  </p>
                </div>
              </a>
            {/each}
          </div>
        {:else}
          <div class="p-12 text-center text-base-content/40">
            <Package size={32} class="mx-auto mb-2 opacity-20" />
            <p class="text-sm">No orders history yet</p>
          </div>
        {/if}

      </div>
    </div>

  </div>

</div>