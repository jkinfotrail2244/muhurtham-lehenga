
import { useMemo, useSyncExternalStore } from "react";

/* ==========================================
   PRODUCT TYPES
========================================== */

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  active: boolean;
  featured: boolean;
  createdAt: string;
};

export type ProductStats = {
  total: number;
  available: number;
  outOfStock: number;
};

export type PublicCollection =
  | "all"
  | "collections"
  | "lehengas"
  | "sarees"
  | "sherwanis";

/* ==========================================
   SHARED STORAGE
========================================== */

const STORAGE_KEY = "muhurtham-products-v1";

const UPDATE_EVENT = "muhurtham-products-updated";

/* ==========================================
   INITIAL DEVELOPMENT PRODUCTS

   These are development examples only.
   Replace them with real records before
   publishing your production website.
========================================== */

const INITIAL_PRODUCTS: Product[] = [
  // --- LEHENGAS ---
  {
    id: "mc-lh-001",
    sku: "MC-LH-001",
    name: "Royal Maroon Lehenga",
    category: "Bridal Wear",
    description:
      "A richly embroidered bridal lehenga in deep ceremonial maroon.",
    price: 145000,
    stock: 3,
    image: "/images/lehenga-bridal.png",
    active: true,
    featured: true,
    createdAt: "2026-10-24T09:00:00.000Z",
  },
  {
    id: "mc-lh-002",
    sku: "MC-LH-002",
    name: "Ivory Garden Lehenga",
    category: "Bridal Wear",
    description:
      "A graceful bridal lehenga in soft ivory with subtle champagne undertones.",
    price: 135000,
    stock: 2,
    image: "/images/lehenga-collection.png",
    active: true,
    featured: false,
    createdAt: "2026-10-23T09:00:00.000Z",
  },
  {
    id: "mc-lh-003",
    sku: "MC-LH-003",
    name: "Blush Pink Lehenga",
    category: "Occasion Wear",
    description:
      "A delicate blush lehenga with romantic, feminine embroidery.",
    price: 115000,
    stock: 4,
    image: "/images/lehenga-occasion.png",
    active: true,
    featured: false,
    createdAt: "2026-10-22T09:00:00.000Z",
  },
  {
    id: "mc-lh-004",
    sku: "MC-LH-004",
    name: "Golden Tissue Lehenga",
    category: "Occasion Wear",
    description:
      "A luminous metallic lehenga with fine texture and graceful movement.",
    price: 128000,
    stock: 2,
    image: "/images/lehenga-wedding.png",
    active: true,
    featured: false,
    createdAt: "2026-10-21T09:00:00.000Z",
  },

  // --- SAREES ---
  {
    id: "mc-sa-001",
    sku: "MC-SA-001",
    name: "Royal Red Saree",
    category: "Sarees",
    description:
      "A majestic bridal silk saree in auspicious crimson with hand-woven zari work.",
    price: 89000,
    stock: 5,
    image: "/images/saree-1.png",
    active: true,
    featured: true,
    createdAt: "2026-10-20T09:00:00.000Z",
  },
  {
    id: "mc-sa-002",
    sku: "MC-SA-002",
    name: "Ivory Gold Saree",
    category: "Sarees",
    description:
      "A sophisticated pure silk saree in ivory with opulent gold borders.",
    price: 92000,
    stock: 3,
    image: "/images/saree-2.png",
    active: true,
    featured: false,
    createdAt: "2026-10-19T09:00:00.000Z",
  },
  {
    id: "mc-sa-003",
    sku: "MC-SA-003",
    name: "Blush Rose Saree",
    category: "Sarees",
    description:
      "An ethereal organza saree in blush pink with soft shimmering motifs.",
    price: 78000,
    stock: 4,
    image: "/images/saree-3.png",
    active: true,
    featured: false,
    createdAt: "2026-10-18T09:00:00.000Z",
  },
  {
    id: "mc-sa-004",
    sku: "MC-SA-004",
    name: "Emerald Grace Saree",
    category: "Sarees",
    description:
      "A rich emerald green silk saree with traditional antique gold pallu.",
    price: 85000,
    stock: 2,
    image: "/images/saree-4.png",
    active: true,
    featured: false,
    createdAt: "2026-10-17T09:00:00.000Z",
  },
  {
    id: "mc-sa-005",
    sku: "MC-SA-005",
    name: "Champagne Drape Saree",
    category: "Sarees",
    description:
      "A modern celebration saree in champagne gold tissue with crystal border.",
    price: 94000,
    stock: 3,
    image: "/images/saree-5.png",
    active: true,
    featured: false,
    createdAt: "2026-10-16T09:00:00.000Z",
  },
  {
    id: "mc-sa-006",
    sku: "MC-SA-006",
    name: "Midnight Blue Saree",
    category: "Sarees",
    description:
      "A commanding midnight navy saree with delicate silver zari craftsmanship.",
    price: 82000,
    stock: 3,
    image: "/images/saree-6.png",
    active: true,
    featured: false,
    createdAt: "2026-10-15T09:00:00.000Z",
  },

  // --- SHERWANIS ---
  {
    id: "mc-mw-001",
    sku: "MC-MW-001",
    name: "Ivory Heritage Sherwani",
    category: "Menswear",
    description:
      "A regal raw silk sherwani in pristine ivory with understated tonal embroidery.",
    price: 62000,
    stock: 2,
    image: "/images/sherwani-1.png",
    active: true,
    featured: true,
    createdAt: "2026-10-14T09:00:00.000Z",
  },
  {
    id: "mc-mw-002",
    sku: "MC-MW-002",
    name: "Royal Sand Sherwani",
    category: "Menswear",
    description:
      "A distinguished groom sherwani in royal sand with intricate hand-embroidered collar.",
    price: 68000,
    stock: 3,
    image: "/images/sherwani-2.png",
    active: true,
    featured: true,
    createdAt: "2026-10-13T09:00:00.000Z",
  },
  {
    id: "mc-mw-003",
    sku: "MC-MW-003",
    name: "Midnight Embroidery Sherwani",
    category: "Menswear",
    description:
      "A bold navy sherwani accented with metallic thread embroidery.",
    price: 74000,
    stock: 2,
    image: "/images/sherwani-3.png",
    active: true,
    featured: false,
    createdAt: "2026-10-12T09:00:00.000Z",
  },
  {
    id: "mc-mw-004",
    sku: "MC-MW-004",
    name: "Champagne Classic Sherwani",
    category: "Menswear",
    description:
      "A timeless champagne sherwani suited for receptions and celebrations.",
    price: 58000,
    stock: 4,
    image: "/images/sherwani-4.png",
    active: true,
    featured: false,
    createdAt: "2026-10-11T09:00:00.000Z",
  },
  {
    id: "mc-mw-005",
    sku: "MC-MW-005",
    name: "Regal Ivory Sherwani",
    category: "Menswear",
    description:
      "An opulent wedding sherwani in warm ivory with textured woven silk.",
    price: 79000,
    stock: 2,
    image: "/images/sherwani-5.png",
    active: true,
    featured: false,
    createdAt: "2026-10-10T09:00:00.000Z",
  },
  {
    id: "mc-mw-006",
    sku: "MC-MW-006",
    name: "Mocha Textured Sherwani",
    category: "Menswear",
    description:
      "A tailored modern sherwani in mocha with fine geometric weave.",
    price: 64000,
    stock: 3,
    image: "/images/sherwani-6.png",
    active: true,
    featured: false,
    createdAt: "2026-10-09T09:00:00.000Z",
  },
];

/* ==========================================
   VALIDATION
========================================== */

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") {
    return false;
  }

  const p = value as Partial<Product>;

  return (
    typeof p.id === "string" &&
    typeof p.sku === "string" &&
    typeof p.name === "string" &&
    typeof p.category === "string" &&
    typeof p.description === "string" &&
    typeof p.image === "string" &&
    typeof p.createdAt === "string" &&
    typeof p.active === "boolean" &&
    typeof p.featured === "boolean" &&
    typeof p.price === "number" &&
    Number.isFinite(p.price) &&
    p.price >= 0 &&
    typeof p.stock === "number" &&
    Number.isInteger(p.stock) &&
    p.stock >= 0
  );
}

/* ==========================================
   SNAPSHOTS
========================================== */

function getSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

/* ==========================================
   PARSE STORAGE
========================================== */

function parseProducts(raw: string | null): Product[] {
  if (raw === null) {
    return [...INITIAL_PRODUCTS];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [...INITIAL_PRODUCTS];
    }

    const valid = parsed.filter(isProduct);
    if (valid.length === 0) {
      return [...INITIAL_PRODUCTS];
    }

    // If storage only holds early dev placeholders without pictures, seed with the full catalog
    if (valid.length <= 4 && valid.every((p) => !p.image)) {
      return [...INITIAL_PRODUCTS];
    }

    return valid;
  } catch {
    return [...INITIAL_PRODUCTS];
  }
}

/* ==========================================
   READ ALL PRODUCTS
========================================== */

export function readProducts(): Product[] {
  return parseProducts(getSnapshot());
}

/* ==========================================
   SAVE PRODUCT CHANGES

   Called by the admin ProductsPage.
========================================== */

export function saveProducts(
  products: Product[],
): string | null {
  if (typeof window === "undefined") {
    return "Browser storage is unavailable.";
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products),
    );

    window.dispatchEvent(new Event(UPDATE_EVENT));

    return null;
  } catch {
    return (
      "Unable to save products. " +
      "Browser storage may be full or disabled."
    );
  }
}

/* ==========================================
   SUBSCRIBE TO CHANGES

   Same-tab updates + other-tab updates.
========================================== */

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (
      event.key === STORAGE_KEY ||
      event.key === null
    ) {
      callback();
    }
  }

  window.addEventListener(UPDATE_EVENT, callback);

  window.addEventListener(
    "storage",
    handleStorage,
  );

  return () => {
    window.removeEventListener(
      UPDATE_EVENT,
      callback,
    );

    window.removeEventListener(
      "storage",
      handleStorage,
    );
  };
}

/* ==========================================
   SHARED REACTIVE PRODUCTS HOOK
========================================== */

export function useProducts(): Product[] {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo(
    () => parseProducts(snapshot),
    [snapshot],
  );
}

/* ==========================================
   ADMIN DASHBOARD STATISTICS
========================================== */

function calculateStats(
  products: Product[],
): ProductStats {
  return {
    total: products.length,

    available: products.filter(
      (product) =>
        product.active && product.stock > 0,
    ).length,

    outOfStock: products.filter(
      (product) => product.stock === 0,
    ).length,
  };
}

export function getProductStats(): ProductStats {
  return calculateStats(readProducts());
}

export function useProductStats(): ProductStats {
  const products = useProducts();

  return useMemo(
    () => calculateStats(products),
    [products],
  );
}

/* ==========================================
   WEBSITE CATEGORY MAPPING
========================================== */

export function belongsToCollection(
  product: Product,
  collection: PublicCollection,
): boolean {
  if (
    collection === "all" ||
    collection === "collections"
  ) {
    return true;
  }

  const category = product.category.toLowerCase();
  const name = product.name.toLowerCase();

  if (collection === "lehengas") {
    if (name.includes("saree") || name.includes("sherwani")) {
      return false;
    }
    return (
      category.includes("lehenga") ||
      name.includes("lehenga") ||
      category === "bridal wear" ||
      category === "occasion wear"
    );
  }

  if (collection === "sarees") {
    return (
      category.includes("saree") ||
      name.includes("saree")
    );
  }

  if (collection === "sherwanis") {
    return (
      category.includes("sherwani") ||
      category.includes("menswear") ||
      category.includes("groom") ||
      name.includes("sherwani")
    );
  }

  return false;
}

/* ==========================================
   SLUG AND PATH HELPERS
========================================== */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getProductSlug(product: Product): string {
  const nameLower = product.name.toLowerCase();
  if (nameLower.includes("royal maroon")) return "royal-maroon";
  if (nameLower.includes("ivory garden")) return "ivory-garden";
  if (nameLower.includes("blush pink")) return "blush-pink";
  if (nameLower.includes("golden tissue")) return "golden-tissue";
  if (nameLower.includes("royal red")) return "royal-red";
  if (nameLower.includes("ivory gold")) return "ivory-gold";
  if (nameLower.includes("blush rose")) return "blush-rose";
  if (nameLower.includes("emerald grace")) return "emerald-grace";
  if (nameLower.includes("champagne drape")) return "champagne-drape";
  if (nameLower.includes("midnight blue")) return "midnight-blue";
  if (nameLower.includes("ivory heritage")) return "ivory-heritage";
  if (nameLower.includes("royal sand")) return "royal-sand";
  if (nameLower.includes("midnight embroidery")) return "midnight-embroidery";
  if (nameLower.includes("champagne classic")) return "champagne-classic";
  if (nameLower.includes("regal ivory")) return "regal-ivory";
  if (nameLower.includes("mocha textured")) return "mocha-textured";

  return slugify(product.name) || product.id;
}

export function getProductCollectionPath(
  product: Product,
): "lehengas" | "sarees" | "sherwanis" {
  if (belongsToCollection(product, "sarees")) return "sarees";
  if (belongsToCollection(product, "sherwanis")) return "sherwanis";
  return "lehengas";
}

/* ==========================================
   FILTER WEBSITE PRODUCTS

   Only published, in-stock products
   appear on the customer website.
========================================== */

function filterPublicProducts(
  products: Product[],
  collection: PublicCollection,
): Product[] {
  return products
    .filter(
      (product) =>
        product.active &&
        product.stock > 0 &&
        belongsToCollection(product, collection),
    )
    .sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
}

/* ==========================================
   WEBSITE NON-REACTIVE ACCESS
========================================== */

export function getPublishedProducts(
  collection: PublicCollection = "all",
): Product[] {
  return filterPublicProducts(
    readProducts(),
    collection,
  );
}

/* ==========================================
   WEBSITE REACTIVE HOOK

   Use this on the customer-facing pages.
========================================== */

export function usePublishedProducts(
  collection: PublicCollection = "all",
): Product[] {
  const products = useProducts();

  return useMemo(
    () => filterPublicProducts(products, collection),
    [products, collection],
  );
}

