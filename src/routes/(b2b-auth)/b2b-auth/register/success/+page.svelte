<script lang="ts">
  import { CheckCircle, ArrowRight } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Registration Successful — Outillage Pro</title>
</svelte:head>

<div class="card bg-base-100 shadow-xl border border-base-200">
  <div class="card-body p-8 lg:p-12 text-center gap-6">

    <!-- Success icon -->
    <div class="flex justify-center">
      <div class="bg-success/10 rounded-full p-4">
        <CheckCircle size={64} class="text-success" />
      </div>
    </div>

    <!-- Title -->
    <div>
      <h1 class="text-2xl font-bold mb-2">Registration Successful!</h1>
      <p class="text-base-content/70">
        Your B2B account request has been submitted
      </p>
    </div>

    <!-- Info -->
    <div class="bg-warning/10 border border-warning/20 rounded-lg p-6 text-left">
      <h3 class="font-semibold mb-3">What happens next?</h3>
      <ol class="space-y-2 text-sm text-base-content/70">
        <li class="flex gap-2">
          <span class="text-warning font-bold">1.</span>
          <span>Our team will review your application within 24-48 hours</span>
        </li>
        <li class="flex gap-2">
          <span class="text-warning font-bold">2.</span>
          <span>You'll receive an email confirmation once approved</span>
        </li>
        <li class="flex gap-2">
          <span class="text-warning font-bold">3.</span>
          <span>You can then login and access exclusive B2B prices</span>
        </li>
      </ol>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-3 mt-4">
      <a href="/" class="btn btn-outline flex-1">
        Back to Store
      </a>
      <a href="/b2b-auth/login" class="btn btn-warning flex-1 gap-2">
        Go to Login
        <ArrowRight size={16} />
      </a>
    </div>

  </div>
</div>