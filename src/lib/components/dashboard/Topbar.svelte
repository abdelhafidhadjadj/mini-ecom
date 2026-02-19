<script lang="ts">
  import { Bell, Menu } from 'lucide-svelte';

  let { title = 'Dashboard', user } = $props<{
    title?: string;
    user?: { nom: string; role: string; email?: string };
  }>();

  // Safe defaults si user est undefined
  let userName = $derived(user?.nom ?? 'User');
  let userRole = $derived(user?.role ?? 'guest');
  let userInitial = $derived(userName.charAt(0).toUpperCase());
</script>

<header class="sticky top-0 z-30 bg-base-100 border-b border-base-200">
  <div class="flex items-center justify-between px-4 lg:px-6 h-14 lg:h-16">

    <!-- Gauche : burger mobile + titre -->
    <div class="flex items-center gap-3">

      <!-- Burger — mobile uniquement -->
      <label
        for="mobile-drawer"
        class="btn btn-ghost btn-sm btn-circle lg:hidden"
        aria-label="Ouvrir menu"
      >
        <Menu size={20} />
      </label>

      <!-- Titre page -->
      <h1 class="text-base lg:text-lg font-semibold truncate max-w-[200px] sm:max-w-none">
        {title}
      </h1>
    </div>

    <!-- Droite : notifs + user -->
    <div class="flex items-center gap-2 lg:gap-3">

      <!-- Bouton notifications -->
      <button
        class="btn btn-ghost btn-sm btn-circle relative"
        aria-label="Notifications"
      >
        <Bell size={18} />
        <!-- Badge notif -->
        <span class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
      </button>

      <div class="divider divider-horizontal mx-0 hidden sm:flex"></div>

      <!-- User info — caché sur très petit écran -->
      <div class="hidden sm:flex flex-col items-end">
        <span class="text-sm font-medium leading-tight">{userName}</span>
        <span class="text-xs text-base-content/50 capitalize">{userRole}</span>
      </div>

      <!-- Avatar -->
      <div class="avatar placeholder">
        <div class="bg-primary text-primary-content rounded-full w-8 lg:w-9 cursor-pointer">
          <span class="text-xs lg:text-sm font-bold">
            {userInitial}
          </span>
        </div>
      </div>

    </div>
  </div>
</header>