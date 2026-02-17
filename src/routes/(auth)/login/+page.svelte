<script lang="ts">
  import { enhance } from '$app/forms';
  import { Eye, EyeOff, Wrench, AlertCircle } from 'lucide-svelte';

  let { form } = $props();

  let loading = $state(false);
  let showPassword = $state(false);
</script>

<svelte:head>
  <title>Connexion — Outillage Pro</title>
</svelte:head>

<div class="card bg-base-100 shadow-xl border border-base-200">
  <div class="card-body p-6 lg:p-8 gap-6">

    <!-- Logo + Titre -->
    <div class="text-center">
      <div class="inline-flex items-center justify-center bg-primary text-primary-content rounded-2xl w-14 h-14 mb-4">
        <Wrench size={28} />
      </div>
      <h1 class="text-2xl font-bold">Outillage Pro</h1>
      <p class="text-base-content/50 text-sm mt-1">
        Connectez-vous à votre dashboard
      </p>
    </div>

    <!-- Message d'erreur -->
    {#if form?.error}
      <div class="alert alert-error py-3">
        <AlertCircle size={16} class="shrink-0" />
        <span class="text-sm">{form.error}</span>
      </div>
    {/if}

    <!-- Formulaire -->
    <form
      method="POST"
      use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          await update();
          loading = false;
        };
      }}
      class="flex flex-col gap-4"
    >

      <!-- Email -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="email">
          <span class="label-text font-medium">Email</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          class="input input-bordered w-full focus:input-primary"
          class:input-error={form?.error}
          placeholder="admin@boutique.dz"
          value={form?.email ?? ''}
          required
          autocomplete="email"
          disabled={loading}
        />
      </div>

      <!-- Mot de passe -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="password">
          <span class="label-text font-medium">Mot de passe</span>
        </label>
        <div class="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            class="input input-bordered w-full pr-12 focus:input-primary"
            class:input-error={form?.error}
            placeholder="••••••••"
            required
            autocomplete="current-password"
            disabled={loading}
          />
          <!-- Toggle afficher/cacher mot de passe -->
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
            onclick={() => showPassword = !showPassword}
            aria-label={showPassword ? 'Cacher' : 'Afficher'}
          >
            {#if showPassword}
              <EyeOff size={18} />
            {:else}
              <Eye size={18} />
            {/if}
          </button>
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="btn btn-primary w-full mt-2"
        disabled={loading}
      >
        {#if loading}
          <span class="loading loading-spinner loading-sm"></span>
          Connexion en cours...
        {:else}
          Se connecter
        {/if}
      </button>

    </form>

  </div>
</div>

<!-- Version -->
<p class="text-center text-xs text-base-content/30 mt-4">
  Outillage Pro v1.0 — Dashboard Admin
</p>