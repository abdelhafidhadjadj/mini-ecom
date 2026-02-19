<script lang="ts">
  import Navbar from '$lib/components/public/Navbar.svelte';
  import Footer from '$lib/components/public/Footer.svelte';
  import "../layout.css"
  let { data, children } = $props();
</script>

<div class="flex flex-col min-h-screen">
  
  <Navbar catalogues={data.catalogues} />

  <main class="flex-1">
    {@render children()}
  </main>

  <Footer catalogues={data.catalogues} />

</div>