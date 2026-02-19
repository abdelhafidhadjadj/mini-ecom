<script lang="ts">
  import { User, Phone, MapPin, MessageCircle, Calendar } from 'lucide-svelte';

  let { client, telephone } = $props<{
    telephone: string;
    client: {
      client_nom: string;
      wilaya?: string;
      premiere_commande: string;
      derniere_commande: string;
    };
  }>();

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
</script>

<div class="card bg-base-100 border border-base-200 shadow-sm">
  <div class="card-body p-4 gap-4">

    <h2 class="font-semibold flex items-center gap-2">
      <User size={16} class="text-info" />
      Customer Info
    </h2>

    <div class="flex flex-col gap-3">

      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Name</span>
        <span class="font-medium text-sm">{client.client_nom}</span>
      </div>

      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Phone</span>
        <div class="flex items-center gap-2">
          <Phone size={13} class="text-base-content/40" />
          <span class="text-sm">{telephone}</span>
          <a
            href="https://wa.me/{telephone.replace('+', '')}"
            target="_blank"
            class="btn btn-success btn-xs gap-1"
          >
            <MessageCircle size={11} />
            WA
          </a>
        </div>
      </div>

      {#if client.wilaya}
        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-base-content/50 uppercase tracking-wide">Wilaya</span>
          <div class="flex items-center gap-1.5">
            <MapPin size={13} class="text-base-content/40" />
            <span class="text-sm">{client.wilaya}</span>
          </div>
        </div>
      {/if}

      <div class="divider my-0"></div>

      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">First Order</span>
        <div class="flex items-center gap-1.5">
          <Calendar size={13} class="text-base-content/40" />
          <span class="text-sm">{formatDate(client.premiere_commande)}</span>
        </div>
      </div>

      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Last Order</span>
        <div class="flex items-center gap-1.5">
          <Calendar size={13} class="text-base-content/40" />
          <span class="text-sm">{formatDate(client.derniere_commande)}</span>
        </div>
      </div>

    </div>
  </div>
</div>

<!-- Note B2C -->
<div class="alert bg-base-200/50 border border-base-300 text-sm">
  <User size={16} class="shrink-0" />
  <span class="text-base-content/60">
    B2C customer — no account. Identified by phone number.
  </span>
</div>