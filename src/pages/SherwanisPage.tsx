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
  | "ta"
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

   IMPORTANT:
   ------------------------------------------------------------
   Do NOT store customer-facing English text here.

   Titles and descriptions are translated below using:

   products.ivoryHeritage.*
   products.royalSand.*
   products.midnightEmbroidery.*
   products.champagneClassic.*
   products.regalIvory.*
   products.mochaTextured.*
   products.classicBeige.*
   products.royalCharcoal.*
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

   Used only if the corresponding JSON key is missing.
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

  groom: {
    en: "Groom",
    ta: "மணமகன்",
    fr: "Marié",
    de: "Bräutigam",
    it: "Sposo",
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
   PRODUCT TRANSLATION FALLBACKS
============================================================ */

const productFallbacks: Record<
  string,
  {
    title: Record<SupportedLanguage, string>;
    category: Record<SupportedLanguage, string>;
    description: Record<SupportedLanguage, string>;
  }
> = {
  ivoryHeritage: {
    title: {
      en: "Ivory Heritage",
      ta: "ஐவரி ஹெரிடேஜ்",
      fr: "Héritage Ivoire",
      de: "Elfenbein Heritage",
      it: "Eredità d'Avorio",
    },

    category: {
      en: "Groom",
      ta: "மணமகன்",
      fr: "Marié",
      de: "Bräutigam",
      it: "Sposo",
    },

    description: {
      en: "A refined expression of timeless elegance.",
      ta: "காலத்தால் அழியாத நேர்த்தியின் நுட்பமான வெளிப்பாடு.",
      fr: "Une expression raffinée d'une élégance intemporelle.",
      de: "Ein raffinierter Ausdruck zeitloser Eleganz.",
      it: "Una raffinata espressione di eleganza senza tempo.",
    },
  },

  royalSand: {
    title: {
      en: "Royal Sand",
      ta: "ராயல் சாண்ட்",
      fr: "Sable Royal",
      de: "Royal Sand",
      it: "Sabbia Reale",
    },

    category: {
      en: "Groom",
      ta: "மணமகன்",
      fr: "Marié",
      de: "Bräutigam",
      it: "Sposo",
    },

    description: {
      en: "Warm sand tones for sophisticated celebrations.",
      ta: "சிறப்பான விழாக்களுக்கான மென்மையான மணல் நிறத் தோற்றம்.",
      fr: "Des tons sable chaleureux pour des célébrations sophistiquées.",
      de: "Warme Sandtöne für stilvolle Feierlichkeiten.",
      it: "Calde tonalità sabbia per celebrazioni sofisticate.",
    },
  },

  midnightEmbroidery: {
    title: {
      en: "Midnight Embroidery",
      ta: "மிட்நைட் எம்பிராய்டரி",
      fr: "Broderie Bleu Nuit",
      de: "Mitternachtsstickerei",
      it: "Ricamo Mezzanotte",
    },

    category: {
      en: "Groom",
      ta: "மணமகன்",
      fr: "Marié",
      de: "Bräutigam",
      it: "Sposo",
    },

    description: {
      en: "Deep tones with considered embroidered detail.",
      ta: "நுட்பமான எம்பிராய்டரி அலங்காரத்துடன் கூடிய ஆழமான நிறங்கள்.",
      fr: "Des tons profonds rehaussés de détails brodés raffinés.",
      de: "Tiefe Farbtöne mit sorgfältig ausgearbeiteten Stickdetails.",
      it: "Tonalità profonde con raffinati dettagli ricamati.",
    },
  },

  champagneClassic: {
    title: {
      en: "Champagne Classic",
      ta: "சாம்பெயின் கிளாசிக்",
      fr: "Champagne Classique",
      de: "Champagner Klassik",
      it: "Champagne Classico",
    },

    category: {
      en: "Occasion",
      ta: "விழா",
      fr: "Cérémonie",
      de: "Anlass",
      it: "Occasione",
    },

    description: {
      en: "A warm champagne expression for elegant evenings.",
      ta: "நேர்த்தியான மாலை நிகழ்வுகளுக்கான மென்மையான சாம்பெயின் நிறத் தோற்றம்.",
      fr: "Une expression champagne chaleureuse pour les soirées élégantes.",
      de: "Ein warmer Champagnerton für elegante Abende.",
      it: "Una calda tonalità champagne per serate eleganti.",
    },
  },

  regalIvory: {
    title: {
      en: "Regal Ivory",
      ta: "ரீகல் ஐவரி",
      fr: "Ivoire Royal",
      de: "Königliches Elfenbein",
      it: "Avorio Regale",
    },

    category: {
      en: "Groom",
      ta: "மணமகன்",
      fr: "Marié",
      de: "Bräutigam",
      it: "Sposo",
    },

    description: {
      en: "Traditional detailing with contemporary refinement.",
      ta: "நவீன நேர்த்தியுடன் இணைந்த பாரம்பரிய அலங்காரம்.",
      fr: "Des détails traditionnels avec une sophistication contemporaine.",
      de: "Traditionelle Details mit zeitgemäßer Raffinesse.",
      it: "Dettagli tradizionali con raffinatezza contemporanea.",
    },
  },

  mochaTextured: {
    title: {
      en: "Mocha Textured",
      ta: "மோக்கா டெக்ஸ்சர்ட்",
      fr: "Texture Moka",
      de: "Mokka Textur",
      it: "Texture Moka",
    },

    category: {
      en: "Occasion",
      ta: "விழா",
      fr: "Cérémonie",
      de: "Anlass",
      it: "Occasione",
    },

    description: {
      en: "Rich mocha tones with understated texture.",
      ta: "நுட்பமான துணி அமைப்புடன் கூடிய செழுமையான மோக்கா நிறங்கள்.",
      fr: "Des tons moka riches avec une texture subtile.",
      de: "Satte Mokkatöne mit dezenter Textur.",
      it: "Ricche tonalità moka con una texture discreta.",
    },
  },

  classicBeige: {
    title: {
      en: "Classic Beige",
      ta: "கிளாசிக் பேஜ்",
      fr: "Beige Classique",
      de: "Klassisches Beige",
      it: "Beige Classico",
    },

    category: {
      en: "Occasion",
      ta: "விழா",
      fr: "Cérémonie",
      de: "Anlass",
      it: "Occasione",
    },

    description: {
      en: "Quietly luxurious tailoring for every occasion.",
      ta: "ஒவ்வொரு விழாவிற்கும் ஏற்ற அமைதியான ஆடம்பரத் தையல்.",
      fr: "Une coupe subtilement luxueuse pour chaque occasion.",
      de: "Dezent luxuriöse Schneiderkunst für jeden Anlass.",
      it: "Una sartoria discretamente lussuosa per ogni occasione.",
    },
  },

  royalCharcoal: {
    title: {
      en: "Royal Charcoal",
      ta: "ராயல் சார்கோல்",
      fr: "Charbon Royal",
      de: "Royal Anthrazit",
      it: "Carbone Reale",
    },

    category: {
      en: "Groom",
      ta: "மணமகன்",
      fr: "Marié",
      de: "Bräutigam",
      it: "Sposo",
    },

    description: {
      en: "A commanding silhouette for the modern groom.",
      ta: "நவீன மணமகனுக்காக உருவாக்கப்பட்ட கம்பீரமான தோற்றம்.",
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

  ta: {
    eyebrow: "முகூர்த்தம் ஷெர்வானி தொகுப்பு",
    title: "ஷெர்வானிகள்",
    description:
      "கைவினைத்திறன், தனித்துவம் மற்றும் காலத்தால் அழியாத நேர்த்திக்காகத் தேர்ந்தெடுக்கப்பட்ட சிறப்பான இந்திய ஷெர்வானிகளின் தொகுப்பு.",

    filter: "வடிகட்டி",
    sort: "வரிசைப்படுத்து",

    newest: "புதிய வரவுகள்",
    oldest: "பழையவை",
    featured: "சிறப்புத் தேர்வுகள்",

    pieces: "தயாரிப்புகள்",
    featuredBadge: "சிறப்புத் தேர்வு",
    view: "பார்க்க",

    philosophy: "முகூர்த்தம் தத்துவம்",
    philosophyTitle:
      "விழாவைத் தாண்டியும் நிலைத்திருக்கும் நேர்த்தி.",
    philosophyDescription:
      "ஒவ்வொரு ஆடையும் நுணுக்கம், அளவுத்தன்மை மற்றும் காலத்தால் அழியாத இந்திய கைவினைத்திறனை மதித்து தேர்ந்தெடுக்கப்படுகிறது — இன்று நேர்த்தியாகவும் நாளை நினைவாகவும் இருக்கும் ஒரு தொகுப்பை உருவாக்குகிறது.",

    appointmentEyebrow: "உங்கள் முகூர்த்தம்",
    appointmentTitle:
      "உங்கள் சிறப்பான தருணத்திற்காக உருவாக்கப்பட்ட ஆடையைத் தேர்ந்தெடுக்குங்கள்.",
    appointmentButton:
      "சந்திப்பு முன்பதிவு செய்யுங்கள்",

    emptyEyebrow: "தொகுப்பு",
    emptyTitle: "தயாரிப்புகள் எதுவும் இல்லை",
    viewAll: "அனைத்து ஷெர்வானிகளையும் பார்க்க",
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

function SherwanisPage() {
  const location = useLocation();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const { i18n } = useTranslation();

  /* ==========================================================
     LANGUAGE FROM URL

     /en/sherwanis → en
     /ta/sherwanis → ta
     /fr/sherwanis → fr
     /de/sherwanis → de
     /it/sherwanis → it
  ========================================================== */

  const language = resolveLanguage(
    location.pathname,
  );

  /* ==========================================================
     IMPORTANT TRANSLATION FIX

     getFixedT() forces this page to use the language
     from the URL.

     This prevents situations where:

     URL = /ta/sherwanis

     but i18next internally remains "en".
  ========================================================== */

  const fixedT =
    i18n.getFixedT(language);

  const fallback =
    pageFallbacks[language];

  /* ==========================================================
     SAFE TRANSLATION

     Never show:

     navigation.sherwanis
     products.ivoryHeritage.title

     on the actual page.
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
     CATEGORY FROM URL
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

              {/* =================================================
                  TITLE
              ================================================= */}

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

              {/* =================================================
                  FILTER + SORT
              ================================================= */}

              <div className="flex shrink-0 items-center gap-2">

                {/* FILTER */}

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

                {/* SORT */}

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

                  {/* SORT MENU */}

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

                      {/* NEWEST */}

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

                      {/* FEATURED */}

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

                      {/* OLDEST */}

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

            {/* ALL */}

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

            {/* PIECE COUNT */}

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

                  /* =================================================
                     PRODUCT NAME
                  ================================================= */

                  const productName =
                    translate(
                      `products.${item.translationKey}.title`,
                      product.title[
                        language
                      ],
                    );

                  /* =================================================
                     PRODUCT CATEGORY
                  ================================================= */

                  const productCategory =
                    translate(
                      `products.${item.translationKey}.category`,
                      product.category[
                        language
                      ],
                    );

                  /* =================================================
                     PRODUCT DESCRIPTION
                  ================================================= */

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

                      {/* =================================================
                          PRODUCT LINK
                      ================================================= */}

                      <Link
                        to={`/${language}/sherwanis/${item.slug}`}
                        className="block"
                        aria-label={
                          productName
                        }
                      >

                        {/* IMAGE */}

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

                          {/* OVERLAY */}

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

                          {/* NUMBER */}

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

                          {/* FEATURED */}

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

                          {/* HOVER ARROW */}

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

                      {/* =================================================
                          PRODUCT INFORMATION
                      ================================================= */}

                      <div className="pt-4">

                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            {/* CATEGORY */}

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

                            {/* PRODUCT NAME */}

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

                            {/* DESCRIPTION */}

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

                          {/* VIEW */}

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

                        {/* DIVIDER */}

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

            /* =================================================
               EMPTY STATE
            ================================================= */

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

            {/* PHILOSOPHY */}

            <p className="eyebrow text-brown">
              {translate(
                "sherwanis.philosophy.eyebrow",
                fallback.philosophy,
              )}
            </p>

            {/* TITLE */}

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

            {/* DESCRIPTION */}

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

          IMPORTANT:
          Everything here is now translated.
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

              {/* YOUR MUHURTHAM */}

              <p className="eyebrow text-brown">
                {translate(
                  "sherwanis.appointment.eyebrow",
                  fallback.appointmentEyebrow,
                )}
              </p>

              {/* CTA TITLE */}

              <h2
                className="
                  luxury-heading
                  mt-4
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
                  transition-all
                  duration-500
                  hover:bg-white
                  hover:text-ink
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