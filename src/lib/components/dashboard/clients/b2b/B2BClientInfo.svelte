<script lang="ts">
  import { Building2, Mail, Phone, MapPin, Calendar } from 'lucide-svelte';

  let { client } = $props<{
    client: {
      contact_nom: string;
      email: string;
      telephone: string;
      wilaya?: string;
      adresse?: string;
      siret?: string;
      created_at: string;
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
      <Building2 size={16} class="text-warning" />
      Company Info
    </h2>

    <div class="flex flex-col gap-3">

      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Contact</span>
        <span class="font-medium text-sm">{client.contact_nom}</span>
      </div>

      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Email</span>
        <div class="flex items-center gap-1.5">
          <Mail size={13} class="text-base-content/40" />
          <span class="text-sm">{client.email}</span>
        </div>
      </div>

      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Phone</span>
        <div class="flex items-center gap-2">
          <Phone size={13} class="text-base-content/40" />
          <span class="text-sm">{client.telephone}</span>
          <a
            href="https://wa.me/{client.telephone.replace('+', '')}"
            target="_blank"
            class="btn btn-success btn-xs"
          >WA</a>
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

      {#if client.adresse}
        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-base-content/50 uppercase tracking-wide">Address</span>
          <span class="text-sm">{client.adresse}</span>
        </div>
      {/if}

      {#if client.siret}
        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-base-content/50 uppercase tracking-wide">N° Registre</span>
          <span class="text-sm font-mono">{client.siret}</span>
        </div>
      {/if}

      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-base-content/50 uppercase tracking-wide">Registered</span>
        <div class="flex items-center gap-1.5">
          <Calendar size={13} class="text-base-content/40" />
          <span class="text-sm">{formatDate(client.created_at)}</span>
        </div>
      </div>

    </div>
  </div>
</div>