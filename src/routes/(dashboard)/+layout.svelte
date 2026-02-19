<script lang="ts">
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
  import Topbar from '$lib/components/dashboard/Topbar.svelte';
  import "../layout.css"
  let { data, children } = $props();

  const pageTitles: Record<string, string> = {
    '/dashboard':                  '📊 Dashboard',
    '/dashboard/orders':        '📋 Orders',
    '/dashboard/products':         '🔩 Products',
    '/dashboard/products/add': '🔩 Add product',
    '/dashboard/catalogues':       '📁 Catalogues',
    '/dashboard/categories':       '🗂️ Categories',
    '/dashboard/stock':            '📦 Stock',
    '/dashboard/clients':          '👥 Clients',
    '/dashboard/users':     '👤 Users',
    '/dashboard/settings':       '⚙️ Settings',
  };

  let currentTitle = $derived(
    pageTitles[$page.url.pathname] ?? 'Dashboard'
  );
</script>

<div class="drawer lg:drawer-open min-h-screen">
  <input id="mobile-drawer" type="checkbox" class="drawer-toggle" />

  <!-- Page content -->
  <div class="drawer-content flex flex-col bg-base-200">
    <Topbar title={currentTitle} user={data.user} />
    <main class="flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
      {@render children()}
    </main>
  </div>

  <!-- Sidebar -->
  <div class="drawer-side">
    <label for="mobile-drawer" aria-label="Fermer" class="drawer-overlay"></label>
    <Sidebar user={data.user} />
  </div>
</div>