<script lang="ts">
  import { ArrowRight, Building2 } from 'lucide-svelte';
</script>

<section class="py-20 lg:py-28 bg-primary relative overflow-hidden">

  <!-- Motif de fond -->
  <div class="absolute inset-0 opacity-10"
    style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 40px 40px;">
  </div>

  <!-- Cercle décoratif -->
  <div class="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-white/10"></div>
  <div class="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white/5"></div>

  <div class="container mx-auto px-4 relative z-10">
    <div class="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">

      <div class="flex items-center gap-3">
        <div class="w-8 h-[2px] bg-primary-content/40"></div>
        <span class="text-primary-content/70 text-xs font-bold uppercase tracking-[0.3em]">
          Espace Professionnel
        </span>
        <div class="w-8 h-[2px] bg-primary-content/40"></div>
      </div>

      <h2 class="text-4xl lg:text-6xl font-black text-primary-content leading-tight tracking-tight">
        Vous êtes<br/>un professionnel ?
      </h2>

      <p class="text-primary-content/70 text-lg max-w-xl leading-relaxed">
        Accédez à nos tarifs grossiste, revendeur et super-grossiste.
        Créez votre compte B2B et bénéficiez de remises exclusives.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-4">
        <a
          href="/b2b/register"
          class="btn bg-primary-content text-primary hover:bg-primary-content/90 btn-lg gap-2 rounded-none font-bold uppercase tracking-wide text-sm px-8"
        >
          <Building2 size={18} />
          Créer un compte B2B
        </a>
        <a
          href="/b2b/login"
          class="btn btn-ghost text-primary-content border border-primary-content/30 btn-lg rounded-none uppercase text-sm tracking-wide gap-2"
        >
          Déjà client B2B ?
          <ArrowRight size={16} />
        </a>
      </div>

      <!-- Points forts B2B -->
      <div class="grid grid-cols-3 gap-8 mt-4 text-primary-content/70">
        <div class="text-center">
          <div class="text-3xl font-black text-primary-content">-10%</div>
          <div class="text-xs uppercase tracking-widest mt-1">Revendeur</div>
        </div>
        <div class="text-center border-x border-primary-content/20">
          <div class="text-3xl font-black text-primary-content">-20%</div>
          <div class="text-xs uppercase tracking-widest mt-1">Grossiste</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-black text-primary-content">-30%</div>
          <div class="text-xs uppercase tracking-widest mt-1">Super Grossiste</div>
        </div>
      </div>

    </div>
  </div>

</section>