<script lang="ts">
	import { Icon } from 'lucide-svelte';
  import type { Component } from 'svelte';

  let { title, value, subtitle = '', icon, color = 'primary' } = $props<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: Component;
    color?: 'primary' | 'success' | 'warning' | 'info' | 'error';
  }>();

  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info:    'bg-info/10 text-info',
    error:   'bg-error/10 text-error',
  };
</script>

<div class="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow duration-200">
  <div class="card-body p-4 lg:p-5">

    <!-- Titre + icône -->
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs lg:text-sm text-base-content/60 font-medium truncate pr-2">
        {title}
      </span>
      <div class="rounded-lg p-1.5 lg:p-2 shrink-0 {colorClasses[color]}">
        <Icon size={16} />
      </div>
    </div>

    <!-- Valeur principale -->
    <p class="text-xl lg:text-2xl font-bold truncate">{value}</p>

    <!-- Sous-titre -->
    {#if subtitle}
      <p class="text-xs text-base-content/40 mt-1 truncate">{subtitle}</p>
    {/if}

  </div>
</div>