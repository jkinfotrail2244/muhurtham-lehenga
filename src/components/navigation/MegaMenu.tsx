import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type MegaMenuProps = {
  activeCategory: string | null;
  language: string;
  onClose: () => void;
};

type CategoryItem = {
  label: string;
  path: string;
};

type CategoryGroup = {
  items: CategoryItem[];
  image: string;
  secondaryImage?: string;
  tertiaryImage?: string;
  description: string;
};

/* ============================================================
   CATEGORY DATA
============================================================ */

const categoryGroups: Record<string, CategoryGroup> = {
  /* =========================================================
     LEHENGAS
  ========================================================= */

  lehengas: {
    items: [
      {
        label: "Bridal Lehengas",
        path: "?category=bridal",
      },
      {
        label: "Occasion Lehengas",
        path: "?category=occasion",
      },
    ],

    image: "/images/lehenga-bridal.png",

    description:
      "Timeless silhouettes for unforgettable celebrations.",
  },

  /* =========================================================
     SHERWANIS
  ========================================================= */

  sherwanis: {
    items: [
      {
        label: "Groom Sherwanis",
        path: "?category=groom",
      },
      {
        label: "Occasion Sherwanis",
        path: "?category=occasion",
      },
    ],

    image: "/images/sherwani.png",

    description:
      "Refined Indian tailoring for the modern groom.",
  },

  /* =========================================================
     SAREES
  ========================================================= */

  sarees: {
    items: [
      {
        label: "Bridal Sarees",
        path: "?category=bridal",
      },
      {
        label: "Occasion Sarees",
        path: "?category=occasion",
      },
    ],

    image: "/images/saree-collection1.png",

    description:
      "Elegant drapes and timeless Indian craftsmanship for every celebration.",
  },

  /* =========================================================
     COLLECTIONS
  ========================================================= */

  collections: {
    items: [
      {
        label: "Lehenga Collection",
        path: "lehengas",
      },
      {
        label: "Sherwani Collection",
        path: "sherwanis",
      },
      {
        label: "Saree Collection",
        path: "sarees",
      },
    ],

    image: "/images/collection.png",

    secondaryImage:
      "/images/collection1.png",

    tertiaryImage:
      "/images/saree-collection.png",

    description:
      "A considered edit of Muhurtham favourites.",
  },
};

/* ============================================================
   MEGA MENU
============================================================ */

function MegaMenu({
  activeCategory,
  language,
  onClose,
}: MegaMenuProps) {
  const { t } = useTranslation();

  /* ==========================================================
     INVALID / CLOSED MENU
  ========================================================== */

  if (
    !activeCategory ||
    !categoryGroups[activeCategory]
  ) {
    return null;
  }

  const category =
    categoryGroups[activeCategory];

  /* ==========================================================
     MAIN CATALOGUE PATH

     IMPORTANT:

     lehengas    → /en/lehengas
     sherwanis   → /en/sherwanis
     sarees      → /en/sarees
     collections → /en/collections

     Collections itself can still open the
     Collections page.

     But the three COLLECTION ITEMS below
     are handled separately and go directly
     to their catalogue pages.
  ========================================================== */

  const mainPath =
    activeCategory;

  /* ==========================================================
     TRANSLATION LABEL
  ========================================================== */

  const navigationLabel = t(
    `navigation.${activeCategory}`,
    {
      defaultValue:
        activeCategory === "sarees"
          ? "Sarees"
          : activeCategory === "lehengas"
            ? "Lehengas"
            : activeCategory === "sherwanis"
              ? "Sherwanis"
              : "Collections",
    },
  );

  /* ==========================================================
     NORMAL CATEGORY ITEM PATH

     Examples:

     /en/lehengas?category=bridal
     /en/lehengas?category=occasion

     /en/sherwanis?category=groom
     /en/sherwanis?category=occasion

     /en/sarees?category=bridal
     /en/sarees?category=occasion
  ========================================================== */

  const getCategoryItemPath = (
    item: CategoryItem,
  ) => {
    return `/${language}/${activeCategory}${item.path}`;
  };

  /* ==========================================================
     COLLECTION ITEM PATH

     IMPORTANT FIX

     Collections → Lehenga Collection
       /en/lehengas

     Collections → Sherwani Collection
       /en/sherwanis

     Collections → Saree Collection
       /en/sarees

     NEVER:

       /en/collections/lehengas
       /en/collections/sherwanis
       /en/collections/sarees

     because those are interpreted by:

       collections/:slug

     and open CollectionDetailPage.
  ========================================================== */

  const getCollectionItemPath = (
    collection: string,
  ) => {
    return `/${language}/${collection}`;
  };

  /* ==========================================================
     MAIN CATALOGUE PATH
  ========================================================== */

  const getMainPath = () => {
    return `/${language}/${mainPath}`;
  };

  return (
    <div
      className="absolute left-0 right-0 top-full z-40 border-t border-black/5 bg-warm-white shadow-[0_18px_45px_rgba(0,0,0,0.06)]"
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      <div className="page-container px-6 py-7 lg:py-8">

        <div className="grid grid-cols-12 gap-8">

          {/* =================================================
              IMAGE AREA
          ================================================= */}

          <div className="col-span-4">

            {/* =================================================
                COLLECTIONS
                THREE COLLECTION CARDS
            ================================================= */}

            {activeCategory === "collections" ? (

              <div className="grid grid-cols-3 gap-2">

                {/* ---------------------------------------------
                    LEHENGAS
                --------------------------------------------- */}

                <Link
                  to={getCollectionItemPath("lehengas")}
                  onClick={onClose}
                  className="group block"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#806657]">

                    <img
                      src={category.image}
                      alt="Lehenga Collection"
                      className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                    />

                    <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />

                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/75 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-3">

                      <p className="mb-1 text-[5px] uppercase tracking-[0.25em] text-white/65">
                        Collection
                      </p>

                      <h3 className="font-display text-sm leading-tight text-white">
                        Lehengas
                      </h3>

                    </div>

                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/50 text-white opacity-0 transition-all duration-500 group-hover:opacity-100">

                      <ArrowUpRight
                        size={10}
                        strokeWidth={1}
                      />

                    </div>

                  </div>
                </Link>

                {/* ---------------------------------------------
                    SHERWANIS
                --------------------------------------------- */}

                <Link
                  to={getCollectionItemPath("sherwanis")}
                  onClick={onClose}
                  className="group block"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#806657]">

                    <img
                      src={
                        category.secondaryImage
                      }
                      alt="Sherwani Collection"
                      className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                    />

                    <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />

                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/75 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-3">

                      <p className="mb-1 text-[5px] uppercase tracking-[0.25em] text-white/65">
                        Collection
                      </p>

                      <h3 className="font-display text-sm leading-tight text-white">
                        Sherwanis
                      </h3>

                    </div>

                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/50 text-white opacity-0 transition-all duration-500 group-hover:opacity-100">

                      <ArrowUpRight
                        size={10}
                        strokeWidth={1}
                      />

                    </div>

                  </div>
                </Link>

                {/* ---------------------------------------------
                    SAREES
                --------------------------------------------- */}

                <Link
                  to={getCollectionItemPath("sarees")}
                  onClick={onClose}
                  className="group block"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#806657]">

                    <img
                      src={
                        category.tertiaryImage
                      }
                      alt="Saree Collection"
                      className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                    />

                    <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />

                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/75 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-3">

                      <p className="mb-1 text-[5px] uppercase tracking-[0.25em] text-white/65">
                        Collection
                      </p>

                      <h3 className="font-display text-sm leading-tight text-white">
                        Sarees
                      </h3>

                    </div>

                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/50 text-white opacity-0 transition-all duration-500 group-hover:opacity-100">

                      <ArrowUpRight
                        size={10}
                        strokeWidth={1}
                      />

                    </div>

                  </div>
                </Link>

              </div>

            ) : (

              /* =================================================
                 NORMAL CATEGORY - SINGLE IMAGE
              ================================================= */

              <Link
                to={getMainPath()}
                onClick={onClose}
                className="group block"
              >

                <div className="relative aspect-4/3 overflow-hidden bg-[#806657]">

                  <img
                    src={category.image}
                    alt={navigationLabel}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />

                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/75 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6">

                    <p className="mb-2 text-[7px] uppercase tracking-[0.3em] text-white/65">
                      Muhurtham Collection
                    </p>

                    <h3 className="font-display text-2xl text-white">
                      {navigationLabel}
                    </h3>

                  </div>

                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/50 text-white opacity-0 transition-all duration-500 group-hover:opacity-100">

                    <ArrowUpRight
                      size={14}
                      strokeWidth={1}
                    />

                  </div>

                </div>

              </Link>
            )}

          </div>

          {/* =================================================
              LINKS
          ================================================= */}

          <div className="col-span-5 flex flex-col justify-center">

            {/* Category label */}

            <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-brown">
              {navigationLabel}
            </p>

            {/* Description */}

            <p className="mb-5 max-w-sm text-[11px] leading-5 text-black/45">
              {category.description}
            </p>

            {/* =================================================
                CATEGORY LINKS
            ================================================= */}

            <div>

              {category.items.map(
                (item) => {

                  /* =================================================
                     COLLECTIONS SPECIAL ROUTING

                     This is the important fix.

                     Before:
                       /en/collections/sarees

                     Now:
                       /en/sarees
                  ================================================= */

                  const itemPath =
                    activeCategory ===
                    "collections"
                      ? getCollectionItemPath(
                          item.path,
                        )
                      : getCategoryItemPath(
                          item,
                        );

                  return (
                    <Link
                      key={`${activeCategory}-${item.label}`}
                      to={itemPath}
                      onClick={onClose}
                      className="group flex items-center justify-between border-b border-black/8 py-3.5 text-[13px] transition-colors duration-300 hover:text-brown"
                    >

                      <span>
                        {item.label}
                      </span>

                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.1}
                        className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                      />

                    </Link>
                  );
                },
              )}

            </div>

          </div>

          {/* =================================================
              VIEW ALL
          ================================================= */}

          <div className="col-span-3 flex items-end justify-end">

            <Link
              to={getMainPath()}
              onClick={onClose}
              className="group inline-flex items-center gap-4 border border-ink px-6 py-3 text-[8px] font-medium uppercase tracking-[0.2em] transition-all duration-500 hover:bg-ink hover:text-white"
            >

              {t("common.viewAll", {
                defaultValue: "View All",
              })}

              <ArrowUpRight
                size={13}
                strokeWidth={1}
                className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
              />

            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default MegaMenu;