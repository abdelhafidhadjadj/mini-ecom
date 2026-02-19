<script lang="ts">
  import { page } from '$app/stores';
  import { ShoppingCart, Menu, X, ChevronDown, Search, Phone } from 'lucide-svelte';

  let { catalogues } = $props<{
    catalogues: {
      id: number;
      nom: string;
      slug: string;
      categories: { id: number; nom: string; slug: string }[];
    }[];
  }>();

  let mobileMenuOpen = $state(false);
  let searchQuery = $state('');
  let activeDropdown = $state<number | null>(null);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  function toggleDropdown(catalogueId: number) {
    activeDropdown = activeDropdown === catalogueId ? null : catalogueId;
  }
</script>

<header class="sticky top-0 z-50 bg-base-100 border-b border-base-200 shadow-sm">

  <!-- Top bar -->
  <div class="bg-primary text-primary-content">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-10 text-sm">
        <div class="flex items-center gap-4">
          <a href="tel:+213XXXXXXXXX" class="flex items-center gap-1.5 hover:opacity-80">
            <Phone size={14} />
            <span class="hidden sm:inline">+213 XX XXX XXXX</span>
          </a>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden md:inline">🚚 Free delivery in Algiers</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Main navbar -->
  <nav class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">

      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 font-bold text-xl text-primary">
        <div class="bg-primary text-primary-content rounded-lg p-1.5">
          🔧
        </div>
        <span class="hidden sm:inline">Outillage Pro</span>
      </a>

      <!-- Desktop menu -->
      <div class="hidden lg:flex items-center gap-6">

        <a
          href="/"
          class="text-sm font-medium hover:text-primary transition-colors"
          class:text-primary={$page.url.pathname === '/'}
        >
          Home
        </a>

        <a
          href="/products"
          class="text-sm font-medium hover:text-primary transition-colors"
          class:text-primary={$page.url.pathname.startsWith('/products')}
        >
          All Products
        </a>

        {#each catalogues as catalogue}
          <div class="dropdown dropdown-hover">
            <button
              tabindex="0"
              class="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
              class:text-primary={$page.url.pathname.includes(catalogue.slug)}
            >
              {catalogue.nom}
              <ChevronDown size={14} />
            </button>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200 mt-1">
              <li>
                <a href="/catalog/{catalogue.slug}" class="text-sm">
                  All {catalogue.nom}
                </a>
              </li>
              <li class="menu-title text-xs">Categories</li>
              {#each catalogue.categories as cat}
                <li>
                  <a href="/category/{cat.slug}" class="text-sm">
                    {cat.nom}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}

      </div>

      <!-- Right actions -->
      <div class="flex items-center gap-3">

        <!-- Search (desktop) -->
        <div class="hidden md:flex items-center">
          <label class="input input-bordered input-sm flex items-center gap-2 w-48 lg:w-64">
            <Search size={14} class="opacity-50" />
            <input
              type="text"
              placeholder="Search products..."
              class="grow text-sm"
              bind:value={searchQuery}
            />
          </label>
        </div>

        <!-- Cart -->
        <button
          class="btn btn-ghost btn-sm btn-circle relative"
          aria-label="Cart"
        >
          <ShoppingCart size={20} />
          <span class="absolute -top-1 -right-1 bg-primary text-primary-content text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            0
          </span>
        </button>

        <!-- Mobile menu toggle -->
        <button
          class="btn btn-ghost btn-sm btn-circle lg:hidden"
          onclick={toggleMobileMenu}
          aria-label="Menu"
        >
          {#if mobileMenuOpen}
            <X size={20} />
          {:else}
            <Menu size={20} />
          {/if}
        </button>

      </div>

    </div>
  </nav>

  <!-- Mobile menu -->
  {#if mobileMenuOpen}
    <div class="lg:hidden border-t border-base-200 bg-base-100">
      <div class="container mx-auto px-4 py-4 flex flex-col gap-2">

        <!-- Search mobile -->
        <label class="input input-bordered input-sm flex items-center gap-2 mb-2">
          <Search size={14} class="opacity-50" />
          <input
            type="text"
            placeholder="Search..."
            class="grow text-sm"
            bind:value={searchQuery}
          />
        </label>

        <a
          href="/"
          class="btn btn-ghost btn-sm justify-start"
          onclick={closeMobileMenu}
        >
          Home
        </a>

        <a
          href="/products"
          class="btn btn-ghost btn-sm justify-start"
          onclick={closeMobileMenu}
        >
          All Products
        </a>

        {#each catalogues as catalogue}
          <div class="collapse collapse-arrow bg-base-200 rounded-lg">
            <input
              type="checkbox"
              checked={activeDropdown === catalogue.id}
              onchange={() => toggleDropdown(catalogue.id)}
            />
            <div class="collapse-title text-sm font-medium">
              {catalogue.nom}
            </div>
            <div class="collapse-content">
              <div class="flex flex-col gap-1">
                <a                
                  href="/catalog/{catalogue.slug}"
                  class="btn btn-ghost btn-xs justify-start"
                  onclick={closeMobileMenu}
                >
                  All {catalogue.nom}
                </a>
                {#each catalogue.categories as cat}
                  <a
                    href="/category/{cat.slug}"
                    class="btn btn-ghost btn-xs justify-start pl-4"
                    onclick={closeMobileMenu}
                  >
                    {cat.nom}
                  </a>
                {/each}
              </div>
            </div>
          </div>
        {/each}

      </div>
    </div>
  {/if}

</header>