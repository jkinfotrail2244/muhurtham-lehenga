
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  ArrowUpRight,
  ImageOff,
  X,
} from "lucide-react";

import {
  usePublishedProducts,
  getProductSlug,
  getProductCollectionPath,
} from "../admin/services/productService";

import type {
  Product,
  PublicCollection,
} from "../admin/services/productService";

import {
  useOffers,
  getBestOfferForProduct,
  formatOfferDiscount,
} from "../admin/service/offerService";

import "./StorefrontProducts.css";

type Props = {
  collection?: PublicCollection;
  heading?: string;
  limit?: number;
};

function money(value: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);
}

const COLLECTION_TITLES: Record<
  PublicCollection,
  string
> = {
  all: "Discover our collections",
  collections: "Discover our collections",
  lehengas: "Lehenga Collection",
  sarees: "Saree Collection",
  sherwanis: "Sherwani Collection",
};

export default function StorefrontProducts({
  collection = "collections",
  heading,
  limit,
}: Props) {
  const location = useLocation();
  const pathLanguage = location.pathname.split("/")[1] || "en";
  const language = ["en", "fr", "de", "it"].includes(pathLanguage)
    ? pathLanguage
    : "en";

  const products = usePublishedProducts(collection);

  const [selected, setSelected] =
    useState<Product | null>(null);

  useOffers(); // Subscribe reactively to live offers

  const visibleProducts =
    limit !== undefined
      ? products.slice(0, Math.max(0, limit))
      : products;

  /* ======================================
     DON'T CHANGE THE WEBSITE IF NO
     PUBLISHED PRODUCTS EXIST
  ====================================== */

  if (visibleProducts.length === 0) {
    return null;
  }

  return (
    <section className="msw-products">
      <div className="msw-products-heading">
        <div>
          <span className="msw-products-eyebrow">
            MUHURTHAM COLLECTION
          </span>

          <h2>
            {heading ??
              COLLECTION_TITLES[collection]}
          </h2>

          <p>
            Timeless pieces, thoughtfully curated
            for your special moments.
          </p>
        </div>

        <span className="msw-products-count">
          {visibleProducts.length} pieces
        </span>
      </div>

      {/* PRODUCT GRID */}

      <div className="msw-products-grid">
        {visibleProducts.map((product: Product) => {
          const deal = getBestOfferForProduct(product.id, product.price);

          return (
            <article
              key={product.id}
              className="msw-product-card"
            >
              <button
                type="button"
                className="msw-product-photo"
                onClick={() => setSelected(product)}
                aria-label={`View ${product.name}`}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                ) : (
                  <span className="msw-product-placeholder">
                    <ImageOff size={26} />

                    <small>
                      MUHURTHAM COLLECTION
                    </small>
                  </span>
                )}

                {product.featured && (
                  <span className="msw-product-featured">
                    SIGNATURE PIECE
                  </span>
                )}

                {deal && (
                  <span className="msw-product-offer-badge">
                    ✦ {formatOfferDiscount(deal.offer)}
                  </span>
                )}
              </button>

              <div className="msw-product-content">
                <span className="msw-product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                {deal ? (
                  <div className="msw-product-price-row">
                    <span className="msw-product-price msw-price-discounted">
                      {money(deal.finalPrice)}
                    </span>
                    <span className="msw-price-original">
                      {money(product.price)}
                    </span>
                  </div>
                ) : (
                  <p className="msw-product-price">
                    {money(product.price)}
                  </p>
                )}

                <button
                  className="msw-product-view"
                  type="button"
                  onClick={() => setSelected(product)}
                >
                  VIEW DETAILS

                  <ArrowUpRight size={15} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* PRODUCT PREVIEW */}

      {selected && (
        <div
          className="msw-product-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div
            className="msw-product-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
          >
            <button
              type="button"
              className="msw-product-close"
              aria-label="Close product details"
              onClick={() => setSelected(null)}
            >
              <X size={22} />
            </button>

            <div className="msw-product-dialog-photo">
              {selected.image ? (
                <img
                  src={selected.image}
                  alt={selected.name}
                />
              ) : (
                <span className="msw-product-placeholder">
                  <ImageOff size={35} />
                  <small>
                    MUHURTHAM COLLECTION
                  </small>
                </span>
              )}
            </div>

            <div className="msw-product-dialog-content">
              <span className="msw-products-eyebrow">
                {selected.category}
              </span>

              <h2>{selected.name}</h2>

              {(() => {
                const selectedDeal = getBestOfferForProduct(
                  selected.id,
                  selected.price,
                );

                if (selectedDeal) {
                  return (
                    <div className="msw-product-dialog-price-row">
                      <span className="msw-product-dialog-price msw-price-discounted">
                        {money(selectedDeal.finalPrice)}
                      </span>
                      <span className="msw-price-original">
                        {money(selected.price)}
                      </span>
                      <span className="msw-offer-tag">
                        ✦ {formatOfferDiscount(selectedDeal.offer)}
                      </span>
                    </div>
                  );
                }

                return (
                  <p className="msw-product-dialog-price">
                    {money(selected.price)}
                  </p>
                );
              })()}

              <p>
                {selected.description ||
                  "A beautiful addition to the Muhurtham Collection."}
              </p>

              <span className="msw-product-availability">
                Available in our collection
              </span>

              <div style={{ display: "flex", gap: "10px", marginTop: "25px", flexWrap: "wrap" }}>
                <Link
                  to={`/${language}/${getProductCollectionPath(selected)}/${getProductSlug(selected)}`}
                  className="msw-product-done"
                  style={{ textDecoration: "none", textAlign: "center" }}
                  onClick={() => setSelected(null)}
                >
                  VIEW FULL PIECE
                </Link>

                <button
                  type="button"
                  className="msw-product-done"
                  onClick={() => setSelected(null)}
                >
                  CONTINUE EXPLORING
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
