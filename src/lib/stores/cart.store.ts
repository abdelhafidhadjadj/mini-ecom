import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';

export type CartItem = {
  produit_id:   number;
  variante_id?: number | null;
  nom:          string;
  variante_nom?: string | null;
  prix:         number;
  quantite:     number;
  image_url?:   string | null;
  slug:         string;
};

const STORAGE_KEY = 'cart_b2c';

function loadFromStorage(): CartItem[] {
  if (!browser) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  if (!browser) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function createCart() {
  const { subscribe, set, update } = writable<CartItem[]>(loadFromStorage());

  return {
    subscribe,

    add(item: CartItem) {
      update(items => {
        const key = `${item.produit_id}-${item.variante_id ?? 'none'}`;
        const existing = items.find(
          i => `${i.produit_id}-${i.variante_id ?? 'none'}` === key
        );

        let newItems: CartItem[];
        if (existing) {
          newItems = items.map(i =>
            `${i.produit_id}-${i.variante_id ?? 'none'}` === key
              ? { ...i, quantite: i.quantite + item.quantite }
              : i
          );
        } else {
          newItems = [...items, item];
        }

        saveToStorage(newItems);
        return newItems;
      });
    },

    remove(produit_id: number, variante_id?: number | null) {
      update(items => {
        const newItems = items.filter(
          i => !(i.produit_id === produit_id && (i.variante_id ?? null) === (variante_id ?? null))
        );
        saveToStorage(newItems);
        return newItems;
      });
    },

    updateQuantite(produit_id: number, variante_id: number | null, quantite: number) {
      update(items => {
        let newItems: CartItem[];
        if (quantite <= 0) {
          newItems = items.filter(
            i => !(i.produit_id === produit_id && (i.variante_id ?? null) === variante_id)
          );
        } else {
          newItems = items.map(i =>
            i.produit_id === produit_id && (i.variante_id ?? null) === variante_id
              ? { ...i, quantite }
              : i
          );
        }
        saveToStorage(newItems);
        return newItems;
      });
    },

    clear() {
      set([]);
      saveToStorage([]);
    },
  };
}

export const cart = createCart();

// Nombre total d'articles
export const cartCount = derived(cart, $cart =>
  $cart.reduce((sum, i) => sum + i.quantite, 0)
);

// Total du panier
export const cartTotal = derived(cart, $cart =>
  $cart.reduce((sum, i) => sum + i.prix * i.quantite, 0)
);