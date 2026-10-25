
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  ArrowDownToLine,
  BadgeCheck,
  Box,
  Check,
  ChevronDown,
  CircleAlert,
  Eye,
  EyeOff,
  Flower2,
  Grid2X2,
  ImagePlus,
  LayoutList,
  Package,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  readProducts,
  saveProducts,
} from "../services/productService";

import type { Product } from "../services/productService";

import "./products.css";

/* ==========================================
   TYPES
========================================== */

type ProductDraft = {
  sku: string;
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  image: string;
  active: boolean;
  featured: boolean;
};

type StockFilter =
  | "all"
  | "available"
  | "out"
  | "hidden";

type SortOption =
  | "newest"
  | "name"
  | "price-low"
  | "price-high"
  | "stock";

type ViewMode = "grid" | "list";

/* ==========================================
   CATEGORIES
========================================== */

const CATEGORIES = [
  "Bridal Wear",
  "Lehengas",
  "Sarees",
  "Sherwanis",
  "Menswear",
  "Occasion Wear",
  "Accessories",
];

/* ==========================================
   HELPERS
========================================== */

function createEmptyDraft(): ProductDraft {
  return {
    sku: "",
    name: "",
    category: "Bridal Wear",
    description: "",
    price: "",
    stock: "1",
    image: "",
    active: true,
    featured: false,
  };
}

function productToDraft(
  product: Product,
): ProductDraft {
  return {
    sku: product.sku,
    name: product.name,
    category: product.category,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    image: product.image,
    active: product.active,
    featured: product.featured,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function createProductId(): string {
  return (
    `mc-${Date.now().toString(36)}-` +
    Math.random().toString(36).slice(2, 8)
  );
}

/* ==========================================
   IMAGE PROCESSING
========================================== */

async function prepareImage(file: File): Promise<string> {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowed.includes(file.type)) {
    throw new Error(
      "Only JPG, PNG and WebP images are supported.",
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(
      "Please select an image smaller than 5 MB.",
    );
  }

  const url = URL.createObjectURL(file);

  try {
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error("Unable to read image."));
      image.src = url;
    });

    const ratio = Math.min(
      800 / image.width,
      800 / image.height,
      1,
    );

    const canvas = document.createElement("canvas");

    canvas.width = Math.max(
      1,
      Math.round(image.width * ratio),
    );

    canvas.height = Math.max(
      1,
      Math.round(image.height * ratio),
    );

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Image processing unavailable.");
    }

    context.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const result = canvas.toDataURL("image/webp", 0.72);

    if (result.length > 850000) {
      throw new Error(
        "Optimized image is too large for browser storage.",
      );
    }

    return result;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ==========================================
   PRODUCT STATUS
========================================== */

function getProductStatus(product: Product) {
  if (!product.active) {
    return { label: "Hidden", className: "hidden" };
  }

  if (product.stock <= 0) {
    return { label: "Out of stock", className: "out" };
  }

  return { label: "Available", className: "available" };
}

/* ==========================================
   IMAGE COMPONENT
========================================== */

function ProductImage({
  image,
  name,
}: {
  image: string;
  name: string;
}) {
  return (
    <div className="mc-product-image">
      {image ? (
        <img src={image} alt={name} loading="lazy" />
      ) : (
        <div className="mc-product-image-placeholder">
          <Flower2 size={36} strokeWidth={1.1} />
          <span>
            MUHURTHAM
            <small>COLLECTION</small>
          </span>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   MAIN PRODUCTS PAGE
   ONLY COMPONENT EXPORT
========================================== */

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>(readProducts);

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All categories");

  const [statusFilter, setStatusFilter] =
    useState<StockFilter>("all");

  const [sort, setSort] =
    useState<SortOption>("newest");

  const [view, setView] =
    useState<ViewMode>("grid");

  const [editorOpen, setEditorOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [draft, setDraft] =
    useState<ProductDraft>(createEmptyDraft);

  const [formError, setFormError] =
    useState("");

  const [storageError, setStorageError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [processingImage, setProcessingImage] =
    useState(false);

  /* ========================================
     SAVE CHANGES

     This replaces the old persistence effect.
     State updates happen in event handlers.
  ======================================== */

  function commitProducts(
    nextProducts: Product[],
    message: string,
  ): boolean {
    const error = saveProducts(nextProducts);

    if (error) {
      setStorageError(error);
      setNotice("");
      return false;
    }

    setProducts(nextProducts);
    setStorageError("");
    setNotice(message);

    return true;
  }

  /* ========================================
     CLOSE MODAL WITH ESCAPE
  ======================================== */

  useEffect(() => {
    if (!editorOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setEditorOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
  }, [editorOpen]);

  /* ========================================
     SYNC EXTERNAL & MULTI-TAB UPDATES
  ======================================== */

  useEffect(() => {
    function handleSync() {
      if (!editorOpen) {
        setProducts(readProducts());
      }
    }

    window.addEventListener("muhurtham-products-updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(
        "muhurtham-products-updated",
        handleSync,
      );
      window.removeEventListener("storage", handleSync);
    };
  }, [editorOpen]);

  /* ========================================
     PRODUCT STATS
  ======================================== */

  const stats = useMemo(() => {
    return {
      total: products.length,

      available: products.filter(
        (item) => item.active && item.stock > 0,
      ).length,

      outOfStock: products.filter(
        (item) => item.stock === 0,
      ).length,

      catalogueValue: products.reduce(
        (total, item) =>
          total + item.price * item.stock,
        0,
      ),
    };
  }, [products]);

  /* ========================================
     FILTER AND SORT
  ======================================== */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch = [
        product.name,
        product.sku,
        product.category,
        product.description,
      ].some((value) =>
        value.toLowerCase().includes(query),
      );

      const matchesCategory =
        category === "All categories" ||
        product.category === category;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" &&
          product.active &&
          product.stock > 0) ||
        (statusFilter === "out" &&
          product.stock === 0) ||
        (statusFilter === "hidden" &&
          !product.active);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });

    return result.sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "stock":
          return a.stock - b.stock;
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });
  }, [
    products,
    search,
    category,
    statusFilter,
    sort,
  ]);

  /* ========================================
     UPDATE FORM
  ======================================== */

  function updateDraft<K extends keyof ProductDraft>(
    key: K,
    value: ProductDraft[K],
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setFormError("");
  }

  /* ========================================
     ADD PRODUCT
  ======================================== */

  function openAddProduct() {
    setEditingId(null);
    setDraft(createEmptyDraft());
    setFormError("");
    setNotice("");
    setEditorOpen(true);
  }

  /* ========================================
     EDIT PRODUCT
  ======================================== */

  function openEditProduct(product: Product) {
    setEditingId(product.id);
    setDraft(productToDraft(product));
    setFormError("");
    setNotice("");
    setEditorOpen(true);
  }

  /* ========================================
     IMAGE UPLOAD
  ======================================== */

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    setProcessingImage(true);
    setFormError("");

    try {
      const image = await prepareImage(file);

      setDraft((current) => ({
        ...current,
        image,
      }));
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Image upload failed.",
      );
    } finally {
      setProcessingImage(false);
      input.value = "";
    }
  }

  /* ========================================
     ADD / EDIT SAVE
  ======================================== */

  function handleSaveProduct(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = draft.name.trim();
    const sku = draft.sku.trim().toUpperCase();
    const price = Number(draft.price);
    const stock = Number(draft.stock);

    if (!name || !sku) {
      setFormError("Product name and SKU are required.");
      return;
    }

    if (
      draft.price.trim() === "" ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setFormError(
        "Enter a valid price greater than zero.",
      );
      return;
    }

    if (
      draft.stock.trim() === "" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setFormError(
        "Stock must be a whole number of zero or more.",
      );
      return;
    }

    const duplicate = products.some(
      (item) =>
        item.sku.toUpperCase() === sku &&
        item.id !== editingId,
    );

    if (duplicate) {
      setFormError("This SKU is already in use.");
      return;
    }

    const previous = editingId
      ? products.find(
          (item) => item.id === editingId,
        )
      : undefined;

    const product: Product = {
      id: editingId ?? createProductId(),
      sku,
      name,
      category: draft.category,
      description: draft.description.trim(),
      price,
      stock,
      image: draft.image,
      active: draft.active,
      featured: draft.featured,
      createdAt:
        previous?.createdAt ??
        new Date().toISOString(),
    };

    const nextProducts = editingId
      ? products.map((item) =>
          item.id === editingId ? product : item,
        )
      : [product, ...products];

    const saved = commitProducts(
      nextProducts,
      editingId
        ? `"${name}" updated successfully.`
        : `"${name}" added successfully.`,
    );

    if (!saved) return;

    setEditingId(null);
    setEditorOpen(false);
  }

  /* ========================================
     DELETE PRODUCT
  ======================================== */

  function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    commitProducts(
      products.filter(
        (item) => item.id !== product.id,
      ),
      `"${product.name}" deleted successfully.`,
    );
  }

  /* ========================================
     PUBLISH / HIDE
  ======================================== */

  function toggleProduct(product: Product) {
    const nextProducts = products.map((item) =>
      item.id === product.id
        ? { ...item, active: !item.active }
        : item,
    );

    commitProducts(
      nextProducts,
      product.active
        ? `"${product.name}" is now hidden.`
        : `"${product.name}" is now published.`,
    );
  }

  /* ========================================
     CSV EXPORT
  ======================================== */

  function exportProducts() {
    const rows = [
      [
        "SKU",
        "Product",
        "Category",
        "Price LKR",
        "Stock",
        "Active",
        "Featured",
        "Description",
      ],
      ...products.map((product) => [
        product.sku,
        product.name,
        product.category,
        String(product.price),
        String(product.stock),
        product.active ? "Yes" : "No",
        product.featured ? "Yes" : "No",
        product.description,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${String(cell).replace(/"/g, '""')}"`,
          )
          .join(","),
      )
      .join("\r\n");

    const blob = new Blob(
      ["\uFEFF", csv],
      { type: "text/csv;charset=utf-8;" },
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "muhurtham-products.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="mc-products-page">
      {/* PAGE HEADER */}

      <section className="mc-products-header">
        <div className="mc-products-header-copy">
          <div className="mc-products-eyebrow">
            <Flower2 size={15} />
            MUHURTHAM COLLECTION · ADMIN
          </div>

          <h1>Product management</h1>

          <p>
            Curate, organize and manage your
            beautiful collections in one place.
          </p>
        </div>

        <div className="mc-products-header-actions">
          <button
            type="button"
            className="mc-products-export"
            onClick={exportProducts}
          >
            <ArrowDownToLine size={18} />
            Export
          </button>

          <button
            type="button"
            className="mc-products-add"
            onClick={openAddProduct}
          >
            <Plus size={19} />
            Add new product
          </button>
        </div>
      </section>

      {/* NOTIFICATIONS */}

      {notice && (
        <div
          className="mc-products-notice"
          role="status"
        >
          <Check size={18} />
          <span>{notice}</span>

          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {storageError && (
        <div className="mc-products-error" role="alert">
          <CircleAlert size={19} />
          {storageError}
        </div>
      )}

      {/* STATISTICS */}

      <section className="mc-products-stats">
        <div className="mc-products-stat">
          <span className="mc-products-stat-icon">
            <Package size={23} />
          </span>
          <span>Total products</span>
          <strong>{stats.total}</strong>
          <small>Your collection catalogue</small>
        </div>

        <div className="mc-products-stat">
          <span className="mc-products-stat-icon">
            <BadgeCheck size={23} />
          </span>
          <span>Available products</span>
          <strong>{stats.available}</strong>
          <small>Published and in stock</small>
        </div>

        <div className="mc-products-stat">
          <span className="mc-products-stat-icon">
            <CircleAlert size={23} />
          </span>
          <span>Out of stock</span>
          <strong>{stats.outOfStock}</strong>
          <small>Products requiring stock</small>
        </div>

        <div className="mc-products-stat">
          <span className="mc-products-stat-icon">
            <Sparkles size={23} />
          </span>
          <span>Inventory value</span>
          <strong className="mc-products-value">
            {formatCurrency(stats.catalogueValue)}
          </strong>
          <small>Price × stock quantity</small>
        </div>
      </section>

      {/* COLLECTION PANEL */}

      <section className="mc-products-panel">
        <div className="mc-products-section-heading">
          <div className="mc-products-section-title">
            <span className="mc-products-section-icon">
              <Box size={25} />
            </span>

            <div>
              <h2>
                Your collections
                <Flower2 size={16} />
              </h2>
              <p>
                Manage products, prices,
                images and availability.
              </p>
            </div>
          </div>

          <span className="mc-products-count">
            {filteredProducts.length} products
          </span>
        </div>

        {/* SEARCH AND FILTERS */}

        <div className="mc-products-toolbar">
          <label className="mc-products-search">
            <Search size={19} />
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products or SKU..."
              aria-label="Search products"
            />
          </label>

          <div className="mc-products-select">
            <SlidersHorizontal size={17} />
            <select
              value={category}
              aria-label="Filter by category"
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              <option value="All categories">
                All categories
              </option>
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <ChevronDown size={15} />
          </div>

          <div className="mc-products-select">
            <select
              value={statusFilter}
              aria-label="Filter by status"
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StockFilter,
                )
              }
            >
              <option value="all">All statuses</option>
              <option value="available">Available</option>
              <option value="out">Out of stock</option>
              <option value="hidden">Hidden</option>
            </select>
            <ChevronDown size={15} />
          </div>

          <div className="mc-products-select">
            <select
              value={sort}
              aria-label="Sort products"
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
            >
              <option value="newest">Newest first</option>
              <option value="name">Name A–Z</option>
              <option value="price-low">
                Price: Low to high
              </option>
              <option value="price-high">
                Price: High to low
              </option>
              <option value="stock">Lowest stock</option>
            </select>
            <ChevronDown size={15} />
          </div>

          <div className="mc-products-view-switch">
            <button
              type="button"
              title="Grid view"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
            >
              <Grid2X2 size={19} />
            </button>

            <button
              type="button"
              title="List view"
              aria-label="List view"
              aria-pressed={view === "list"}
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              <LayoutList size={19} />
            </button>
          </div>
        </div>

        {/* GRID VIEW */}

        {view === "grid" &&
          filteredProducts.length > 0 && (
            <div className="mc-products-grid">
              {filteredProducts.map((product) => {
                const status =
                  getProductStatus(product);

                return (
                  <article
                    className="mc-product-card"
                    key={product.id}
                  >
                    <div className="mc-product-card-image">
                      <ProductImage
                        image={product.image}
                        name={product.name}
                      />

                      {product.featured && (
                        <span className="mc-product-featured">
                          <Sparkles size={13} />
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="mc-product-card-body">
                      <span className="mc-product-category">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      <p className="mc-product-sku">
                        {product.sku}
                      </p>

                      <div className="mc-product-price">
                        {formatCurrency(product.price)}
                      </div>

                      <div className="mc-product-card-meta">
                        <span
                          className={`mc-product-status ${status.className}`}
                        >
                          <i />
                          {status.label}
                        </span>

                        <span>
                          Stock: {product.stock}
                        </span>
                      </div>

                      <div className="mc-product-card-actions">
                        <button
                          type="button"
                          className="mc-product-edit"
                          onClick={() =>
                            openEditProduct(product)
                          }
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="mc-product-icon-action"
                          title={
                            product.active
                              ? "Hide product"
                              : "Publish product"
                          }
                          aria-label={
                            product.active
                              ? `Hide ${product.name}`
                              : `Publish ${product.name}`
                          }
                          onClick={() =>
                            toggleProduct(product)
                          }
                        >
                          {product.active ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                        <button
                          type="button"
                          className="mc-product-icon-action delete"
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          onClick={() =>
                            deleteProduct(product)
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

        {/* LIST VIEW */}

        {view === "list" &&
          filteredProducts.length > 0 && (
            <div className="mc-products-table-wrapper">
              <table className="mc-products-table">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const status =
                      getProductStatus(product);

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="mc-product-table-info">
                            <div className="mc-product-table-image">
                              <ProductImage
                                image={product.image}
                                name={product.name}
                              />
                            </div>

                            <span>
                              <strong>
                                {product.name}
                              </strong>
                              <small>
                                {product.sku}
                              </small>
                            </span>
                          </div>
                        </td>

                        <td>{product.category}</td>

                        <td className="mc-product-table-price">
                          {formatCurrency(product.price)}
                        </td>

                        <td>{product.stock}</td>

                        <td>
                          <span
                            className={`mc-product-status ${status.className}`}
                          >
                            <i />
                            {status.label}
                          </span>
                        </td>

                        <td>
                          <div className="mc-product-table-actions">
                            <button
                              type="button"
                              title="Edit product"
                              aria-label={`Edit ${product.name}`}
                              onClick={() =>
                                openEditProduct(product)
                              }
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              title={
                                product.active
                                  ? "Hide product"
                                  : "Publish product"
                              }
                              aria-label={
                                product.active
                                  ? `Hide ${product.name}`
                                  : `Publish ${product.name}`
                              }
                              onClick={() =>
                                toggleProduct(product)
                              }
                            >
                              {product.active ? (
                                <EyeOff size={17} />
                              ) : (
                                <Eye size={17} />
                              )}
                            </button>

                            <button
                              type="button"
                              className="delete"
                              title="Delete product"
                              aria-label={`Delete ${product.name}`}
                              onClick={() =>
                                deleteProduct(product)
                              }
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        {/* EMPTY RESULTS */}

        {filteredProducts.length === 0 && (
          <div className="mc-products-empty">
            <span>
              <Package size={33} />
            </span>

            <h3>No products found</h3>

            <p>
              No products match your current
              search or filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All categories");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <p className="mc-products-footnote">
        Product data is saved in this browser
        for development and preview.
      </p>

      {/* ADD / EDIT MODAL */}

      {editorOpen && (
        <div
          className="mc-product-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditorOpen(false);
            }
          }}
        >
          <section
            className="mc-product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mc-product-modal-title"
          >
            <div className="mc-product-modal-header">
              <div>
                <span className="mc-products-eyebrow">
                  COLLECTION MANAGEMENT
                </span>

                <h2 id="mc-product-modal-title">
                  {editingId
                    ? "Edit product"
                    : "Add new product"}
                </h2>
              </div>

              <button
                type="button"
                className="mc-product-modal-close"
                aria-label="Close product form"
                onClick={() => setEditorOpen(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="mc-product-modal-body">
                {/* IMAGE UPLOAD */}

                <div className="mc-product-form-image-section">
                  <label className="mc-product-form-label">
                    Product image
                  </label>

                  <div className="mc-product-form-image-preview">
                    {draft.image ? (
                      <img
                        src={draft.image}
                        alt="Product preview"
                      />
                    ) : (
                      <>
                        <ImagePlus size={32} />
                        <span>
                          No image selected
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mc-product-image-options">
                    <label className="mc-product-upload-button">
                      <Upload size={16} />
                      {processingImage
                        ? "Processing..."
                        : "Upload image"}

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
                        className="mc-product-remove-image"
                        onClick={() =>
                          updateDraft("image", "")
                        }
                      >
                        Remove image
                      </button>
                    )}
                  </div>

                  <p className="mc-product-upload-note">
                    JPG, PNG or WebP. Maximum
                    original file size: 5 MB.
                  </p>
                </div>

                {/* PRODUCT FORM */}

                <div className="mc-product-form-fields">
                  <div className="mc-product-form-field">
                    <label htmlFor="product-name">
                      Product name *
                    </label>

                    <input
                      id="product-name"
                      type="text"
                      required
                      maxLength={100}
                      value={draft.name}
                      placeholder="e.g. Royal Bridal Lehenga"
                      onChange={(event) =>
                        updateDraft(
                          "name",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="mc-product-form-row">
                    <div className="mc-product-form-field">
                      <label htmlFor="product-sku">
                        Product code / SKU *
                      </label>

                      <input
                        id="product-sku"
                        type="text"
                        required
                        maxLength={40}
                        value={draft.sku}
                        placeholder="MC-BR-005"
                        onChange={(event) =>
                          updateDraft(
                            "sku",
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="mc-product-form-field">
                      <label htmlFor="product-category">
                        Category *
                      </label>

                      <select
                        id="product-category"
                        value={draft.category}
                        onChange={(event) =>
                          updateDraft(
                            "category",
                            event.target.value,
                          )
                        }
                      >
                        {CATEGORIES.map((value) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mc-product-form-row">
                    <div className="mc-product-form-field">
                      <label htmlFor="product-price">
                        Price (LKR) *
                      </label>

                      <input
                        id="product-price"
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={draft.price}
                        placeholder="0.00"
                        onChange={(event) =>
                          updateDraft(
                            "price",
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="mc-product-form-field">
                      <label htmlFor="product-stock">
                        Stock quantity *
                      </label>

                      <input
                        id="product-stock"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={draft.stock}
                        onChange={(event) =>
                          updateDraft(
                            "stock",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="mc-product-form-field">
                    <label htmlFor="product-description">
                      Product description
                    </label>

                    <textarea
                      id="product-description"
                      rows={4}
                      maxLength={1000}
                      value={draft.description}
                      placeholder="Describe your collection..."
                      onChange={(event) =>
                        updateDraft(
                          "description",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="mc-product-form-options">
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
                        Publish product
                        <small>
                          Visible in the catalogue
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
                        Featured collection
                        <small>
                          Highlight this item
                        </small>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {formError && (
                <div
                  className="mc-products-error mc-product-form-error"
                  role="alert"
                >
                  <CircleAlert size={18} />
                  {formError}
                </div>
              )}

              <div className="mc-product-modal-footer">
                <button
                  type="button"
                  className="mc-product-cancel"
                  onClick={() => setEditorOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="mc-product-save"
                  disabled={processingImage}
                >
                  <Check size={18} />
                  {editingId
                    ? "Save changes"
                    : "Add product"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
