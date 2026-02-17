<script lang="ts">
  import { Phone, MapPin, MessageCircle, Calendar, User } from 'lucide-svelte';

  let { commande } = $props<{
    commande: {
      id: number;
      client_nom: string;
      client_telephone: string;
      client_wilaya: string;
      client_adresse?: string;
      notes?: string;
      agent_nom?: string;
      created_at: string;
    };
  }>();

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day:    '2-digit',
      month:  '2-digit',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
  <div class="card-body p-4 lg:p-5 gap-4">

    <h2 class="font-semibold flex items-center gap-2">
      <User size={16} class="text-primary" />
      Customer Information
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

      <!-- Nom -->
      <div class="flex flex-col gap-1">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Name</span>
        <span class="font-medium">{commande.client_nom}</span>
      </div>

      <!-- Téléphone -->
      <div class="flex flex-col gap-1">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Phone</span>
        <div class="flex items-center gap-2">
          <span class="font-medium">{commande.client_telephone}</span>
          <a
            href="https://wa.me/{commande.client_telephone.replace('+', '')}"
            target="_blank"
            rel="noopener"
            class="btn btn-success btn-xs gap-1"
          >
            <MessageCircle size={12} />
            WhatsApp
          </a>
        </div>
      </div>

      <!-- Wilaya -->
      <div class="flex flex-col gap-1">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Wilaya</span>
        <div class="flex items-center gap-1.5">
          <MapPin size={14} class="text-base-content/40" />
          <span>{commande.client_wilaya}</span>
        </div>
      </div>

      <!-- Date -->
      <div class="flex flex-col gap-1">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Date</span>
        <div class="flex items-center gap-1.5">
          <Calendar size={14} class="text-base-content/40" />
          <span>{formatDate(commande.created_at)}</span>
        </div>
      </div>

      <!-- Adresse -->
      {#if commande.client_adresse}
        <div class="flex flex-col gap-1 sm:col-span-2">
          <span class="text-xs text-base-content/50 uppercase tracking-wide">Address</span>
          <span>{commande.client_adresse}</span>
        </div>
      {/if}

      <!-- Notes -->
      {#if commande.notes}
        <div class="flex flex-col gap-1 sm:col-span-2">
          <span class="text-xs text-base-content/50 uppercase tracking-wide">Notes</span>
          <div class="alert alert-warning py-2 text-sm">
            {commande.notes}
          </div>
        </div>
      {/if}

    </div>

  </div>
</div>