<script lang="ts">
  import { enhance } from '$app/forms';
  import {
    Building2, User, Mail, Phone, MapPin, FileText,
    Key, Shield, Calendar, TrendingUp, Award, CheckCircle, AlertCircle
  } from 'lucide-svelte';

  let { data, form } = $props();

  let loadingPassword = $state(false);
  let showSuccess = $state(false);

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-DZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function formatPrix(n: number | string): string {
    return Number(n).toLocaleString('fr-DZ') + ' DA';
  }

  $effect(() => {
    if (form?.success) {
      showSuccess = true;
      setTimeout(() => showSuccess = false, 3000);
    }
  });
</script>

<svelte:head>
  <title>Profile — B2B Dashboard</title>
</svelte:head>

<div class="flex flex-col gap-6">

  <!-- Header -->
  <div>
    <h1 class="text-2xl font-bold">My Profile</h1>
    <p class="text-base-content/60 mt-1">
      Manage your account information and preferences
    </p>
  </div>

  <div class="grid lg:grid-cols-3 gap-6">

    <!-- Left: Company info -->
    <div class="lg:col-span-2 flex flex-col gap-6">

      <!-- Company details -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-0">
          <div class="flex items-center gap-2 p-5 border-b border-base-200">
            <Building2 size={18} class="text-primary" />
            <h2 class="font-semibold">Company Information</h2>
          </div>

          <div class="p-5 grid sm:grid-cols-2 gap-4">

            <div class="flex items-start gap-3">
              <div class="bg-primary/10 p-2 rounded-lg">
                <Building2 size={16} class="text-primary" />
              </div>
              <div>
                <p class="text-xs text-base-content/50 mb-0.5">Company Name</p>
                <p class="font-medium">{data.client.nom_entreprise}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="bg-success/10 p-2 rounded-lg">
                <User size={16} class="text-success" />
              </div>
              <div>
                <p class="text-xs text-base-content/50 mb-0.5">Contact Person</p>
                <p class="font-medium">{data.client.contact_nom}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="bg-info/10 p-2 rounded-lg">
                <Mail size={16} class="text-info" />
              </div>
              <div>
                <p class="text-xs text-base-content/50 mb-0.5">Email</p>
                <p class="font-medium">{data.client.email}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="bg-warning/10 p-2 rounded-lg">
                <Phone size={16} class="text-warning" />
              </div>
              <div>
                <p class="text-xs text-base-content/50 mb-0.5">Phone</p>
                <p class="font-medium">{data.client.telephone}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="bg-error/10 p-2 rounded-lg">
                <MapPin size={16} class="text-error" />
              </div>
              <div>
                <p class="text-xs text-base-content/50 mb-0.5">Wilaya</p>
                <p class="font-medium">{data.client.wilaya}</p>
              </div>
            </div>

            {#if data.client.siret}
              <div class="flex items-start gap-3">
                <div class="bg-accent/10 p-2 rounded-lg">
                  <FileText size={16} class="text-accent" />
                </div>
                <div>
                  <p class="text-xs text-base-content/50 mb-0.5">SIRET/RC</p>
                  <p class="font-medium font-mono text-sm">{data.client.siret}</p>
                </div>
              </div>
            {/if}

            {#if data.client.adresse}
              <div class="flex items-start gap-3 sm:col-span-2">
                <div class="bg-secondary/10 p-2 rounded-lg">
                  <MapPin size={16} class="text-secondary" />
                </div>
                <div>
                  <p class="text-xs text-base-content/50 mb-0.5">Address</p>
                  <p class="font-medium">{data.client.adresse}</p>
                </div>
              </div>
            {/if}

          </div>
        </div>
      </div>

      <!-- Change password -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-0">
          <div class="flex items-center gap-2 p-5 border-b border-base-200">
            <Key size={18} class="text-warning" />
            <h2 class="font-semibold">Change Password</h2>
          </div>

          <div class="p-5">

            {#if showSuccess}
              <div class="alert alert-success mb-4">
                <CheckCircle size={16} />
                <span class="text-sm">{form?.message}</span>
              </div>
            {/if}

            {#if form?.error && form?.type === 'password'}
              <div class="alert alert-error mb-4">
                <AlertCircle size={16} />
                <span class="text-sm">{form.error}</span>
              </div>
            {/if}

            <form
              method="POST"
              action="?/changePassword"
              use:enhance={() => {
                loadingPassword = true;
                return async ({ update }) => {
                  await update();
                  loadingPassword = false;
                };
              }}
              class="flex flex-col gap-4"
            >

              <div class="form-control gap-1.5">
                <label class="label py-0" for="current_password">
                  <span class="label-text font-medium">Current Password</span>
                </label>
                <input
                  id="current_password"
                  name="current_password"
                  type="password"
                  class="input input-bordered"
                  required
                  disabled={loadingPassword}
                />
              </div>

              <div class="form-control gap-1.5">
                <label class="label py-0" for="new_password">
                  <span class="label-text font-medium">New Password</span>
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  class="input input-bordered"
                  minlength="8"
                  required
                  disabled={loadingPassword}
                />
              </div>

              <div class="form-control gap-1.5">
                <label class="label py-0" for="confirm_password">
                  <span class="label-text font-medium">Confirm New Password</span>
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  class="input input-bordered"
                  minlength="8"
                  required
                  disabled={loadingPassword}
                />
              </div>

              <button
                type="submit"
                class="btn btn-warning w-full sm:w-auto"
                disabled={loadingPassword}
              >
                {#if loadingPassword}
                  <span class="loading loading-spinner loading-sm"></span>
                  Changing...
                {:else}
                  Change Password
                {/if}
              </button>

            </form>
          </div>
        </div>
      </div>

    </div>

    <!-- Right: Account type + Stats -->
    <div class="flex flex-col gap-6">

      <!-- Account type -->
      <div class="card bg-warning/10 border border-warning/20">
        <div class="card-body p-5">
          <div class="flex items-center gap-2 mb-3">
            <Award size={18} class="text-warning" />
            <h3 class="font-semibold">Account Type</h3>
          </div>
          
          <div class="text-center py-4">
            <p class="text-2xl font-bold text-warning mb-1">
              {data.client.type_client_nom}
            </p>
            <p class="text-3xl font-bold text-warning mb-2">
              {data.client.remise_defaut}%
            </p>
            <p class="text-sm text-base-content/70">
              discount on all products
            </p>
          </div>

          {#if data.client.type_description}
            <div class="text-xs text-base-content/60 bg-base-100 rounded-lg p-3 mt-3">
              {data.client.type_description}
            </div>
          {/if}
        </div>
      </div>

      <!-- Account status -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-5">
          <div class="flex items-center gap-2 mb-3">
            <Shield size={18} class="text-success" />
            <h3 class="font-semibold">Account Status</h3>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-base-content/60">Status</span>
              <span class="badge badge-success">Approved</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-base-content/60">Member since</span>
              <span class="text-sm font-medium">{formatDate(data.client.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-5">
          <div class="flex items-center gap-2 mb-3">
            <TrendingUp size={18} class="text-primary" />
            <h3 class="font-semibold">Your Stats</h3>
          </div>
          
          <div class="space-y-3">
            <div>
              <p class="text-xs text-base-content/50 mb-1">Total Orders</p>
              <p class="text-2xl font-bold">{data.stats.total_commandes || 0}</p>
            </div>
            <div>
              <p class="text-xs text-base-content/50 mb-1">Total Spent</p>
              <p class="text-xl font-bold text-warning">
                {formatPrix(data.stats.total_depense || 0)}
              </p>
            </div>
            {#if data.stats.last_order}
              <div>
                <p class="text-xs text-base-content/50 mb-1">Last Order</p>
                <p class="text-sm">{formatDate(data.stats.last_order)}</p>
              </div>
            {/if}
          </div>
        </div>
      </div>

    </div>

  </div>

</div>