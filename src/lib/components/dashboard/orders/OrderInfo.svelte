<script lang="ts">
  import { Phone, MapPin, MessageCircle, Calendar, User, Building2, Tag } from 'lucide-svelte';

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
      client_b2b_id?: number | null;
      nom_entreprise?: string | null;
      b2b_email?: string | null;
      b2b_siret?: string | null;
      type_client_nom?: string | null;
      type_client_code?: string | null;
    };
  }>();

  const isB2B = $derived(!!commande.client_b2b_id);

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

    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="font-semibold flex items-center gap-2">
        {#if isB2B}
          <Building2 size={16} class="text-warning" />
          Company Information
        {:else}
          <User size={16} class="text-primary" />
          Customer Information
        {/if}
      </h2>

      <!-- Badge B2B / B2C -->
      {#if isB2B}
        <div class="flex items-center gap-2">
          <span class="badge badge-warning">B2B</span>
          {#if commande.type_client_nom}
            <span class="badge badge-warning badge-outline badge-sm">
              {commande.type_client_nom}
            </span>
          {/if}
        </div>
      {:else}
        <span class="badge badge-info">B2C</span>
      {/if}
    </div>

    <!-- Infos B2B spécifiques -->
    {#if isB2B && commande.nom_entreprise}
      <div class="bg-warning/5 border border-warning/20 rounded-lg p-3 flex flex-col gap-2">

        <div class="flex flex-col gap-1">
          <span class="text-xs text-base-content/50 uppercase tracking-wide">Company</span>
          <span class="font-semibold text-base">{commande.nom_entreprise}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {#if commande.b2b_email}
            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-base-content/50 uppercase tracking-wide">Email</span>
              <span class="text-sm">{commande.b2b_email}</span>
            </div>
          {/if}
          {#if commande.b2b_siret}
            <div class="flex flex-col gap-0.5">
              <span class="text-xs text-base-content/50 uppercase tracking-wide">N° Registre</span>
              <span class="text-sm font-mono">{commande.b2b_siret}</span>
            </div>
          {/if}
        </div>

      </div>
    {/if}

    <!-- Infos communes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

      <!-- Nom contact -->
      <div class="flex flex-col gap-1">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">
          {isB2B ? 'Contact' : 'Name'}
        </span>
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

      <!-- Prix appliqué (B2B uniquement) -->
      {#if isB2B && commande.type_client_nom}
        <div class="flex flex-col gap-1 sm:col-span-2">
          <span class="text-xs text-base-content/50 uppercase tracking-wide">Applied Pricing</span>
          <div class="flex items-center gap-2">
            <Tag size={14} class="text-warning" />
            <span class="font-medium text-warning">{commande.type_client_nom}</span>
          </div>
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