<script lang="ts">
  import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-svelte';

  let { catalogues } = $props<{
    catalogues: {
      id: number;
      nom: string;
      slug: string;
    }[];
  }>();

  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-base-200 border-t border-base-300 mt-auto">

  <!-- Main footer -->
  <div class="container mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

      <!-- About -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <div class="bg-primary text-primary-content rounded-lg p-1.5">
            🔧
          </div>
          <span class="font-bold text-lg">Outillage Pro</span>
        </div>
        <p class="text-sm text-base-content/70 mb-4">
          Your trusted partner for quality tools and hardware in Algeria. Professional service and competitive prices.
        </p>
        <div class="flex gap-3">
          <a href="#" class="btn btn-ghost btn-sm btn-circle" aria-label="Facebook">
            <Facebook size={18} />
          </a>
          <a href="#" class="btn btn-ghost btn-sm btn-circle" aria-label="Instagram">
            <Instagram size={18} />
          </a>
          <a
            href="https://wa.me/213XXXXXXXXX"
            target="_blank"
            rel="noopener"
            class="btn btn-success btn-sm btn-circle"
            aria-label="WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>

      <!-- Catalogues -->
      <div>
        <h3 class="font-semibold mb-4">Our Catalogs</h3>
        <ul class="space-y-2">
          {#each catalogues as catalogue}
            <li>
              <a
                href="/catalog/{catalogue.slug}"
                class="text-sm text-base-content/70 hover:text-primary transition-colors"
              >
                {catalogue.nom}
              </a>
            </li>
          {/each}
          <li>
            <a
              href="/products"
              class="text-sm text-primary font-medium hover:underline"
            >
              View all products →
            </a>
          </li>
        </ul>
      </div>

      <!-- Quick links -->
      <div>
        <h3 class="font-semibold mb-4">Quick Links</h3>
        <ul class="space-y-2">
          <li>
            <a href="/" class="text-sm text-base-content/70 hover:text-primary transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="/products" class="text-sm text-base-content/70 hover:text-primary transition-colors">
              Products
            </a>
          </li>
          <li>
            <a href="/cart" class="text-sm text-base-content/70 hover:text-primary transition-colors">
              Shopping Cart
            </a>
          </li>
          <li>
            <a href="#" class="text-sm text-base-content/70 hover:text-primary transition-colors">
              About Us
            </a>
          </li>
          <li>
            <a href="#" class="text-sm text-base-content/70 hover:text-primary transition-colors">
              Contact
            </a>
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="font-semibold mb-4">Contact Us</h3>
        <ul class="space-y-3">
          <li class="flex items-start gap-2 text-sm text-base-content/70">
            <MapPin size={16} class="mt-0.5 shrink-0" />
            <span>123 Rue Example, Algiers, Algeria</span>
          </li>
          <li class="flex items-center gap-2 text-sm text-base-content/70">
            <Phone size={16} class="shrink-0" />
            <a href="tel:+213XXXXXXXXX" class="hover:text-primary transition-colors">
              +213 XX XXX XXXX
            </a>
          </li>
          <li class="flex items-center gap-2 text-sm text-base-content/70">
            <Mail size={16} class="shrink-0" />
            <a href="mailto:contact@example.dz" class="hover:text-primary transition-colors">
              contact@example.dz
            </a>
          </li>
          <li class="flex items-center gap-2 text-sm">
            <MessageCircle size={16} class="shrink-0 text-success" />
            <a
              href="https://wa.me/213XXXXXXXXX"
              target="_blank"
              rel="noopener"
              class="text-success font-medium hover:underline"
            >
              WhatsApp Us
            </a>
          </li>
        </ul>
      </div>

    </div>
  </div>

  <!-- Bottom bar -->
  <div class="border-t border-base-300">
    <div class="container mx-auto px-4 py-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-base-content/60">
        <p>© {currentYear} Outillage Pro. All rights reserved.</p>
        <div class="flex gap-4">
          <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </div>

</footer>