<script lang="ts">
  import { Package, Phone, MapPin, FileText } from 'lucide-svelte';

  let { commande, total, itemsCount } = $props<{
    commande: {
      id: number;
      total: number;
      client_nom: string;
      client_telephone: string;
      client_wilaya: string;
      client_adresse?: string;
      notes?: string;
    };
    total: number;
    itemsCount: number;
  }>();

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }
</script>

<div class="flex flex-col gap-6">

  <!-- Contact info -->
  <div class="card bg-base-100 shadow-sm border border-base-200">
    <div class="card-body p-5 gap-4">
      <h3 class="font-semibold text-sm">Delivery Information</h3>

      <div class="flex items-start gap-3">
        <div class="bg-primary/10 p-2 rounded-lg">
          <Package size={16} class="text-primary" />
        </div>
        <div class="text-sm">
          <p class="text-base-content/50 text-xs mb-0.5">Contact</p>
          <p class="font-medium">{commande.client_nom}</p>
        </div>
      </div>

      <div class="flex items-start gap-3">
        <div class="bg-success/10 p-2 rounded-lg">
          <Phone size={16} class="text-success" />
        </div>
        <div class="text-sm">
          <p class="text-base-content/50 text-xs mb-0.5">Phone</p>
          <a
            href="tel:{commande.client_telephone}"
            class="font-medium hover:text-warning transition-colors"
          >
            {commande.client_telephone}
          </a>
        </div>
      </div>

      <div class="flex items-start gap-3">
        <div class="bg-info/10 p-2 rounded-lg">
          <MapPin size={16} class="text-info" />
        </div>
        <div class="text-sm">
          <p class="text-base-content/50 text-xs mb-0.5">Wilaya</p>
          <p class="font-medium">{commande.client_wilaya}</p>
          {#if commande.client_adresse}
            <p class="text-xs text-base-content/60 mt-1">
              {commande.client_adresse}
            </p>
          {/if}
        </div>
      </div>

    </div>
  </div>

  <!-- Notes -->
  {#if commande.notes}
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-5 gap-3">
        <div class="flex items-center gap-2">
          <FileText size={16} class="text-warning" />
          <h3 class="font-semibold text-sm">Notes</h3>
        </div>
        <p class="text-sm text-base-content/70">
          {commande.notes}
        </p>
      </div>
    </div>
  {/if}

  <!-- Summary -->
  <div class="card bg-warning/10 border border-warning/20">
    <div class="card-body p-5">
      <h3 class="font-semibold text-sm mb-3">Order Summary</h3>
      <div class="flex justify-between text-sm mb-2">
        <span class="text-base-content/60">Items ({itemsCount})</span>
        <span class="font-medium">{formatPrix(total)}</span>
      </div>
      <div class="divider my-2"></div>
      <div class="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span class="text-warning">{formatPrix(total)}</span>
      </div>
    </div>
  </div>

</div>