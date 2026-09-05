import {
  ArrowUpRight,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import {
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

/* ============================================================
   TYPES
============================================================ */

type Category =
  | "all"
  | "groom"
  | "occasion";

type SupportedLanguage =
  | "en"
  | "fr"
  | "de"
  | "it";

type SortOption =
  | "newest"
  | "oldest"
  | "featured";

type Sherwani = {
  id: number;
  number: string;
  translationKey: string;
  slug: string;
  category: Exclude<Category, "all">;
  image: string;
  featured?: boolean;
};

/* ============================================================
   SHERWANI DATA
============================================================ */

const sherwanis: Sherwani[] = [
  {
    id: 1,
    number: "01",
    translationKey: "ivoryHeritage",
    slug: "ivory-heritage",
    category: "groom",
    image: "/images/sherwani-1.png",
    featured: true,
  },

  {
    id: 2,
    number: "02",
    translationKey: "royalSand",
    slug: "royal-sand",
    category: "groom",
    image: "/images/sherwani-2.png",
    featured: true,
  },

  {
    id: 3,
    number: "03",
    translationKey: "midnightEmbroidery",
    slug: "midnight-embroidery",
    category: "groom",
    image: "/images/sherwani-3.png",
  },

  {
    id: 4,
    number: "04",
    translationKey: "champagneClassic",
    slug: "champagne-classic",
    category: "occasion",
    image: "/images/sherwani-4.png",
  },

  {
    id: 5,
    number: "05",
    translationKey: "regalIvory",
    slug: "regal-ivory",
    category: "groom",
    image: "/images/sherwani-5.png",
  },

  {
    id: 6,
    number: "06",
    translationKey: "mochaTextured",
    slug: "mocha-textured",
    category: "occasion",
    image: "/images/sherwani-6.png",
  },

  {
    id: 7,
    number: "07",
    translationKey: "classicBeige",
    slug: "classic-beige",
    category: "occasion",
    image: "/images/sherwani-7.png",
  },

  {
    id: 8,
    number: "08",
    translationKey: "royalCharcoal",
    slug: "royal-charcoal",
    category: "groom",
    image: "/images/sherwani-8.png",
  },
];

/* ============================================================
   CATEGORY FALLBACKS
============================================================ */

const categoryFallbacks: Record<
  Category,
  Record<SupportedLanguage, string>
> = {
  all: {
    en: "All",
    fr: "Tous",
    de: "Alle",
    it: "Tutti",
  },

  groom: {
    en: "Groom",
    fr: "Marié",
    de: "Bräutigam",
    it: "Sposo",
  },

  occasion: {
    en: "Occasion",
    fr: "Cérémonie",
    de: "Anlass",
    it: "Occasione",
  },
};

/* ============================================================
   PRODUCT TRANSLATION FALLBACKS
============================================================ */const productFallbacks: Record<
  string,
  {
    title: Record<SupportedLanguage, string>;
    category: Record<SupportedLanguage, string>;
    description: Record<
      SupportedLanguage,
      string
    >;
  }
> = {
  ivoryHeritage: {
    title: {
      en: "Ivory Heritage",
      fr: "Héritage Ivoire",
      de: "Elfenbein Heritage",
      it: "Eredità d'Avorio",
    },

    category: {
      en: "Groom",
      fr: "Marié",
      de: "Bräutigam",
      it: "Sposo",
    },

    description: {
      en: "A refined expression of timeless elegance.",
      fr: "Une expression raffinée d'une élégance intemporelle.",
      de: "Ein raffinierter Ausdruck zeitloser Eleganz.",
      it: "Una raffinata espressione di eleganza senza tempo.",
    },
  },

  royalSand: {
    title: {
      en: "Royal Sand",
      fr: "Sable Royal",
      de: "Royal Sand",
      it: "Sabbia Reale",
    },

    category: {
      en: "Groom",
      fr: "Marié",
      de: "Bräutigam",
      it: "Sposo",
    },

    description: {
      en: "Warm sand tones for sophisticated celebrations.",
      fr: "Des tons sable chaleureux pour des célébrations sophistiquées.",
      de: "Warme Sandtöne für stilvolle Feierlichkeiten.",
      it: "Calde tonalità sabbia per celebrazioni sofisticate.",
    },
  },

  midnightEmbroidery: {
    title: {
      en: "Midnight Embroidery",
      fr: "Broderie Bleu Nuit",
      de: "Mitternachtsstickerei",
      it: "Ricamo Mezzanotte",
    },

    category: {
      en: "Groom",
      fr: "Marié",
      de: "Bräutigam",
      it: "Sposo",
    },

    description: {
      en: "Deep tones with considered embroidered detail.",
      fr: "Des tons profonds rehaussés de détails brodés raffinés.",
      de: "Tiefe Farbtöne mit sorgfältig ausgearbeiteten Stickdetails.",
      it: "Tonalità profonde con raffinati dettagli ricamati.",
    },
  },

  champagneClassic: {
    title: {
      en: "Champagne Classic",
      fr: "Champagne Classique",
      de: "Champagner Klassik",
      it: "Champagne Classico",
    },

    category: {
      en: "Occasion",
      fr: "Cérémonie",
      de: "Anlass",
      it: "Occasione",
    },

    description: {
      en: "A warm champagne expression for elegant evenings.",
      fr: "Une expression champagne chaleureuse pour les soirées élégantes.",
      de: "Ein warmer Champagnerton für elegante Abende.",
      it: "Una calda tonalità champagne per serate eleganti.",
    },
  },

  regalIvory: {
    title: {
      en: "Regal Ivory",
      fr: "Ivoire Royal",
      de: "Königliches Elfenbein",
      it: "Avorio Regale",
    },

    category: {
      en: "Groom",
      fr: "Marié",
      de: "Bräutigam",
      it: "Sposo",
    },

    description: {
      en: "Traditional detailing with contemporary refinement.",
      fr: "Des détails traditionnels avec une sophistication contemporaine.",
      de: "Traditionelle Details mit zeitgemäßer Raffinesse.",
      it: "Dettagli tradizionali con raffinatezza contemporanea.",
    },
  },

  mochaTextured: {
    title: {
      en: "Mocha Textured",
      fr: "Texture Moka",
      de: "Mokka Textur",
      it: "Texture Moka",
    },

    category: {
      en: "Occasion",
      fr: "Cérémonie",
      de: "Anlass",
      it: "Occasione",
    },

    description: {
      en: "Rich mocha tones with understated texture.",
      fr: "Des tons moka riches avec une texture subtile.",
      de: "Satte Mokkatöne mit dezenter Textur.",
      it: "Ricche tonalità moka con una texture discreta.",
    },
  },

  classicBeige: {
    title: {
      en: "Classic Beige",
      fr: "Beige Classique",
      de: "Klassisches Beige",
      it: "Beige Classico",
    },

    category: {
      en: "Occasion",
      fr: "Cérémonie",
      de: "Anlass",
      it: "Occasione",
    },

    description: {
      en: "Quietly luxurious tailoring for every occasion.",
      fr: "Une coupe subtilement luxueuse pour chaque occasion.",
      de: "Dezent luxuriöse Schneiderkunst für jeden Anlass.",
      it: "Una sartoria discretamente lussuosa per ogni occasione.",
    },
  },

  royalCharcoal: {
    title: {
      en: "Royal Charcoal",
      fr: "Charbon Royal",
      de: "Royal Anthrazit",
      it: "Carbone Reale",
    },

    category: {
      en: "Groom",
      fr: "Marié",
      de: "Bräutigam",
      it: "Sposo",
    },

    description: {
      en: "A commanding silhouette for the modern groom.",
      fr: "Une silhouette affirmée pour le marié moderne.",
      de: "Eine ausdrucksstarke Silhouette für den modernen Bräutigam.",
      it: "Una silhouette decisa per lo sposo moderno.",
    },
  },
};
/* ============================================================
   PAGE FALLBACK TRANSLATIONS
============================================================ */

const pageFallbacks: Record<
  SupportedLanguage,
  {
    eyebrow: string;
    title: string;
    description: string;

    filter: string;
    sort: string;

    newest: string;
    oldest: string;
    featured: string;

    pieces: string;
    featuredBadge: string;
    view: string;

    philosophy: string;
    philosophyTitle: string;
    philosophyDescription: string;

    appointmentEyebrow: string;
    appointmentTitle: string;
    appointmentButton: string;

    emptyEyebrow: string;
    emptyTitle: string;
    viewAll: string;
  }
> = {
  en: {
    eyebrow: "The Sherwani Edit",
    title: "Sherwanis",
    description:
      "A considered selection of refined Indian sherwanis, chosen for their craftsmanship, character and timeless elegance.",

    filter: "Filter",
    sort: "Sort",

    newest: "New Arrivals",
    oldest: "Oldest",
    featured: "Featured",

    pieces: "Pieces",
    featuredBadge: "Featured",
    view: "View",

    philosophy: "Muhurtham Philosophy",
    philosophyTitle:
      "Elegance that lives beyond the occasion.",
    philosophyDescription:
      "Every piece is selected with an appreciation for detail, proportion and timeless Indian craftsmanship — creating a collection that feels considered today and cherished tomorrow.",

    appointmentEyebrow: "Your Muhurtham",
    appointmentTitle:
      "Find the piece made for your moment.",
    appointmentButton:
      "Book an Appointment",

    emptyEyebrow: "Collection",
    emptyTitle: "No pieces found",
    viewAll: "View All Sherwanis",
  },

  fr: {
    eyebrow: "L'Édition Sherwani",
    title: "Sherwanis",
    description:
      "Une sélection raffinée de sherwanis indiens, choisis pour leur savoir-faire, leur caractère et leur élégance intemporelle.",

    filter: "Filtrer",
    sort: "Trier",

    newest: "Nouveautés",
    oldest: "Plus anciens",
    featured: "Sélection",

    pieces: "Pièces",
    featuredBadge: "Sélection",
    view: "Voir",

    philosophy: "Philosophie Muhurtham",
    philosophyTitle:
      "Une élégance qui dépasse l'occasion.",
    philosophyDescription:
      "Chaque pièce est sélectionnée avec une attention particulière aux détails, aux proportions et au savoir-faire indien intemporel — une collection pensée aujourd'hui et destinée à être chérie demain.",

    appointmentEyebrow: "Votre Muhurtham",
    appointmentTitle:
      "Trouvez la pièce créée pour votre moment.",
    appointmentButton:
      "Prendre rendez-vous",

    emptyEyebrow: "Collection",
    emptyTitle: "Aucune pièce trouvée",
    viewAll: "Voir tous les sherwanis",
  },

  de: {
    eyebrow: "Die Sherwani-Auswahl",
    title: "Sherwanis",
    description:
      "Eine ausgewählte Kollektion raffinierter indischer Sherwanis, ausgesucht für ihre Handwerkskunst, ihren Charakter und ihre zeitlose Eleganz.",

    filter: "Filtern",
    sort: "Sortieren",

    newest: "Neuheiten",
    oldest: "Älteste",
    featured: "Ausgewählt",

    pieces: "Stücke",
    featuredBadge: "Ausgewählt",
    view: "Ansehen",

    philosophy: "Muhurtham Philosophie",
    philosophyTitle:
      "Eleganz, die über den Anlass hinaus Bestand hat.",
    philosophyDescription:
      "Jedes Stück wird mit besonderem Augenmerk auf Details, Proportionen und zeitlose indische Handwerkskunst ausgewählt — eine Kollektion, die heute durchdacht wirkt und morgen geschätzt wird.",

    appointmentEyebrow: "Ihr Muhurtham",
    appointmentTitle:
      "Finden Sie das Stück, das für Ihren Moment geschaffen wurde.",
    appointmentButton:
      "Termin vereinbaren",

    emptyEyebrow: "Kollektion",
    emptyTitle: "Keine Stücke gefunden",
    viewAll: "Alle Sherwanis ansehen",
  },

  it: {
    eyebrow: "L'Edizione Sherwani",
    title: "Sherwani",
    description:
      "Una selezione raffinata di sherwani indiani, scelti per la loro lavorazione artigianale, il carattere e l'eleganza senza tempo.",

    filter: "Filtra",
    sort: "Ordina",

    newest: "Nuovi arrivi",
    oldest: "Più vecchi",
    featured: "In evidenza",

    pieces: "Capi",
    featuredBadge: "In evidenza",
    view: "Vedi",

    philosophy: "Filosofia Muhurtham",
    philosophyTitle:
      "Un'eleganza che vive oltre l'occasione.",
    philosophyDescription:
      "Ogni capo è selezionato con attenzione ai dettagli, alle proporzioni e all'artigianato indiano senza tempo — creando una collezione pensata oggi e destinata a essere amata domani.",

    appointmentEyebrow:
      "Il vostro Muhurtham",
    appointmentTitle:
      "Scoprite il capo creato per il vostro momento.",
    appointmentButton:
      "Prenota un appuntamento",

    emptyEyebrow: "Collezione",
    emptyTitle: "Nessun capo trovato",
    viewAll: "Scopri tutti gli sherwani",
  },
};

/* ============================================================
   LANGUAGE RESOLUTION
============================================================ */

function resolveLanguage(
  pathname: string,
): SupportedLanguage {
  const firstSegment =
    pathname.split("/")[1];

  if (
    firstSegment === "en" ||
    firstSegment === "fr" ||
    firstSegment === "de" ||
    firstSegment === "it"
  ) {
    return firstSegment;
  }

  return "en";
}

/* ============================================================
   PAGE
============================================================ */

function SherwanisPage() {
  const location = useLocation();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const { i18n } = useTranslation();

  /* ==========================================================
     LANGUAGE
  ========================================================== */

  const language = resolveLanguage(
    location.pathname,
  );

  /* ==========================================================
     FIXED TRANSLATOR

     Forces this page to follow the language in the URL.
  ========================================================== */

  const fixedT =
    i18n.getFixedT(language);

  const fallback =
    pageFallbacks[language];

  /* ==========================================================
     SAFE TRANSLATION
  ========================================================== */

  const translate = (
    key: string,
    fallbackValue: string,
  ): string => {
    const value = fixedT(key, {
      defaultValue: "",
    });

    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      value !== key
    ) {
      return value;
    }

    return fallbackValue;
  };

  /* ==========================================================
     CATEGORY
  ========================================================== */

  const categoryFromUrl =
    searchParams.get("category");

  const activeCategory: Category =
    categoryFromUrl === "groom" ||
    categoryFromUrl === "occasion"
      ? categoryFromUrl
      : "all";

  /* ==========================================================
     SORT
  ========================================================== */

  const [sortBy, setSortBy] =
    useState<SortOption>("newest");

  const [showSort, setShowSort] =
    useState(false);

  /* ==========================================================
     CATEGORY CHANGE
  ========================================================== */

  const handleCategoryChange = (
    category: Category,
  ) => {
    if (category === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({
      category,
    });
  };

  /* ==========================================================
     FILTER + SORT
  ========================================================== */

  const filteredSherwanis = useMemo(() => {
    let items =
      activeCategory === "all"
        ? [...sherwanis]
        : sherwanis.filter(
            (item) =>
              item.category ===
              activeCategory,
          );

    if (sortBy === "oldest") {
      items = [...items].reverse();
    }

    if (sortBy === "featured") {
      items = [...items].sort(
        (a, b) =>
          Number(Boolean(b.featured)) -
          Number(Boolean(a.featured)),
      );
    }

    return items;
  }, [activeCategory, sortBy]);

  return (
    <main className="min-h-screen bg-ivory text-ink">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="px-6 pb-8 pt-14 sm:pb-10 sm:pt-16 lg:pt-20">

        <div className="page-container">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            <div
              className="
                flex
                flex-col
                gap-8
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >

              {/* TITLE */}

              <div className="max-w-3xl">

                <p className="eyebrow text-brown">
                  {translate(
                    "sherwanis.eyebrow",
                    fallback.eyebrow,
                  )}
                </p>

                <h1
                  className="
                    luxury-heading
                    mt-4
                    text-5xl
                    leading-[0.95]
                    sm:text-6xl
                    md:text-7xl
                    lg:text-[76px]
                  "
                >
                  {translate(
                    "navigation.sherwanis",
                    fallback.title,
                  )}
                </h1>

                <p className="editorial-copy mt-5 max-w-2xl">
                  {translate(
                    "sherwanis.description",
                    fallback.description,
                  )}
                </p>

              </div>

              {/* FILTER + SORT */}

              <div className="flex shrink-0 items-center gap-2">

                <button
                  type="button"
                  className="
                    inline-flex
                    h-12
                    items-center
                    gap-3
                    border
                    border-black/15
                    bg-transparent
                    px-5
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.22em]
                    transition-all
                    duration-300
                    hover:border-brown
                    hover:bg-white
                  "
                >

                  <SlidersHorizontal
                    size={14}
                    strokeWidth={1.2}
                  />

                  {translate(
                    "common.filter",
                    fallback.filter,
                  )}

                </button>

                <div className="relative">

                  <button
                    type="button"
                    onClick={() =>
                      setShowSort(
                        (value) => !value,
                      )
                    }
                    className="
                      inline-flex
                      h-12
                      items-center
                      gap-4
                      border
                      border-black/15
                      bg-transparent
                      px-5
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.22em]
                      transition-all
                      duration-300
                      hover:border-brown
                      hover:bg-white
                    "
                  >

                    <span className="text-black/40">
                      {translate(
                        "common.sort",
                        fallback.sort,
                      )}
                    </span>

                    <span>
                      {sortBy === "newest"
                        ? translate(
                            "common.newArrivals",
                            fallback.newest,
                          )
                        : sortBy === "oldest"
                          ? translate(
                              "common.oldest",
                              fallback.oldest,
                            )
                          : translate(
                              "common.featured",
                              fallback.featured,
                            )}
                    </span>

                    <ChevronDown
                      size={13}
                      strokeWidth={1.2}
                      className={`transition-transform duration-300 ${
                        showSort
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </button>

                  {showSort && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="
                        absolute
                        right-0
                        top-[calc(100%+6px)]
                        z-30
                        min-w-42.5
                        border
                        border-black/10
                        bg-white
                        p-1
                        shadow-xl
                      "
                    >

                      <button
                        type="button"
                        onClick={() => {
                          setSortBy("newest");
                          setShowSort(false);
                        }}
                        className="
                          block
                          w-full
                          px-4
                          py-3
                          text-left
                          text-[9px]
                          uppercase
                          tracking-[0.18em]
                          transition-colors
                          hover:bg-ivory
                        "
                      >
                        {translate(
                          "common.newArrivals",
                          fallback.newest,
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSortBy("featured");
                          setShowSort(false);
                        }}
                        className="
                          block
                          w-full
                          px-4
                          py-3
                          text-left
                          text-[9px]
                          uppercase
                          tracking-[0.18em]
                          transition-colors
                          hover:bg-ivory
                        "
                      >
                        {translate(
                          "common.featured",
                          fallback.featured,
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSortBy("oldest");
                          setShowSort(false);
                        }}
                        className="
                          block
                          w-full
                          px-4
                          py-3
                          text-left
                          text-[9px]
                          uppercase
                          tracking-[0.18em]
                          transition-colors
                          hover:bg-ivory
                        "
                      >
                        {translate(
                          "common.oldest",
                          fallback.oldest,
                        )}
                      </button>

                    </motion.div>
                  )}

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* =====================================================
          CATEGORY NAVIGATION
      ===================================================== */}

      <section className="px-6 pb-8">

        <div className="page-container">

          <motion.div
            className="
              flex
              items-center
              gap-7
              overflow-x-auto
              border-y
              border-black/10
              py-5
              scrollbar-hide
            "
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
          >

            {(
              [
                "all",
                "groom",
                "occasion",
              ] as Category[]
            ).map((category) => {

              const active =
                activeCategory ===
                category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(
                      category,
                    )
                  }
                  className={`
                    relative
                    shrink-0
                    pb-2
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.28em]
                    transition-colors
                    duration-300
                    ${
                      active
                        ? "text-brown"
                        : "text-black/45 hover:text-ink"
                    }
                  `}
                >

                  {translate(
                    `sherwanis.categories.${category}`,
                    categoryFallbacks[
                      category
                    ][language],
                  )}

                  {active && (
                    <motion.span
                      layoutId="activeSherwaniCategory"
                      className="
                        absolute
                        bottom-0
                        left-0
                        h-px
                        w-full
                        bg-brown
                      "
                    />
                  )}

                </button>
              );
            })}

            <div className="ml-auto hidden shrink-0 sm:block">

              <span className="text-[8px] uppercase tracking-[0.24em] text-black/35">

                {String(
                  filteredSherwanis.length,
                ).padStart(2, "0")}{" "}

                {translate(
                  "common.pieces",
                  fallback.pieces,
                )}

              </span>

            </div>

          </motion.div>

        </div>

      </section>

      {/* =====================================================
          SHERWANI GRID
      ===================================================== */}

      <section className="px-6 pb-24 sm:pb-28 lg:pb-32">

        <div className="page-container">

          {filteredSherwanis.length > 0 ? (

            <motion.div
              layout
              className="
                grid
                grid-cols-1
                gap-x-5
                gap-y-12
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >

              {filteredSherwanis.map(
                (item, index) => {

                  const product =
                    productFallbacks[
                      item.translationKey
                    ];

                  const productName =
                    translate(
                      `products.${item.translationKey}.title`,
                      product.title[
                        language
                      ],
                    );

                  const productCategory =
                    translate(
                      `products.${item.translationKey}.category`,
                      product.category[
                        language
                      ],
                    );

                  const productDescription =
                    translate(
                      `products.${item.translationKey}.description`,
                      product.description[
                        language
                      ],
                    );

                  return (
                    <motion.article
                      key={item.id}
                      layout
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.65,
                        delay:
                          index * 0.08,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                      className="group"
                    >

                      <Link
                        to={`/${language}/sherwanis/${item.slug}`}
                        className="block"
                        aria-label={
                          productName
                        }
                      >

                        <div
                          className="
                            relative
                            aspect-3/4
                            overflow-hidden
                            bg-[#806657]
                          "
                        >

                          <img
                            src={item.image}
                            alt={productName}
                            loading={
                              index < 4
                                ? "eager"
                                : "lazy"
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-1000
                              ease-out
                              group-hover:scale-[1.035]
                            "
                          />

                          <div
                            className="
                              absolute
                              inset-0
                              bg-black/0
                              transition-colors
                              duration-700
                              group-hover:bg-black/10
                            "
                          />

                          <div className="absolute left-4 top-4">

                            <span
                              className="
                                text-[8px]
                                uppercase
                                tracking-[0.28em]
                                text-white
                                drop-shadow-md
                              "
                            >
                              {item.number}
                            </span>

                          </div>

                          {item.featured && (
                            <div className="absolute left-4 top-10">

                              <span
                                className="
                                  border
                                  border-white/50
                                  bg-black/20
                                  px-3
                                  py-1.5
                                  text-[7px]
                                  uppercase
                                  tracking-[0.2em]
                                  text-white
                                  backdrop-blur-sm
                                "
                              >
                                {translate(
                                  "common.featured",
                                  fallback.featuredBadge,
                                )}
                              </span>

                            </div>
                          )}

                          <div
                            className="
                              absolute
                              bottom-4
                              right-4
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-white/60
                              bg-black/10
                              text-white
                              backdrop-blur-[2px]
                              transition-all
                              duration-500
                              group-hover:border-white
                              group-hover:bg-white
                              group-hover:text-ink
                            "
                          >

                            <ArrowUpRight
                              size={14}
                              strokeWidth={1.1}
                              className="
                                transition-transform
                                duration-500
                                group-hover:translate-x-1
                                group-hover:-translate-y-1
                              "
                            />

                          </div>

                        </div>

                      </Link>

                      <div className="pt-4">

                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            <p
                              className="
                                mb-2
                                text-[7px]
                                uppercase
                                tracking-[0.25em]
                                text-brown
                              "
                            >
                              {productCategory}
                            </p>

                            <h2
                              className="
                                font-display
                                text-[22px]
                                leading-[1.05]
                                sm:text-[24px]
                              "
                            >
                              {productName}
                            </h2>

                            <p
                              className="
                                mt-2
                                max-w-65
                                text-[11px]
                                leading-5
                                text-black/50
                              "
                            >
                              {productDescription}
                            </p>

                          </div>

                          <span
                            className="
                              mt-1
                              shrink-0
                              text-[8px]
                              uppercase
                              tracking-[0.2em]
                              text-black/35
                              transition-colors
                              duration-300
                              group-hover:text-brown
                            "
                          >
                            {translate(
                              "common.view",
                              fallback.view,
                            )}
                          </span>

                        </div>

                        <div
                          className="
                            mt-4
                            h-px
                            w-full
                            bg-black/10
                            transition-colors
                            duration-500
                            group-hover:bg-brown/40
                          "
                        />

                      </div>

                    </motion.article>
                  );
                },
              )}

            </motion.div>

          ) : (

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="
                flex
                min-h-75
                items-center
                justify-center
                border-y
                border-black/10
              "
            >

              <div className="text-center">

                <p className="eyebrow text-brown">
                  {fallback.emptyEyebrow}
                </p>

                <h2
                  className="
                    luxury-heading
                    mt-4
                    text-4xl
                  "
                >
                  {fallback.emptyTitle}
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    handleCategoryChange(
                      "all",
                    )
                  }
                  className="
                    mt-6
                    border
                    border-black/20
                    px-6
                    py-3
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    transition-all
                    duration-300
                    hover:bg-ink
                    hover:text-white
                  "
                >
                  {fallback.viewAll}
                </button>

              </div>

            </motion.div>

          )}

        </div>

      </section>

      {/* =====================================================
          EDITORIAL STATEMENT
      ===================================================== */}

      <section
        className="
          border-y
          border-black/10
          bg-warm-white
          px-6
          py-20
          sm:py-24
          lg:py-28
        "
      >

        <div className="page-container">

          <motion.div
            className="
              mx-auto
              max-w-4xl
              text-center
            "
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            <p className="eyebrow text-brown">
              {translate(
                "sherwanis.philosophy.eyebrow",
                fallback.philosophy,
              )}
            </p>

            <h2
              className="
                luxury-heading
                mt-5
                text-4xl
                leading-[1.05]
                sm:text-5xl
                md:text-6xl
              "
            >
              {translate(
                "sherwanis.philosophy.title",
                fallback.philosophyTitle,
              )}
            </h2>

            <p
              className="
                editorial-copy
                mx-auto
                mt-6
                max-w-2xl
              "
            >
              {translate(
                "sherwanis.philosophy.description",
                fallback.philosophyDescription,
              )}
            </p>

          </motion.div>

        </div>

      </section>

      {/* =====================================================
          APPOINTMENT CTA
          
          FIXED:
          -----------------------------------------------------
          The global `.luxury-heading` class was making the
          heading dark on the dark `bg-ink` background.

          We explicitly use `!text-white` on the heading.

          The eyebrow uses a warm luxury beige.
      ===================================================== */}

      <section
        className="
          bg-ink
          px-6
          py-20
          text-white
          sm:py-24
          lg:py-28
        "
      >

        <div className="page-container">

          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* =================================================
                CTA TEXT
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
              }}
            >

              {/* EYEBROW */}

              <p
                className="
                  eyebrow
                  text-[#C8B09B]!
                "
              >
                {translate(
                  "sherwanis.appointment.eyebrow",
                  fallback.appointmentEyebrow,
                )}
              </p>

              {/* =================================================
                  APPOINTMENT HEADING

                  IMPORTANT:
                  text-white! overrides the global
                  `.luxury-heading` color.
              ================================================= */}

              <h2
                className="
                  luxury-heading
                  mt-4
                  max-w-3xl
                  text-white!
                  text-4xl
                  leading-[1.05]
                  sm:text-5xl
                  md:text-6xl
                "
              >
                {translate(
                  "sherwanis.appointment.title",
                  fallback.appointmentTitle,
                )}
              </h2>

            </motion.div>

            {/* =================================================
                APPOINTMENT BUTTON
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
            >

              <Link
                to={`/${language}/appointment`}
                className="
                  group
                  inline-flex
                  items-center
                  gap-5
                  border
                  border-white/50
                  px-8
                  py-4
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-white!
                  transition-all
                  duration-500
                  hover:bg-white
                  hover:text-ink!
                "
              >

                {translate(
                  "common.bookAppointment",
                  fallback.appointmentButton,
                )}

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.1}
                  className="
                    transition-transform
                    duration-500
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                />

              </Link>

            </motion.div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default SherwanisPage;