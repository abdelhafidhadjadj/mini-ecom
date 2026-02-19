<script lang="ts">
  import { enhance } from '$app/forms';
  import { Eye, EyeOff, Building2, AlertCircle, CheckCircle } from 'lucide-svelte';

  let { data, form } = $props();

  let loading = $state(false);
  let showPassword = $state(false);
  let showPasswordConfirm = $state(false);
</script>

<svelte:head>
  <title>B2B Registration — Outillage Pro</title>
</svelte:head>

<div class="card bg-base-100 shadow-xl border border-base-200">
  <div class="card-body p-6 lg:p-8 gap-6">

    <!-- Header -->
    <div class="text-center">
      <div class="inline-flex items-center justify-center bg-warning text-warning-content rounded-2xl w-14 h-14 mb-4">
        <Building2 size={28} />
      </div>
      <h1 class="text-2xl font-bold">Create B2B Account</h1>
      <p class="text-base-content/50 text-sm mt-1">
        Register as a professional customer for exclusive prices
      </p>
    </div>

    <!-- Error -->
    {#if form?.error}
      <div class="alert alert-error py-3">
        <AlertCircle size={16} class="shrink-0" />
        <span class="text-sm">{form.error}</span>
      </div>
    {/if}

    <!-- Form -->
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

      <!-- Company info -->
      <div class="bg-base-200/50 rounded-lg p-4">
        <h3 class="font-semibold text-sm mb-3">Company Information</h3>

        <div class="grid sm:grid-cols-2 gap-3">
          <!-- Nom entreprise -->
          <div class="form-control gap-1.5 sm:col-span-2">
            <label class="label py-0" for="nom_entreprise">
              <span class="label-text font-medium">Company Name <span class="text-error">*</span></span>
            </label>
            <input
              id="nom_entreprise"
              name="nom_entreprise"
              type="text"
              class="input input-bordered input-sm"
              placeholder="Ex: ABC Tools SARL"
              value={form?.nom_entreprise ?? ''}
              required
              disabled={loading}
            />
          </div>

          <!-- Contact nom -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="contact_nom">
              <span class="label-text font-medium">Contact Name <span class="text-error">*</span></span>
            </label>
            <input
              id="contact_nom"
              name="contact_nom"
              type="text"
              class="input input-bordered input-sm"
              placeholder="Ex: Ahmed Benali"
              value={form?.contact_nom ?? ''}
              required
              disabled={loading}
            />
          </div>

          <!-- SIRET -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="siret">
              <span class="label-text font-medium">SIRET/RC</span>
              <span class="label-text-alt text-base-content/40">Optional</span>
            </label>
            <input
              id="siret"
              name="siret"
              type="text"
              class="input input-bordered input-sm"
              placeholder="Registration number"
              value={form?.siret ?? ''}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <!-- Contact info -->
      <div class="bg-base-200/50 rounded-lg p-4">
        <h3 class="font-semibold text-sm mb-3">Contact Information</h3>

        <div class="grid sm:grid-cols-2 gap-3">
          <!-- Email -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="email">
              <span class="label-text font-medium">Email <span class="text-error">*</span></span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              class="input input-bordered input-sm"
              placeholder="contact@company.dz"
              value={form?.email ?? ''}
              required
              disabled={loading}
            />
          </div>

          <!-- Telephone -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="telephone">
              <span class="label-text font-medium">Phone <span class="text-error">*</span></span>
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              class="input input-bordered input-sm"
              placeholder="+213 XXX XXX XXX"
              value={form?.telephone ?? ''}
              required
              disabled={loading}
            />
          </div>

          <!-- Wilaya -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="wilaya">
              <span class="label-text font-medium">Wilaya <span class="text-error">*</span></span>
            </label>
            <select
              id="wilaya"
              name="wilaya"
              class="select select-bordered select-sm"
              required
              disabled={loading}
            >
              <option value="">Select wilaya</option>
              {#each data.wilayas as w}
                <option value={w} selected={form?.wilaya === w}>{w}</option>
              {/each}
            </select>
          </div>

          <!-- Address -->
          <div class="form-control gap-1.5">
            <label class="label py-0" for="adresse">
              <span class="label-text font-medium">Address</span>
              <span class="label-text-alt text-base-content/40">Optional</span>
            </label>
            <input
              id="adresse"
              name="adresse"
              type="text"
              class="input input-bordered input-sm"
              placeholder="Street address"
              value={form?.adresse ?? ''}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <!-- Customer type -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="type_client_code">
          <span class="label-text font-medium">Customer Type <span class="text-error">*</span></span>
        </label>
        <select
          id="type_client_code"
          name="type_client_code"
          class="select select-bordered"
          required
          disabled={loading}
        >
          <option value="">Select your business type</option>
          {#each data.typesClient as type}
            <option value={type.code} selected={form?.type_client_code === type.code}>
              {type.nom} — {type.remise_defaut}% discount
              {#if type.description}
                ({type.description})
              {/if}
            </option>
          {/each}
        </select>
      </div>

      <!-- Password -->
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="form-control gap-1.5">
          <label class="label py-0" for="password">
            <span class="label-text font-medium">Password <span class="text-error">*</span></span>
          </label>
          <div class="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              class="input input-bordered input-sm w-full pr-10"
              placeholder="Min 8 characters"
              required
              minlength="8"
              disabled={loading}
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              onclick={() => showPassword = !showPassword}
            >
              {#if showPassword}
                <EyeOff size={16} />
              {:else}
                <Eye size={16} />
              {/if}
            </button>
          </div>
        </div>

        <div class="form-control gap-1.5">
          <label class="label py-0" for="password_confirm">
            <span class="label-text font-medium">Confirm Password <span class="text-error">*</span></span>
          </label>
          <div class="relative">
            <input
              id="password_confirm"
              name="password_confirm"
              type={showPasswordConfirm ? 'text' : 'password'}
              class="input input-bordered input-sm w-full pr-10"
              placeholder="Repeat password"
              required
              minlength="8"
              disabled={loading}
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              onclick={() => showPasswordConfirm = !showPasswordConfirm}
            >
              {#if showPasswordConfirm}
                <EyeOff size={16} />
              {:else}
                <Eye size={16} />
              {/if}
            </button>
          </div>
        </div>
      </div>

      <!-- Info alert -->
      <div class="alert alert-info text-sm">
        <AlertCircle size={16} class="shrink-0" />
        <span>Your account will be reviewed by our team. You'll receive confirmation within 24-48 hours.</span>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="btn btn-warning w-full mt-2"
        disabled={loading}
      >
        {#if loading}
          <span class="loading loading-spinner loading-sm"></span>
          Creating account...
        {:else}
          Create B2B Account
        {/if}
      </button>

    </form>

    <!-- Login link -->
    <div class="text-center text-sm text-base-content/60">
      Already have an account?
      <a href="/b2b-auth/login" class="text-warning font-medium hover:underline">
        Login here
      </a>
    </div>

  </div>
</div>