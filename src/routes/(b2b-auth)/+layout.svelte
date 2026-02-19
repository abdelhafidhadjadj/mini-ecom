<script lang="ts">
  let { children } = $props();
  import "../layout.css"
</script>

<div class="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center p-4">
  <div class="w-full max-w-2xl">
    {@render children()}
  </div>
</div>