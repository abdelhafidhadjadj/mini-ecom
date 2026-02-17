<script lang="ts">
  import { page } from '$app/stores';
  import {
    LayoutDashboard,
    ClipboardList,
    Wrench,
    FolderOpen,
    Layers,
    Package,
    Users,
    UserCog,
    Settings,
    LogOut,
  } from 'lucide-svelte';

  let { user } = $props<{
    user: { nom: string; role: string };
  }>();

  const navItems = [
    { label: 'Tableau de bord', href: '/dashboard',            icon: LayoutDashboard },
    { label: 'Commandes',       href: '/dashboard/commandes',  icon: ClipboardList   },
    { label: 'Produits',        href: '/dashboard/produits',   icon: Wrench          },
    { label: 'Catalogues',      href: '/dashboard/catalogues', icon: FolderOpen      },
    { label: 'Catégories',      href: '/dashboard/categories', icon: Layers          },
    { label: 'Stock',           href: '/dashboard/stock',      icon: Package         },
    { label: 'Clients',         href: '/dashboard/clients',    icon: Users           },
  ];

  const adminItems = [
    { label: 'Utilisateurs', href: '/dashboard/utilisateurs', icon: UserCog  },
    { label: 'Paramètres',   href: '/dashboard/parametres',   icon: Settings },
  ];

  function isActive(href: string): boolean {
    if (href === '/dashboard') {
      return $page.url.pathname === '/dashboard';
    }
    return $page.url.pathname.startsWith(href);
  }
</script>

<aside class="flex flex-col w-64 min-h-screen bg-base-100 border-r border-base-200">

  <!-- Logo -->
  <div class="p-5 border-b border-base-200">
    <div class="flex items-center gap-3">
      <div class="bg-primary text-primary-content rounded-xl p-2 shrink-0">
        <Wrench size={20} />
      </div>
      <div class="min-w-0">
        <h2 class="font-bold text-base leading-tight truncate">Outillage Pro</h2>
        <p class="text-xs text-base-content/50">Dashboard</p>
      </div>
    </div>
  </div>

  <!-- Navigation principale -->
  <nav class="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">

    {#each navItems as item}
      {@const Icon = item.icon}
      <a href={item.href}
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
        class:bg-primary={isActive(item.href)}
        class:text-primary-content={isActive(item.href)}
        class:shadow-sm={isActive(item.href)}
        class:hover:bg-base-200={!isActive(item.href)}
        class:text-base-content={!isActive(item.href)}
      >
        <Icon size={18} class="shrink-0" />
        <span class="truncate">{item.label}</span>
      </a>
    {/each}

    {#if user.role === 'admin'}
      <div class="divider text-xs text-base-content/30 my-1 px-3">ADMIN</div>

      {#each adminItems as item}
        {@const Icon = item.icon}
        <a href={item.href}
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
          class:bg-primary={isActive(item.href)}
          class:text-primary-content={isActive(item.href)}
          class:shadow-sm={isActive(item.href)}
          class:hover:bg-base-200={!isActive(item.href)}
          class:text-base-content={!isActive(item.href)}
        >
          <Icon size={18} class="shrink-0" />
          <span class="truncate">{item.label}</span>
        </a>
      {/each}

    {/if}

  </nav>

  <!-- User + Logout -->
  <div class="p-3 border-t border-base-200">
    <div class="flex items-center gap-3 px-2 py-2 mb-1 rounded-lg bg-base-200/50">
      <div class="avatar placeholder shrink-0">
        <div class="bg-primary text-primary-content rounded-full w-8">
          <span class="text-xs font-bold">
            {user.nom.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium truncate">{user.nom}</p>
        <p class="text-xs text-base-content/50 capitalize">{user.role}</p>
      </div>
    </div>

    <form method="POST" action="/api/auth/logout">
      <button
        type="submit"
        class="btn btn-ghost btn-sm w-full justify-start gap-2 text-error hover:bg-error/10 mt-1"
      >
        <LogOut size={15} />
        Déconnexion
      </button>
    </form>
  </div>

</aside>