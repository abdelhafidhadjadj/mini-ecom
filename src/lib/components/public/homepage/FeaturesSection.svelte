<script lang="ts">
  import { Package, Truck, MessageCircle, ShieldCheck } from 'lucide-svelte';

  const features = [
    {
      icon: Package,
      title: 'Qualité Garantie',
      desc: 'Produits sélectionnés auprès de fournisseurs de confiance.',
      color: 'text-primary',
      bg:    'bg-primary/10',
    },
    {
      icon: Truck,
      title: 'Livraison Rapide',
      desc: 'Expédition dans toute l\'Algérie sous 24-48h.',
      color: 'text-success',
      bg:    'bg-success/10',
    },
    {
      icon: MessageCircle,
      title: 'Support WhatsApp',
      desc: 'Répondons à toutes vos questions via WhatsApp.',
      color: 'text-warning',
      bg:    'bg-warning/10',
    },
    {
      icon: ShieldCheck,
      title: 'Paiement Sécurisé',
      desc: 'Paiement à la livraison disponible partout.',
      color: 'text-accent',
      bg:    'bg-accent/10',
    },
  ];
</script>

<section class="py-20 lg:py-28 bg-base-100 border-t border-base-200">
  <div class="container mx-auto px-4">

    <!-- Header -->
    <div class="text-center mb-14">
      <div class="flex items-center justify-center gap-3 mb-4">
        <div class="w-8 h-[2px] bg-primary"></div>
        <span class="text-primary text-xs font-bold uppercase tracking-[0.3em]">Pourquoi nous ?</span>
        <div class="w-8 h-[2px] bg-primary"></div>
      </div>
      <h2 class="text-4xl lg:text-5xl font-black tracking-tight">
        Notre engagement.
      </h2>
    </div>

    <!-- Features grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-base-200">
      {#each features as f, i}
        <div class="p-8 flex flex-col gap-4 {i < 3 ? 'border-r border-base-200' : ''} group hover:bg-base-200/50 transition-colors">

          <div class="w-12 h-12 {f.bg} flex items-center justify-center {f.color}">
            <svelte:component this={f.icon} size={22} />
          </div>

          <div class="flex flex-col gap-2">
            <h3 class="font-bold text-base">{f.title}</h3>
            <p class="text-sm text-base-content/60 leading-relaxed">{f.desc}</p>
          </div>

          <!-- Ligne décorative -->
          <div class="w-0 group-hover:w-8 h-[2px] {f.bg.replace('bg-', 'bg-').replace('/10', '')} transition-all duration-300 mt-auto"></div>

        </div>
      {/each}
    </div>

  </div>
</section>