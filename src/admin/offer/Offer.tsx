
import {
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  ArrowDownToLine,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Eye,
  EyeOff,
  Flower2,
  Gift,
  ImagePlus,
  Package,
  PauseCircle,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  calculateDiscount,
  formatOfferDate,
  getLocalDate,
  getOfferStatus,
  isProductEligible,
  prepareOfferImage,
  saveOffers,
  useOffers,
  useOfferStats,
} from "../services/offerService";

import type {
  DiscountType,
  Offer,
  OfferApplication,
  OfferStatus,
} from "../services/offerService";

import {
  useProducts,
} from "../service/productService";

import type {
  Product,
} from "../service/productService";

import "./offer.css";

/* ==========================================
   TYPES
========================================== */

type OfferDraft = {
  title: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  application: OfferApplication;
  productIds: string[];
  startDate: string;
  endDate: string;
  active: boolean;
  featured: boolean;
  image: string;
};

type OfferFilter =
  | "all"
  | OfferStatus;

type OfferSort =
  | "newest"
  | "oldest"
  | "ending"
  | "title";

/* ==========================================
   HELPERS
========================================== */

function newDraft(): OfferDraft {
  return {
    title: "",
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    application: "all",
    productIds: [],
    startDate: getLocalDate(),
    endDate: getLocalDate(30),
    active: true,
    featured: false,
    image: "",
  };
}

function toDraft(
  offer: Offer,
): OfferDraft {
  return {
    title: offer.title,
    code: offer.code,
    description: offer.description,
    discountType: offer.discountType,
    discountValue: String(
      offer.discountValue,
    ),
    application: offer.application,
    productIds: [...offer.productIds],
    startDate: offer.startDate,
    endDate: offer.endDate,
    active: offer.active,
    featured: offer.featured,
    image: offer.image,
  };
}

function money(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-LK",
    {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

function offerDiscountLabel(
  offer: Offer,
): string {
  return offer.discountType === "percentage"
    ? `${offer.discountValue}% OFF`
    : `${money(offer.discountValue)} OFF`;
}

function createId(): string {
  return (
    `offer-${Date.now().toString(36)}-` +
    Math.random()
      .toString(36)
      .slice(2, 9)
  );
}

function statusLabel(
  status: OfferStatus,
): string {
  switch (status) {
    case "live":
      return "Live";
    case "scheduled":
      return "Scheduled";
    case "paused":
      return "Paused";
    case "expired":
      return "Expired";
  }
}

function getTargetProducts(
  offer: Offer,
  products: Product[],
): Product[] {
  return products.filter(
    (product) =>
      product.active &&
      product.stock > 0 &&
      isProductEligible(
        offer,
        product.id,
      ),
  );
}

/* ==========================================
   OFFER IMAGE
========================================== */

function OfferImage({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  return (
    <div className="mc-offer-image">
      {image ? (
        <img
          src={image}
          alt={title}
          loading="lazy"
        />
      ) : (
        <div className="mc-offer-image-empty">
          <Flower2
            size={43}
            strokeWidth={1.1}
          />

          <span>MUHURTHAM</span>

          <small>
            COLLECTION · SPECIAL OFFERS
          </small>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   OFFER PAGE
========================================== */

export default function OfferPage() {
  const offers = useOffers();
  const products = useProducts();

  const stats = useOfferStats();

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<OfferFilter>("all");

  const [sort, setSort] =
    useState<OfferSort>("newest");

  const [editorOpen, setEditorOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [draft, setDraft] =
    useState<OfferDraft>(newDraft);

  const [formError, setFormError] =
    useState("");

  const [pageError, setPageError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [
    processingImage,
    setProcessingImage,
  ] = useState(false);

  /* ======================================
     FILTER / SEARCH / SORT
  ====================================== */

  const displayed = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    return offers
      .filter((offer) => {
        const matchesSearch = [
          offer.title,
          offer.code,
          offer.description,
        ].some((value) =>
          value
            .toLowerCase()
            .includes(query),
        );

        const matchesStatus =
          filter === "all" ||
          getOfferStatus(offer) === filter;

        return (
          matchesSearch &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        switch (sort) {
          case "title":
            return a.title.localeCompare(
              b.title,
            );

          case "ending":
            return a.endDate.localeCompare(
              b.endDate,
            );

          case "oldest":
            return a.createdAt.localeCompare(
              b.createdAt,
            );

          default:
            return b.createdAt.localeCompare(
              a.createdAt,
            );
        }
      });
  }, [offers, search, filter, sort]);

  /* ======================================
     FORM UPDATE
  ====================================== */

  function updateDraft<
    K extends keyof OfferDraft
  >(
    key: K,
    value: OfferDraft[K],
  ) {
    setDraft((previous) => ({
      ...previous,
      [key]: value,
    }));

    setFormError("");
  }

  /* ======================================
     CREATE OFFER
  ====================================== */

  function openCreate() {
    setEditingId(null);
    setDraft(newDraft());
    setFormError("");
    setPageError("");
    setEditorOpen(true);
  }

  /* ======================================
     EDIT OFFER
  ====================================== */

  function openEdit(
    offer: Offer,
  ) {
    setEditingId(offer.id);
    setDraft(toDraft(offer));
    setFormError("");
    setPageError("");
    setEditorOpen(true);
  }

  /* ======================================
     CLOSE EDITOR
  ====================================== */

  function closeEditor() {
    if (processingImage) return;

    setEditorOpen(false);
    setFormError("");
  }

  /* ======================================
     SAVE TO SHARED SERVICE
  ====================================== */

  function commitOffers(
    next: Offer[],
    message: string,
  ): boolean {
    const error = saveOffers(next);

    if (error) {
      setPageError(error);
      setNotice("");
      return false;
    }

    setPageError("");
    setNotice(message);

    return true;
  }

  /* ======================================
     SELECT PRODUCT
  ====================================== */

  function toggleProductId(
    productId: string,
  ) {
    setDraft((previous) => {
      const selected =
        previous.productIds.includes(
          productId,
        );

      return {
        ...previous,
        productIds: selected
          ? previous.productIds.filter(
              (id) => id !== productId,
            )
          : [
              ...previous.productIds,
              productId,
            ],
      };
    });

    setFormError("");
  }

  /* ======================================
     UPLOAD OFFER IMAGE
  ====================================== */

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const input =
      event.currentTarget;

    const file =
      input.files?.[0];

    if (!file) return;

    setProcessingImage(true);
    setFormError("");

    try {
      const image =
        await prepareOfferImage(file);

      setDraft((previous) => ({
        ...previous,
        image,
      }));
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to upload image.",
      );
    } finally {
      setProcessingImage(false);
      input.value = "";
    }
  }

  /* ======================================
     SAVE OFFER FORM
  ====================================== */

  function handleSave(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const title =
      draft.title.trim();

    const code =
      draft.code.trim().toUpperCase();

    const discountValue =
      Number(draft.discountValue);

    if (!title) {
      setFormError(
        "Please enter an offer title.",
      );
      return;
    }

    if (
      code &&
      !/^[A-Z0-9_-]{3,24}$/.test(code)
    ) {
      setFormError(
        "Promo code must contain 3–24 letters, numbers, hyphens or underscores.",
      );
      return;
    }

    const duplicate = offers.some(
      (offer) =>
        Boolean(code) &&
        offer.code.toUpperCase() === code &&
        offer.id !== editingId,
    );

    if (duplicate) {
      setFormError(
        "This promotion code already exists.",
      );
      return;
    }

    if (
      !draft.discountValue.trim() ||
      !Number.isFinite(discountValue) ||
      discountValue <= 0
    ) {
      setFormError(
        "Please enter a valid discount greater than zero.",
      );
      return;
    }

    if (
      draft.discountType === "percentage" &&
      discountValue > 100
    ) {
      setFormError(
        "Percentage discount cannot exceed 100%.",
      );
      return;
    }

    if (discountValue > 1000000000) {
      setFormError(
        "Discount amount is too large.",
      );
      return;
    }

    if (
      !draft.startDate ||
      !draft.endDate ||
      draft.endDate < draft.startDate
    ) {
      setFormError(
        "The end date must be the same as or later than the start date.",
      );
      return;
    }

    if (
      draft.application === "selected" &&
      draft.productIds.length === 0
    ) {
      setFormError(
        "Select at least one product for this promotion.",
      );
      return;
    }

    const existing = editingId
      ? offers.find(
          (offer) =>
            offer.id === editingId,
        )
      : undefined;

    const offer: Offer = {
      id: editingId ?? createId(),
      title,
      code,
      description:
        draft.description.trim(),
      discountType:
        draft.discountType,
      discountValue,
      application:
        draft.application,
      productIds:
        draft.application === "all"
          ? []
          : [...draft.productIds],
      startDate:
        draft.startDate,
      endDate:
        draft.endDate,
      active:
        draft.active,
      featured:
        draft.featured,
      image:
        draft.image,
      createdAt:
        existing?.createdAt ??
        new Date().toISOString(),
    };

    const next = editingId
      ? offers.map((item) =>
          item.id === editingId
            ? offer
            : item,
        )
      : [offer, ...offers];

    const saved = commitOffers(
      next,
      editingId
        ? `"${title}" updated successfully.`
        : `"${title}" created successfully.`,
    );

    if (!saved) {
      setFormError(
        "The offer could not be saved. Check the storage warning.",
      );
      return;
    }

    setEditorOpen(false);
    setEditingId(null);
  }

  /* ======================================
     DELETE OFFER
  ====================================== */

  function deleteOffer(
    offer: Offer,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${offer.title}"?\n\nThis action cannot be undone.`,
      );

    if (!confirmed) return;

    commitOffers(
      offers.filter(
        (item) =>
          item.id !== offer.id,
      ),
      `"${offer.title}" deleted.`,
    );
  }

  /* ======================================
     PAUSE / ENABLE OFFER
  ====================================== */

  function toggleOffer(
    offer: Offer,
  ) {
    const next =
      offers.map((item) =>
        item.id === offer.id
          ? {
              ...item,
              active: !item.active,
            }
          : item,
      );

    commitOffers(
      next,
      offer.active
        ? `"${offer.title}" paused.`
        : `"${offer.title}" enabled. Campaign dates still apply.`,
    );
  }

  /* ======================================
     EXPORT CSV
  ====================================== */

  function exportOffers() {
    const rows = [
      [
        "Title",
        "Code",
        "Discount Type",
        "Discount Value",
        "Application",
        "Product IDs",
        "Start Date",
        "End Date",
        "Status",
        "Featured",
      ],
      ...offers.map((offer) => [
        offer.title,
        offer.code,
        offer.discountType,
        String(offer.discountValue),
        offer.application,
        offer.productIds.join(";"),
        offer.startDate,
        offer.endDate,
        getOfferStatus(offer),
        offer.featured
          ? "Yes"
          : "No",
      ]),
    ];

    const csv = rows.map(
      (row) =>
        row
          .map((value) => {
            let cell =
              String(value);

            // Prevent CSV formula execution.
            if (
              /^[\s]*[=+\-@]/.test(cell)
            ) {
              cell = `'${cell}`;
            }

            return `"${cell.replace(
              /"/g,
              '""',
            )}"`;
          })
          .join(","),
    ).join("\r\n");

    const blob = new Blob(
      ["\uFEFF", csv],
      {
        type: "text/csv;charset=utf-8",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download =
      "muhurtham-offers.csv";

    document.body.appendChild(
      anchor,
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  /* ======================================
     RENDER
  ====================================== */

  return (
    <div className="mc-offers-page">
      {/* ================================
          HEADER
      ================================= */}

      <section className="mc-offers-header">
        <div>
          <span className="mc-offers-eyebrow">
            <Flower2 size={15} />
            MUHURTHAM COLLECTION · ADMIN
          </span>

          <h1>Discounts & Offers</h1>

          <p>
            Create beautiful promotions and
            memorable shopping experiences.
          </p>
        </div>

        <div className="mc-offers-header-actions">
          <button
            type="button"
            className="mc-offers-export"
            onClick={exportOffers}
          >
            <ArrowDownToLine size={18} />
            Export
          </button>

          <button
            type="button"
            className="mc-offers-add"
            onClick={openCreate}
          >
            <Plus size={19} />
            Create new offer
          </button>
        </div>
      </section>

      {/* ================================
          MESSAGES
      ================================= */}

      {notice && (
        <div
          className="mc-offers-notice"
          role="status"
        >
          <Check size={18} />

          <span>{notice}</span>

          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() =>
              setNotice("")
            }
          >
            <X size={17} />
          </button>
        </div>
      )}

      {pageError && (
        <div
          className="mc-offers-error"
          role="alert"
        >
          <CircleAlert size={19} />
          {pageError}
        </div>
      )}

      {/* ================================
          STATISTICS
      ================================= */}

      <section
        className="mc-offers-stats"
        aria-label="Offer statistics"
      >
        {[
          {
            name: "Total offers",
            value: stats.total,
            detail: "All campaigns",
            icon: Gift,
          },
          {
            name: "Live offers",
            value: stats.live,
            detail: "Currently running",
            icon: CheckCircle2,
          },
          {
            name: "Scheduled",
            value: stats.scheduled,
            detail: "Upcoming promotions",
            icon: Clock3,
          },
          {
            name: "Paused offers",
            value: stats.paused,
            detail: "Manually disabled",
            icon: PauseCircle,
          },
        ].map(
          ({
            name,
            value,
            detail,
            icon: Icon,
          }) => (
            <div
              className="mc-offers-stat"
              key={name}
            >
              <span className="mc-offers-stat-icon">
                <Icon
                  size={23}
                  strokeWidth={1.7}
                />
              </span>

              <span>{name}</span>

              <strong>{value}</strong>

              <small>{detail}</small>
            </div>
          ),
        )}
      </section>

      {/* ================================
          COLLECTION PANEL
      ================================= */}

      <section className="mc-offers-panel">
        <div className="mc-offers-panel-heading">
          <div className="mc-offers-panel-heading-main">
            <span className="mc-offers-panel-icon">
              <Tag size={24} />
            </span>

            <div>
              <h2>
                Your promotions
                <Flower2 size={16} />
              </h2>

              <p>
                Manage discounts, campaigns
                and promotional collections.
              </p>
            </div>
          </div>

          <span className="mc-offers-count">
            {displayed.length} offers
          </span>
        </div>

        {/* ============================
            SEARCH AND FILTERS
        ============================ */}

        <div className="mc-offers-toolbar">
          <label className="mc-offers-search">
            <Search size={18} />

            <input
              type="search"
              aria-label="Search offers"
              placeholder="Search offers or promo codes..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </label>

          <div className="mc-offers-select">
            <select
              aria-label="Filter offer status"
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target
                    .value as OfferFilter,
                )
              }
            >
              <option value="all">
                All statuses
              </option>

              <option value="live">
                Live
              </option>

              <option value="scheduled">
                Scheduled
              </option>

              <option value="paused">
                Paused
              </option>

              <option value="expired">
                Expired
              </option>
            </select>

            <ChevronDown size={16} />
          </div>

          <div className="mc-offers-select">
            <select
              aria-label="Sort offers"
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target
                    .value as OfferSort,
                )
              }
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>

              <option value="ending">
                Ending soonest
              </option>

              <option value="title">
                Name A–Z
              </option>
            </select>

            <ChevronDown size={16} />
          </div>
        </div>

        {/* ============================
            OFFER CARDS
        ============================ */}

        {displayed.length > 0 && (
          <div className="mc-offers-grid">
            {displayed.map((offer) => {
              const status =
                getOfferStatus(offer);

              const targets =
                getTargetProducts(
                  offer,
                  products,
                );

              const previewProduct =
                targets[0];

              const saving =
                previewProduct
                  ? calculateDiscount(
                      previewProduct.price,
                      offer,
                    )
                  : null;

              return (
                <article
                  key={offer.id}
                  className="mc-offer-card"
                >
                  <div className="mc-offer-card-cover">
                    <OfferImage
                      image={offer.image}
                      title={offer.title}
                    />

                    <span className="mc-offer-card-discount">
                      {offerDiscountLabel(
                        offer,
                      )}
                    </span>

                    {offer.featured && (
                      <span className="mc-offer-card-featured">
                        <Sparkles size={13} />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="mc-offer-card-body">
                    <div className="mc-offer-card-topline">
                      <span
                        className={`mc-offer-status ${status}`}
                      >
                        <i />
                        {statusLabel(status)}
                      </span>

                      {offer.code && (
                        <span className="mc-offer-code">
                          {offer.code}
                        </span>
                      )}
                    </div>

                    <h3>{offer.title}</h3>

                    <p className="mc-offer-description">
                      {offer.description ||
                        "A special promotion from Muhurtham Collection."}
                    </p>

                    <div className="mc-offer-card-details">
                      <div>
                        <CalendarDays size={17} />

                        <span>
                          {formatOfferDate(
                            offer.startDate,
                          )}
                          {" — "}
                          {formatOfferDate(
                            offer.endDate,
                          )}
                        </span>
                      </div>

                      <div>
                        <Package size={17} />

                        <span>
                          {offer.application === "all"
                            ? "All products"
                            : `${offer.productIds.length} selected products`}
                        </span>
                      </div>
                    </div>

                    {previewProduct &&
                      saving !== null && (
                        <div className="mc-offer-saving-preview">
                          <span>
                            Example saving on{" "}
                            {previewProduct.name}
                          </span>

                          <strong>
                            {money(saving)}
                          </strong>
                        </div>
                      )}

                    <div className="mc-offer-card-actions">
                      <button
                        type="button"
                        className="mc-offer-edit"
                        onClick={() =>
                          openEdit(offer)
                        }
                      >
                        <Pencil size={15} />
                        Edit offer
                      </button>

                      <button
                        type="button"
                        className="mc-offer-icon-action"
                        title={
                          offer.active
                            ? "Pause offer"
                            : "Enable offer"
                        }
                        aria-label={
                          offer.active
                            ? `Pause ${offer.title}`
                            : `Enable ${offer.title}`
                        }
                        onClick={() =>
                          toggleOffer(offer)
                        }
                      >
                        {offer.active ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>

                      <button
                        type="button"
                        className="mc-offer-icon-action delete"
                        title="Delete offer"
                        aria-label={`Delete ${offer.title}`}
                        onClick={() =>
                          deleteOffer(offer)
                        }
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ============================
            EMPTY STATE
        ============================ */}

        {displayed.length === 0 && (
          <div className="mc-offers-empty">
            <span>
              <Gift size={37} />
            </span>

            <h3>
              {offers.length === 0
                ? "Create your first offer"
                : "No matching offers"}
            </h3>

            <p>
              {offers.length === 0
                ? "Create a special promotion for your Muhurtham Collection products."
                : "Try changing your search or status filter."}
            </p>

            <button
              type="button"
              onClick={() => {
                if (offers.length === 0) {
                  openCreate();
                } else {
                  setSearch("");
                  setFilter("all");
                }
              }}
            >
              {offers.length === 0
                ? "Create an offer"
                : "Clear filters"}

              <ArrowUpRight size={17} />
            </button>
          </div>
        )}
      </section>

      <p className="mc-offers-footnote">
        Development mode: campaign data and
        promotional images are stored in this
        browser. Scheduled discounts are not
        yet applied to customer website prices.
      </p>

      {/* ================================
          OFFER EDITOR
      ================================= */}

      {editorOpen && (
        <div
          className="mc-offer-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeEditor();
            }
          }}
        >
          <section
            className="mc-offer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mc-offer-modal-title"
          >
            {/* MODAL HEADER */}

            <div className="mc-offer-modal-header">
              <div>
                <span className="mc-offers-eyebrow">
                  PROMOTION MANAGEMENT
                </span>

                <h2 id="mc-offer-modal-title">
                  {editingId
                    ? "Edit promotion"
                    : "Create new promotion"}
                </h2>
              </div>

              <button
                type="button"
                className="mc-offer-modal-close"
                aria-label="Close promotion form"
                onClick={closeEditor}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="mc-offer-modal-body">
                {/* ========================
                    IMAGE SECTION
                ======================== */}

                <div className="mc-offer-form-media">
                  <label className="mc-offer-field-label">
                    Promotional image
                  </label>

                  <div className="mc-offer-upload-preview">
                    {draft.image ? (
                      <img
                        src={draft.image}
                        alt="Promotion preview"
                      />
                    ) : (
                      <div>
                        <ImagePlus size={36} />

                        <span>
                          Promotional banner
                        </span>

                        <small>
                          Add a beautiful image
                        </small>
                      </div>
                    )}
                  </div>

                  <label className="mc-offer-upload-button">
                    <Upload size={17} />

                    {processingImage
                      ? "Processing image..."
                      : "Browse image"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={processingImage}
                      onChange={handleImageUpload}
                    />
                  </label>

                  {draft.image && (
                    <button
                      type="button"
                      className="mc-offer-remove-image"
                      onClick={() =>
                        updateDraft(
                          "image",
                          "",
                        )
                      }
                    >
                      Remove image
                    </button>
                  )}

                  <p className="mc-offer-upload-hint">
                    JPG, PNG or WebP. Maximum
                    source size 5 MB.
                  </p>

                  <div className="mc-offer-media-tip">
                    <Sparkles size={18} />

                    <p>
                      Use a wide, high-quality
                      promotional image that
                      complements your bridal
                      collections.
                    </p>
                  </div>
                </div>

                {/* ========================
                    FORM FIELDS
                ======================== */}

                <div className="mc-offer-form-fields">
                  {/* TITLE */}

                  <div className="mc-offer-field">
                    <label htmlFor="offer-title">
                      Offer title *
                    </label>

                    <input
                      id="offer-title"
                      type="text"
                      required
                      maxLength={100}
                      value={draft.title}
                      placeholder="e.g. Wedding Season Special"
                      onChange={(event) =>
                        updateDraft(
                          "title",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  {/* CODE */}

                  <div className="mc-offer-field">
                    <label htmlFor="offer-code">
                      Promotion code (optional)
                    </label>

                    <input
                      id="offer-code"
                      type="text"
                      maxLength={24}
                      value={draft.code}
                      placeholder="e.g. WEDDING20"
                      onChange={(event) =>
                        updateDraft(
                          "code",
                          event.target.value.toUpperCase(),
                        )
                      }
                    />

                    <small>
                      For reference until promo-code
                      redemption is implemented.
                    </small>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="mc-offer-field">
                    <label htmlFor="offer-description">
                      Description
                    </label>

                    <textarea
                      id="offer-description"
                      rows={3}
                      maxLength={800}
                      value={draft.description}
                      placeholder="Describe your special promotion..."
                      onChange={(event) =>
                        updateDraft(
                          "description",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  {/* DISCOUNT */}

                  <div className="mc-offer-form-row">
                    <div className="mc-offer-field">
                      <label htmlFor="offer-type">
                        Discount type *
                      </label>

                      <select
                        id="offer-type"
                        value={
                          draft.discountType
                        }
                        onChange={(event) =>
                          updateDraft(
                            "discountType",
                            event.target
                              .value as DiscountType,
                          )
                        }
                      >
                        <option value="percentage">
                          Percentage (%)
                        </option>

                        <option value="fixed">
                          Fixed amount (LKR)
                        </option>
                      </select>
                    </div>

                    <div className="mc-offer-field">
                      <label htmlFor="offer-value">
                        {draft.discountType ===
                        "percentage"
                          ? "Discount (%) *"
                          : "Discount (LKR) *"}
                      </label>

                      <input
                        id="offer-value"
                        type="number"
                        min="0.01"
                        max={
                          draft.discountType ===
                          "percentage"
                            ? 100
                            : 1000000000
                        }
                        step="0.01"
                        required
                        value={
                          draft.discountValue
                        }
                        placeholder={
                          draft.discountType ===
                          "percentage"
                            ? "e.g. 20"
                            : "e.g. 5000"
                        }
                        onChange={(event) =>
                          updateDraft(
                            "discountValue",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* CAMPAIGN DATES */}

                  <div className="mc-offer-form-row">
                    <div className="mc-offer-field">
                      <label htmlFor="offer-start">
                        Start date *
                      </label>

                      <input
                        id="offer-start"
                        type="date"
                        required
                        value={draft.startDate}
                        onChange={(event) =>
                          updateDraft(
                            "startDate",
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="mc-offer-field">
                      <label htmlFor="offer-end">
                        End date *
                      </label>

                      <input
                        id="offer-end"
                        type="date"
                        required
                        min={draft.startDate}
                        value={draft.endDate}
                        onChange={(event) =>
                          updateDraft(
                            "endDate",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* APPLICATION */}

                  <div className="mc-offer-field">
                    <label htmlFor="offer-application">
                      Apply promotion to *
                    </label>

                    <select
                      id="offer-application"
                      value={draft.application}
                      onChange={(event) =>
                        updateDraft(
                          "application",
                          event.target
                            .value as OfferApplication,
                        )
                      }
                    >
                      <option value="all">
                        All products
                      </option>

                      <option value="selected">
                        Selected products only
                      </option>
                    </select>
                  </div>

                  {/* PRODUCT SELECTION */}

                  {draft.application ===
                    "selected" && (
                    <div className="mc-offer-product-picker">
                      <div className="mc-offer-product-picker-heading">
                        <strong>
                          Select products
                        </strong>

                        <span>
                          {
                            draft.productIds
                              .length
                          }{" "}
                          selected
                        </span>
                      </div>

                      {products.length === 0 ? (
                        <p>
                          Add products in the
                          Products section first.
                        </p>
                      ) : (
                        <div className="mc-offer-product-options">
                          {products.map(
                            (product) => (
                              <label
                                key={product.id}
                                className="mc-offer-product-option"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    draft.productIds.includes(
                                      product.id,
                                    )
                                  }
                                  onChange={() =>
                                    toggleProductId(
                                      product.id,
                                    )
                                  }
                                />

                                <span className="mc-offer-product-option-name">
                                  <strong>
                                    {product.name}
                                  </strong>

                                  <small>
                                    {product.sku}
                                    {" · "}
                                    {money(
                                      product.price,
                                    )}
                                  </small>
                                </span>

                                {draft.productIds.includes(
                                  product.id,
                                ) && (
                                  <Check size={17} />
                                )}
                              </label>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STATUS OPTIONS */}

                  <div className="mc-offer-form-options">
                    <label>
                      <input
                        type="checkbox"
                        checked={draft.active}
                        onChange={(event) =>
                          updateDraft(
                            "active",
                            event.target.checked,
                          )
                        }
                      />

                      <span>
                        Enable promotion

                        <small>
                          Runs automatically
                          during campaign dates.
                        </small>
                      </span>
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={draft.featured}
                        onChange={(event) =>
                          updateDraft(
                            "featured",
                            event.target.checked,
                          )
                        }
                      />

                      <span>
                        Featured promotion

                        <small>
                          Highlight this campaign.
                        </small>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* FORM ERRORS */}

              {formError && (
                <div
                  className="mc-offer-form-error"
                  role="alert"
                >
                  <CircleAlert size={18} />
                  {formError}
                </div>
              )}

              {/* FORM FOOTER */}

              <div className="mc-offer-modal-footer">
                <button
                  type="button"
                  className="mc-offer-cancel"
                  onClick={closeEditor}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="mc-offer-save"
                  disabled={processingImage}
                >
                  <Check size={18} />

                  {editingId
                    ? "Save changes"
                    : "Create promotion"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
