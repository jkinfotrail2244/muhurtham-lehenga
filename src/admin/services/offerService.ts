
import {
  useMemo,
  useSyncExternalStore,
} from "react";

/* ==========================================
   MUHURTHAM COLLECTION
   OFFER MANAGEMENT SERVICE
========================================== */

export type DiscountType =
  | "percentage"
  | "fixed";

export type OfferApplication =
  | "all"
  | "selected";

export type OfferStatus =
  | "live"
  | "scheduled"
  | "paused"
  | "expired";

export type Offer = {
  id: string;
  title: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  application: OfferApplication;
  productIds: string[];
  startDate: string;
  endDate: string;
  active: boolean;
  featured: boolean;
  image: string;
  createdAt: string;
};

export type OfferStats = {
  total: number;
  live: number;
  scheduled: number;
  paused: number;
  expired: number;
};

/* ==========================================
   STORAGE CONFIGURATION
========================================== */

const STORAGE_KEY =
  "muhurtham-offers-v1";

const UPDATE_EVENT =
  "muhurtham-offers-updated";

/* ==========================================
   DATE HELPERS
========================================== */

export function getLocalDate(
  offsetDays = 0,
): string {
  const date = new Date();

  date.setDate(
    date.getDate() + offsetDays,
  );

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatOfferDate(
  value: string,
): string {
  if (!value) return "Not set";

  const date = new Date(
    `${value}T12:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

/* ==========================================
   VALIDATE SAVED OFFERS
========================================== */

function isOffer(
  value: unknown,
): value is Offer {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const offer =
    value as Partial<Offer>;

  return (
    typeof offer.id === "string" &&
    typeof offer.title === "string" &&
    typeof offer.code === "string" &&
    typeof offer.description === "string" &&
    (
      offer.discountType === "percentage" ||
      offer.discountType === "fixed"
    ) &&
    typeof offer.discountValue === "number" &&
    Number.isFinite(offer.discountValue) &&
    offer.discountValue > 0 &&
    (
      offer.application === "all" ||
      offer.application === "selected"
    ) &&
    Array.isArray(offer.productIds) &&
    offer.productIds.every(
      (id) => typeof id === "string",
    ) &&
    typeof offer.startDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      offer.startDate,
    ) &&
    typeof offer.endDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      offer.endDate,
    ) &&
    typeof offer.active === "boolean" &&
    typeof offer.featured === "boolean" &&
    typeof offer.image === "string" &&
    typeof offer.createdAt === "string"
  );
}

/* ==========================================
   STORAGE SNAPSHOTS
========================================== */

function getSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(
      STORAGE_KEY,
    );
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

/* ==========================================
   PARSE SAVED OFFERS

   No invented campaigns.
   First load starts with an empty list.
========================================== */

function parseOffers(
  raw: string | null,
): Offer[] {
  if (raw === null) return [];

  try {
    const parsed: unknown =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isOffer);
  } catch {
    return [];
  }
}

/* ==========================================
   READ OFFERS
========================================== */

export function readOffers(): Offer[] {
  return parseOffers(getSnapshot());
}

/* ==========================================
   SAVE OFFERS
========================================== */

export function saveOffers(
  offers: Offer[],
): string | null {
  if (typeof window === "undefined") {
    return "Browser storage is unavailable.";
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(offers),
    );

    window.dispatchEvent(
      new Event(UPDATE_EVENT),
    );

    return null;
  } catch {
    return (
      "Unable to save the offer. " +
      "Browser storage may be full or disabled. " +
      "Try using a smaller promotional image."
    );
  }
}

/* ==========================================
   REACTIVE SUBSCRIPTION
========================================== */

function subscribe(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  function onStorage(
    event: StorageEvent,
  ) {
    if (
      event.key === STORAGE_KEY ||
      event.key === null
    ) {
      callback();
    }
  }

  window.addEventListener(
    UPDATE_EVENT,
    callback,
  );

  window.addEventListener(
    "storage",
    onStorage,
  );

  return () => {
    window.removeEventListener(
      UPDATE_EVENT,
      callback,
    );

    window.removeEventListener(
      "storage",
      onStorage,
    );
  };
}

/* ==========================================
   REACTIVE OFFERS HOOK
========================================== */

export function useOffers(): Offer[] {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo(
    () => parseOffers(snapshot),
    [snapshot],
  );
}

/* ==========================================
   OFFER STATUS

   Start and end dates are inclusive.
========================================== */

export function getOfferStatus(
  offer: Offer,
  today = getLocalDate(),
): OfferStatus {
  if (!offer.active) {
    return "paused";
  }

  if (today > offer.endDate) {
    return "expired";
  }

  if (today < offer.startDate) {
    return "scheduled";
  }

  return "live";
}

/* ==========================================
   STATISTICS
========================================== */

function calculateStats(
  offers: Offer[],
): OfferStats {
  const stats: OfferStats = {
    total: offers.length,
    live: 0,
    scheduled: 0,
    paused: 0,
    expired: 0,
  };

  const today = getLocalDate();

  for (const offer of offers) {
    const status =
      getOfferStatus(offer, today);

    stats[status] += 1;
  }

  return stats;
}

export function getOfferStats(): OfferStats {
  return calculateStats(
    readOffers(),
  );
}

export function useOfferStats(): OfferStats {
  const offers = useOffers();

  return useMemo(
    () => calculateStats(offers),
    [offers],
  );
}

/* ==========================================
   ACTIVE PUBLIC OFFERS
========================================== */

export function getLiveOffers(): Offer[] {
  const today = getLocalDate();
  return readOffers().filter(
    (offer) =>
      getOfferStatus(offer, today) === "live",
  );
}

export function useLiveOffers(): Offer[] {
  const offers = useOffers();
  return useMemo(() => {
    const today = getLocalDate();
    return offers.filter((offer) => getOfferStatus(offer, today) === "live");
  }, [offers]);
}

export function formatOfferDiscount(offer: Offer): string {
  return offer.discountType === "percentage"
    ? `${offer.discountValue}% OFF`
    : `LKR ${offer.discountValue.toLocaleString()} OFF`;
}

export function useBestOfferForProduct(
  productId: string,
  originalPrice: number,
): {
  offer: Offer;
  discount: number;
  finalPrice: number;
} | null {
  const liveOffers = useLiveOffers();
  return useMemo(() => {
    if (!Number.isFinite(originalPrice) || originalPrice <= 0) return null;

    const eligible = liveOffers
      .filter((offer) => isProductEligible(offer, productId))
      .map((offer) => ({
        offer,
        discount: calculateDiscount(originalPrice, offer),
      }))
      .filter((item) => item.discount > 0)
      .sort((a, b) => b.discount - a.discount);

    const best = eligible[0];
    if (!best) return null;

    return {
      offer: best.offer,
      discount: best.discount,
      finalPrice: Math.max(0, originalPrice - best.discount),
    };
  }, [liveOffers, productId, originalPrice]);
}

/* ==========================================
   PRODUCT ELIGIBILITY
========================================== */

export function isProductEligible(
  offer: Offer,
  productId: string,
): boolean {
  return (
    offer.application === "all" ||
    offer.productIds.includes(productId)
  );
}

/* ==========================================
   DISCOUNT CALCULATION

   Fixed discounts are per product.
   Prices never fall below zero.
========================================== */

export function calculateDiscount(
  originalPrice: number,
  offer: Offer,
): number {
  if (
    !Number.isFinite(originalPrice) ||
    originalPrice <= 0
  ) {
    return 0;
  }

  const amount =
    offer.discountType === "percentage"
      ? originalPrice *
        (offer.discountValue / 100)
      : offer.discountValue;

  return Math.round(
    Math.min(
      originalPrice,
      Math.max(0, amount),
    ) * 100,
  ) / 100;
}

/* ==========================================
   BEST CURRENT OFFER FOR PRODUCT

   Useful when connecting customer pages.
   Does not stack multiple discounts.
========================================== */

export function getBestOfferForProduct(
  productId: string,
  originalPrice: number,
): {
  offer: Offer;
  discount: number;
  finalPrice: number;
} | null {
  const eligible = getLiveOffers()
    .filter(
      (offer) =>
        isProductEligible(
          offer,
          productId,
        ),
    )
    .map((offer) => ({
      offer,
      discount: calculateDiscount(
        originalPrice,
        offer,
      ),
    }))
    .sort(
      (a, b) =>
        b.discount - a.discount,
    );

  const best = eligible[0];

  if (!best) return null;

  return {
    offer: best.offer,
    discount: best.discount,
    finalPrice: Math.max(
      0,
      originalPrice - best.discount,
    ),
  };
}

/* ==========================================
   OFFER IMAGE OPTIMIZATION
========================================== */

export async function prepareOfferImage(
  file: File,
): Promise<string> {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowed.includes(file.type)) {
    throw new Error(
      "Please upload a JPG, PNG or WebP image.",
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(
      "Please select an image under 5 MB.",
    );
  }

  const url =
    URL.createObjectURL(file);

  try {
    const image = new Image();

    await new Promise<void>(
      (resolve, reject) => {
        image.onload = () => resolve();

        image.onerror = () =>
          reject(
            new Error(
              "Unable to read the image.",
            ),
          );

        image.src = url;
      },
    );

    const ratio = Math.min(
      960 / image.width,
      640 / image.height,
      1,
    );

    const canvas =
      document.createElement("canvas");

    canvas.width = Math.max(
      1,
      Math.round(
        image.width * ratio,
      ),
    );

    canvas.height = Math.max(
      1,
      Math.round(
        image.height * ratio,
      ),
    );

    const context =
      canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Image processing is unavailable.",
      );
    }

    context.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const result =
      canvas.toDataURL(
        "image/webp",
        0.72,
      );

    if (result.length > 750000) {
      throw new Error(
        "The optimized image is too large. " +
        "Please choose a smaller photograph.",
      );
    }

    return result;
  } finally {
    URL.revokeObjectURL(url);
  }
}
