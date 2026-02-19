<script lang="ts">
  import { enhance } from '$app/forms';
  import { Eye, EyeOff, Building2, AlertCircle } from 'lucide-svelte';

  let { form } = $props();

  let loading = $state(false);
  let showPassword = $state(false);
</script>

<svelte:head>
  <title>B2B Login — Outillage Pro</title>
</svelte:head>

<div class="card bg-base-100 shadow-xl border border-base-200">
  <div class="card-body p-6 lg:p-8 gap-6">

    <!-- Logo + Titre -->
    <div class="text-center">
      <div class="inline-flex items-center justify-center bg-warning text-warning-content rounded-2xl w-14 h-14 mb-4">
        <Building2 size={28} />
      </div>
      <h1 class="text-2xl font-bold">B2B Login</h1>
      <p class="text-base-content/50 text-sm mt-1">
        Professional & Wholesale Customers
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

      <!-- Email -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="email">
          <span class="label-text font-medium">Email</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          class="input input-bordered w-full focus:input-warning"
          class:input-error={form?.error}
          placeholder="your@company.dz"
          value={form?.email ?? ''}
          required
          autocomplete="email"
          disabled={loading}
        />
      </div>

      <!-- Password -->
      <div class="form-control gap-1.5">
        <label class="label py-0" for="password">
          <span class="label-text font-medium">Password</span>
        </label>
        <div class="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            class="input input-bordered w-full pr-12 focus:input-warning"
            class:input-error={form?.error}
            placeholder="••••••••"
            required
            autocomplete="current-password"
            disabled={loading}
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
            onclick={() => showPassword = !showPassword}
            aria-label={showPassword ? 'Hide' : 'Show'}
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
        class="btn btn-warning w-full mt-2"
        disabled={loading}
      >
        {#if loading}
          <span class="loading loading-spinner loading-sm"></span>
          Logging in...
        {:else}
          Login
        {/if}
      </button>

    </form>

    <!-- Divider -->
    <div class="divider text-xs text-base-content/40">New customer?</div>

    <!-- Register link -->
    <a href="/b2b-auth/register" class="btn btn-outline btn-warning w-full">
      Create B2B Account
    </a>

  </div>
</div>

<!-- Back to home -->
<div class="text-center mt-4">
  <a href="/" class="text-sm text-base-content/50 hover:text-primary">
    ← Back to store
  </a>
</div>