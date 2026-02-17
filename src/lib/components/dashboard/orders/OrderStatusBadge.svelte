<script lang="ts">
  let { statut, size = 'sm' } = $props<{
    statut: string;
    size?: 'xs' | 'sm' | 'md';
  }>();

  const config: Record<string, { label: string; class: string }> = {
    en_attente:     { label: 'En attente',    class: 'badge-warning'  },
    confirmee:      { label: 'Confirmée',     class: 'badge-info'     },
    en_preparation: { label: 'En préparation', class: 'badge-primary' },
    expedie:        { label: 'Expédiée',      class: 'badge-accent'   },
    livre:          { label: 'Livrée',        class: 'badge-success'  },
    annulee:        { label: 'Annulée',       class: 'badge-error'    },
  };

  let current = $derived(config[statut] ?? { label: statut, class: 'badge-ghost' });
</script>

<span class="badge badge-{size} {current.class} font-medium">
  {current.label}
</span>