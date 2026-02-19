<script lang="ts">
  import { page } from '$app/stores';
  import "../../layout.css"
  import {
    LayoutDashboard, Package, ShoppingCart, User,
    LogOut, Menu, X, Building2
  } from 'lucide-svelte';

  let { data, children } = $props();

  let mobileMenuOpen = $state(false);

  const navItems = [
    { label: 'Dashboard', href: '/b2b', icon: LayoutDashboard },
    { label: 'Products', href: '/b2b/products', icon: Package },
    { label: 'My Orders', href: '/b2b/orders', icon: ShoppingCart },
    { label: 'Profile', href: '/b2b/profile', icon: User },
  ];

  function isActive(href: string): boolean {
    if (href === '/b2b') {
      return $page.url.pathname === '/b2b';
    }
    return $page.url.pathname.startsWith(href);
  }
</script>

<div class="min-h-screen bg-base-200">

  <!-- Navbar -->
  <header class="sticky top-0 z-40 bg-warning text-warning-content shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">

        <!-- Logo + Company name -->
        <div class="flex items-center gap-3">
          <button
            class="btn btn-ghost btn-sm btn-circle lg:hidden"
            onclick={() => mobileMenuOpen = !mobileMenuOpen}
          >
            {#if mobileMenuOpen}
              <X size={20} />
            {:else}
              <Menu size={20} />
            {/if}
          </button>

          <a href="/b2b" class="flex items-center gap-2 font-bold">
            <Building2 size={24} />
            <span class="hidden sm:inline">{data.userB2B.nom_entreprise}</span>
          </a>
        </div>

        <!-- Desktop nav -->
        <nav class="hidden lg:flex items-center gap-1">
          {#each navItems as item}
            {@const Icon = item.icon}
            {@const active = isActive(item.href)}
            <a
              href={item.href}
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              class:bg-warning-content={active}
              class:text-warning={active}
              style={!active ? 'hover:background-color: rgb(255 255 255 / 0.1);' : ''}
            >
              <Icon size={16} />
              {item.label}
            </a>
          {/each}
        </nav>

        <!-- User info + logout -->
        <div class="flex items-center gap-3">
          <div class="hidden md:flex flex-col items-end">
            <span class="text-sm font-medium">{data.userB2B.contact_nom}</span>
            <span class="text-xs opacity-80">{data.userB2B.type_client_nom}</span>
          </div>
          <form method="POST" action="/b2b/logout">
            <button class="btn btn-ghost btn-sm btn-circle" title="Logout">
              <LogOut size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  </header>

  <!-- Mobile menu -->
  {#if mobileMenuOpen}
    <div class="lg:hidden bg-warning text-warning-content border-t border-warning-content/20">
      <nav class="container mx-auto px-4 py-3 flex flex-col gap-1">
        {#each navItems as item}
          {@const Icon = item.icon}
          {@const active = isActive(item.href)}
          <a
            href={item.href}
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            class:bg-warning-content={active}
            class:text-warning={active}
            style={!active ? 'hover:background-color: rgb(255 255 255 / 0.1);' : ''}
            onclick={() => mobileMenuOpen = false}
          >
            <Icon size={18} />
            {item.label}
          </a>
        {/each}
      </nav>
    </div>
  {/if}

  <!-- Main content -->
  <main class="container mx-auto px-4 py-6 lg:py-8">
    {@render children()}
  </main>

</div>