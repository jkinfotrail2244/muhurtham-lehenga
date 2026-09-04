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
  | "bridal"
  | "occasion";

type SupportedLanguage =
  | "en"
  | "ta"
  | "fr"
  | "de"
  | "it";

type SortOption =
  | "newest"
  | "oldest"
  | "featured";

type Lehenga = {
  id: number;
  number: string;
  translationKey: string;
  slug: string;
  category: Exclude<Category, "all">;
  image: string;
  featured?: boolean;
};

/* ============================================================
   LEHENGA DATA
============================================================ */

const lehengas: Lehenga[] = [
  {
    id: 1,
    number: "01",
    translationKey: "royalMaroon",
    slug: "royal-maroon",
    category: "bridal",
    image: "/images/lehenga-bridal.png",
    featured: true,
  },
  {
    id: 2,
    number: "02",
    translationKey: "ivoryGarden",
    slug: "ivory-garden",
    category: "bridal",
    image: "/images/lehenga-wedding.png",
  },
  {
    id: 3,
    number: "03",
    translationKey: "blushPink",
    slug: "blush-pink",
    category: "occasion",
    image: "/images/lehenga-occasion.png",
  },
  {
    id: 4,
    number: "04",
    translationKey: "goldenTissue",
    slug: "golden-tissue",
    category: "occasion",
    image: "/images/lehenga-collection.png",
  },
];

/* ============================================================
   CATEGORY FALLBACK TRANSLATIONS
============================================================ */

const categoryFallbacks: Record<
  Category,
  Record<SupportedLanguage, string>
> = {
  all: {
    en: "All",
    ta: "அனைத்தும்",
    fr: "Tous",
    de: "Alle",
    it: "Tutti",
  },

  bridal: {
    en: "Bridal",
    ta: "மணமகள்",
    fr: "Mariée",
    de: "Braut",
    it: "Sposa",
  },

  occasion: {
    en: "Occasion",
    ta: "விழா",
    fr: "Cérémonie",
    de: "Anlass",
    it: "Occasione",
  },
};

/* ============================================================
   LEHENGA PRODUCT FALLBACKS
============================================================ */

const productFallbacks: Record<
  string,
  {
    title: Record<SupportedLanguage, string>;
    category: Record<SupportedLanguage, string>;
    description: Record<SupportedLanguage, string>;
  }
> = {
  royalMaroon: {
    title: {
      en: "Royal Maroon",
      ta: "ராயல் மரூன்",
      fr: "Maroon Royal",
      de: "Königliches Maroon",
      it: "Maroon Regale",
    },

    category: {
      en: "Bridal",
      ta: "மணமகள்",
      fr: "Mariée",
      de: "Braut",
      it: "Sposa",
    },

    description: {
      en: "A richly embroidered bridal lehenga in deep ceremonial maroon.",
      ta: "ஆழமான மரூன் நிறத்தில் செழுமையான எம்பிராய்டரி அலங்காரத்துடன் உருவாக்கப்பட்ட மணமகள் லெஹங்கா.",
      fr: "Un lehenga de mariée richement brodé dans un profond maroon cérémoniel.",
      de: "Ein reich bestickter Braut-Lehenga in tiefem, festlichem Maroon.",
      it: "Un lehenga da sposa riccamente ricamato in un profondo maroon cerimoniale.",
    },
  },

  ivoryGarden: {
    title: {
      en: "Ivory Garden",
      ta: "ஐவரி கார்டன்",
      fr: "Jardin Ivoire",
      de: "Elfenbeingarten",
      it: "Giardino d'Avorio",
    },

    category: {
      en: "Bridal",
      ta: "மணமகள்",
      fr: "Mariée",
      de: "Braut",
      it: "Sposa",
    },

    description: {
      en: "Soft ivory embroidery shaped for an elegant bridal silhouette.",
      ta: "நேர்த்தியான மணமகள் தோற்றத்திற்காக வடிவமைக்கப்பட்ட மென்மையான ஐவரி எம்பிராய்டரி.",
      fr: "Une broderie ivoire délicate conçue pour une silhouette de mariée élégante.",
      de: "Sanfte Elfenbein-Stickerei für eine elegante Brautsilhouette.",
      it: "Morbidi ricami color avorio pensati per un'elegante silhouette da sposa.",
    },
  },

  blushPink: {
    title: {
      en: "Blush Pink",
      ta: "பிளஷ் பிங்க்",
      fr: "Rose Poudré",
      de: "Blush Pink",
      it: "Rosa Cipria",
    },

    category: {
      en: "Occasion",
      ta: "விழா",
      fr: "Cérémonie",
      de: "Anlass",
      it: "Occasione",
    },

    description: {
      en: "A delicate occasion lehenga with graceful detailing and movement.",
      ta: "நேர்த்தியான அலங்கார விவரங்களுடனும் அழகான அசைவுடனும் வடிவமைக்கப்பட்ட விழா லெஹங்கா.",
      fr: "Un lehenga de cérémonie délicat aux détails raffinés et au mouvement gracieux.",
      de: "Ein zarter Anlass-Lehenga mit eleganten Details und anmutiger Bewegung.",
      it: "Un delicato lehenga da occasione con dettagli raffinati e movimento elegante.",
    },
  },

  goldenTissue: {
    title: {
      en: "Golden Tissue",
      ta: "கோல்டன் டிஷ்யூ",
      fr: "Tissu Doré",
      de: "Goldenes Gewebe",
      it: "Tessuto Dorato",
    },

    category: {
      en: "Occasion",
      ta: "விழா",
      fr: "Cérémonie",
      de: "Anlass",
      it: "Occasione",
    },

    description: {
      en: "Luminous golden tissue crafted for unforgettable celebrations.",
      ta: "மறக்க முடியாத கொண்டாட்டங்களுக்காக உருவாக்கப்பட்ட ஒளிரும் தங்க நிற டிஷ்யூ துணி லெஹங்கா.",
      fr: "Un tissu doré lumineux créé pour des célébrations inoubliables.",
      de: "Leuchtendes goldenes Gewebe für unvergessliche Feierlichkeiten.",
      it: "Un luminoso tessuto dorato creato per celebrazioni indimenticabili.",
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
    eyebrow: "The Lehenga Edit",
    title: "Lehengas",

    description:
      "A considered selection of Indian bridal and occasion lehengas, chosen for their craftsmanship, character and timeless elegance.",

    filter: "Filter",
    sort: "Sort",
    newest: "New Arrivals",
    oldest: "Oldest",
    featured: "Featured",
    pieces: "Pieces",
    view: "View",

    philosophy: "Muhurtham Philosophy",

    philosophyTitle:
      "Elegance that lives beyond the occasion.",

    philosophyDescription:
      "Every piece is selected with an appreciation for detail, proportion and timeless Indian craftsmanship — creating a collection that feels considered today and cherished tomorrow.",

    appointmentEyebrow:
      "Your Muhurtham",

    appointmentTitle:
      "Find the piece made for your moment.",

    appointmentButton:
      "Book an Appointment",

    emptyEyebrow: "Collection",
    emptyTitle: "No pieces found",
    viewAll: "View All Lehengas",
  },

  ta: {
    eyebrow: "முகூர்த்தம் லெஹங்கா தொகுப்பு",
    title: "லெஹங்காக்கள்",

    description:
      "கைவினைத்திறன், தனித்துவம் மற்றும் காலத்தால் அழியாத நேர்த்திக்காகத் தேர்ந்தெடுக்கப்பட்ட இந்திய மணமகள் மற்றும் விழா லெஹங்காக்களின் சிறப்பான தொகுப்பு.",

    filter: "வடிகட்டி",
    sort: "வரிசைப்படுத்து",
    newest: "புதிய வரவுகள்",
    oldest: "பழையவை",
    featured: "சிறப்புத் தேர்வுகள்",
    pieces: "ஆடைகள்",
    view: "பார்க்க",

    philosophy: "முகூர்த்தம் தத்துவம்",

    philosophyTitle:
      "விழாவைத் தாண்டியும் நிலைத்திருக்கும் நேர்த்தி.",

    philosophyDescription:
      "ஒவ்வொரு ஆடையும் நுணுக்கம், அளவுத்தன்மை மற்றும் காலத்தால் அழியாத இந்திய கைவினைத்திறனை மதித்து தேர்ந்தெடுக்கப்படுகிறது — இன்று நேர்த்தியாகவும் நாளை நினைவாகவும் இருக்கும் ஒரு தொகுப்பை உருவாக்குகிறது.",

    appointmentEyebrow:
      "உங்கள் முகூர்த்தம்",

    appointmentTitle:
      "உங்கள் சிறப்பான தருணத்திற்காக உருவாக்கப்பட்ட ஆடையைத் தேர்ந்தெடுக்குங்கள்.",

    appointmentButton:
      "சந்திப்பு முன்பதிவு செய்யுங்கள்",

    emptyEyebrow: "தொகுப்பு",

    emptyTitle:
      "ஆடைகள் எதுவும் கிடைக்கவில்லை",

    viewAll:
      "அனைத்து லெஹங்காக்களையும் பார்க்க",
  },

  fr: {
    eyebrow: "L'Édition Lehenga",
    title: "Lehengas",

    description:
      "Une sélection raffinée de lehengas indiens de mariée et de cérémonie, choisis pour leur savoir-faire, leur caractère et leur élégance intemporelle.",

    filter: "Filtrer",
    sort: "Trier",
    newest: "Nouveautés",
    oldest: "Plus anciens",
    featured: "Sélection",
    pieces: "Pièces",
    view: "Voir",

    philosophy: "Philosophie Muhurtham",

    philosophyTitle:
      "Une élégance qui dépasse l'occasion.",

    philosophyDescription:
      "Chaque pièce est sélectionnée avec une attention particulière aux détails, aux proportions et au savoir-faire indien intemporel — une collection pensée aujourd'hui et destinée à être chérie demain.",

    appointmentEyebrow:
      "Votre Muhurtham",

    appointmentTitle:
      "Trouvez la pièce créée pour votre moment.",

    appointmentButton:
      "Prendre rendez-vous",

    emptyEyebrow: "Collection",
    emptyTitle: "Aucune pièce trouvée",
    viewAll: "Voir tous les lehengas",
  },

  de: {
    eyebrow: "Die Lehenga-Auswahl",
    title: "Lehengas",

    description:
      "Eine ausgewählte Kollektion indischer Braut- und Anlass-Lehengas, ausgesucht für ihre Handwerkskunst, ihren Charakter und ihre zeitlose Eleganz.",

    filter: "Filtern",
    sort: "Sortieren",
    newest: "Neuheiten",
    oldest: "Älteste",
    featured: "Ausgewählt",
    pieces: "Stücke",
    view: "Ansehen",

    philosophy: "Muhurtham Philosophie",

    philosophyTitle:
      "Eleganz, die über den Anlass hinaus Bestand hat.",

    philosophyDescription:
      "Jedes Stück wird mit besonderem Augenmerk auf Details, Proportionen und zeitlose indische Handwerkskunst ausgewählt — eine Kollektion, die heute durchdacht wirkt und morgen geschätzt wird.",

    appointmentEyebrow:
      "Ihr Muhurtham",

    appointmentTitle:
      "Finden Sie das Stück, das für Ihren Moment geschaffen wurde.",

    appointmentButton:
      "Termin vereinbaren",

    emptyEyebrow: "Kollektion",
    emptyTitle: "Keine Stücke gefunden",
    viewAll: "Alle Lehengas ansehen",
  },

  it: {
    eyebrow: "L'Edizione Lehenga",
    title: "Lehenga",

    description:
      "Una selezione raffinata di lehenga indiani da sposa e da cerimonia, scelti per la loro lavorazione artigianale, il carattere e l'eleganza senza tempo.",

    filter: "Filtra",
    sort: "Ordina",
    newest: "Nuovi arrivi",
    oldest: "Più vecchi",
    featured: "In evidenza",
    pieces: "Capi",
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
    viewAll: "Scopri tutti i lehenga",
  },
};

/* ============================================================
   LANGUAGE RESOLVER
============================================================ */

function resolveLanguage(
  pathname: string,
): SupportedLanguage {
  const firstSegment =
    pathname.split("/")[1];

  if (
    firstSegment === "en" ||
    firstSegment === "ta" ||
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

function LehengasPage() {
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
    categoryFromUrl === "bridal" ||
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

  const filteredLehengas = useMemo(() => {
    let items =
      activeCategory === "all"
        ? [...lehengas]
        : lehengas.filter(
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
          PAGE INTRO
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

              <div className="max-w-3xl">

                <p className="eyebrow text-brown">
                  {translate(
                    "lehengas.eyebrow",
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
                    "navigation.lehengas",
                    fallback.title,
                  )}
                </h1>

                <p className="editorial-copy mt-5 max-w-2xl">
                  {translate(
                    "lehengas.description",
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
                "bridal",
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
                    `lehengas.categories.${category}`,
                    categoryFallbacks[
                      category
                    ][language],
                  )}

                  {active && (
                    <motion.span
                      layoutId="activeLehengaCategory"
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
                  filteredLehengas.length,
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
          LEHENGA GRID
      ===================================================== */}

      <section className="px-6 pb-24 sm:pb-28 lg:pb-32">

        <div className="page-container">

          {filteredLehengas.length > 0 ? (

            <motion.div
              layout
              className="
                grid
                grid-cols-1
                gap-x-5
                gap-y-14
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >

              {filteredLehengas.map(
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
                        to={`/${language}/lehengas/${item.slug}`}
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
                              index < 2
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

                          <div
                            className="
                              absolute
                              left-4
                              top-4
                              sm:left-5
                              sm:top-5
                            "
                          >

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
                            <div
                              className="
                                absolute
                                left-4
                                top-10
                                sm:left-5
                                sm:top-11
                              "
                            >

                              <span
                                className="
                                  border
                                  border-white/50
                                  bg-black/20
                                  px-2.5
                                  py-1.5
                                  text-[6px]
                                  uppercase
                                  tracking-[0.2em]
                                  text-white
                                  backdrop-blur-sm
                                "
                              >
                                {translate(
                                  "common.featured",
                                  fallback.featured,
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
                              sm:bottom-5
                              sm:right-5
                              sm:h-11
                              sm:w-11
                            "
                          >

                            <ArrowUpRight
                              size={15}
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

                      <div className="pt-4 sm:pt-5">

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                        >

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
                                mt-3
                                max-w-65
                                text-[10px]
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
                  {translate(
                    "lehengas.empty.eyebrow",
                    fallback.emptyEyebrow,
                  )}
                </p>

                <h2
                  className="
                    luxury-heading
                    mt-4
                    text-4xl
                  "
                >
                  {translate(
                    "lehengas.empty.title",
                    fallback.emptyTitle,
                  )}
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
                  {translate(
                    "lehengas.empty.viewAll",
                    fallback.viewAll,
                  )}
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

            {/* FIXED:
                Do NOT use text-white here because
                this section has a light background.
            */}

            <p className="eyebrow text-brown!">
              {translate(
                "lehengas.philosophy.eyebrow",
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
                text-ink!
              "
            >
              {translate(
                "lehengas.philosophy.title",
                fallback.philosophyTitle,
              )}
            </h2>

            <p
              className="
                editorial-copy
                mx-auto
                mt-6
                max-w-2xl
                text-black/55!
              "
            >
              {translate(
                "lehengas.philosophy.description",
                fallback.philosophyDescription,
              )}
            </p>

          </motion.div>

        </div>

      </section>

      {/* =====================================================
          APPOINTMENT CTA
          
          IMPORTANT FIX:
          
          Global .luxury-heading appears to be applying a dark
          color. Because this section is dark, we explicitly
          force the appointment heading to white using text-white!.
          
          This guarantees visibility regardless of the global
          luxury-heading CSS.
      ===================================================== */}

      <section
        className="
          bg-brown-dark
          px-6
          py-20
          sm:py-24
          lg:py-28
        "
      >

        <div className="page-container">

          <div
            className="
              flex
              flex-col
              gap-10
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* CTA CONTENT */}

            <motion.div
              className="max-w-3xl"
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
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >

              {/* CTA EYEBROW */}

              <p
                className="
                  eyebrow
                  text-[#D8C7B8]!
                "
              >
                {translate(
                  "lehengas.appointment.eyebrow",
                  fallback.appointmentEyebrow,
                )}
              </p>

              {/* CTA TITLE */}

              <h2
                className="
                  luxury-heading
                  mt-4
                  max-w-3xl
                  text-4xl
                  leading-[1.05]
                  text-white!
                  sm:text-5xl
                  md:text-6xl
                  lg:text-7xl
                "
              >
                {translate(
                  "lehengas.appointment.title",
                  fallback.appointmentTitle,
                )}
              </h2>

            </motion.div>

            {/* APPOINTMENT BUTTON */}

            <motion.div
              className="shrink-0"
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
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >

              <Link
                to={`/${language}/appointment`}
                className="
                  group
                  inline-flex
                  min-h-16
                  min-w-65
                  items-center
                  justify-between
                  gap-8
                  border
                  border-white/45
                  px-8
                  py-5
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-white!
                  transition-all
                  duration-500
                  hover:border-white
                  hover:bg-white
                  hover:text-ink!
                "
              >

                <span className="max-w-45">
                  {translate(
                    "common.bookAppointment",
                    fallback.appointmentButton,
                  )}
                </span>

                <ArrowUpRight
                  size={15}
                  strokeWidth={1.1}
                  className="
                    shrink-0
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

export default LehengasPage;