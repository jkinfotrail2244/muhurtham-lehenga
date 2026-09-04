import { ArrowUpRight } from "lucide-react";
import {
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

/* ============================================================
   SAREE DATA

   IMPORTANT:
   ------------------------------------------------------------
   Only permanent product data lives here.

   Customer-facing text MUST NOT be stored here.

   All text is loaded from the selected language JSON file.
============================================================ */

const sarees = [
  {
    slug: "royal-red",
    translationKey: "royalRed",
    category: "bridal",
    number: "01",
    image: "/images/saree-1.png",
  },
  {
    slug: "ivory-gold",
    translationKey: "ivoryGold",
    category: "bridal",
    number: "02",
    image: "/images/saree-2.png",
  },
  {
    slug: "blush-rose",
    translationKey: "blushRose",
    category: "occasion",
    number: "03",
    image: "/images/saree-3.png",
  },
  {
    slug: "emerald-grace",
    translationKey: "emeraldGrace",
    category: "occasion",
    number: "04",
    image: "/images/saree-4.png",
  },
  {
    slug: "champagne-drape",
    translationKey: "champagneDrape",
    category: "occasion",
    number: "05",
    image: "/images/saree-5.png",
  },
  {
    slug: "midnight-blue",
    translationKey: "midnightBlue",
    category: "occasion",
    number: "06",
    image: "/images/saree-6.png",
  },
] as const;

/* ============================================================
   TYPES
============================================================ */

type SareeCategory =
  | "all"
  | "bridal"
  | "occasion";

type SupportedLanguage =
  | "en"
  | "ta"
  | "fr"
  | "de"
  | "it";

/* ============================================================
   SUPPORTED LANGUAGES
============================================================ */

const supportedLanguages: SupportedLanguage[] = [
  "en",
  "ta",
  "fr",
  "de",
  "it",
];

/* ============================================================
   CATEGORY NAVIGATION
============================================================ */

const categories: {
  key: SareeCategory;
  translationKey: string;
  fallback: Record<
    SupportedLanguage,
    string
  >;
}[] = [
  {
    key: "all",
    translationKey:
      "sarees.categories.all",

    fallback: {
      en: "All",
      ta: "அனைத்தும்",
      fr: "Tous",
      de: "Alle",
      it: "Tutti",
    },
  },

  {
    key: "bridal",
    translationKey:
      "sarees.categories.bridal",

    fallback: {
      en: "Bridal",
      ta: "மணப்பெண் புடவை",
      fr: "Mariage",
      de: "Braut",
      it: "Sposa",
    },
  },

  {
    key: "occasion",
    translationKey:
      "sarees.categories.occasion",

    fallback: {
      en: "Occasion",
      ta: "விழா புடவை",
      fr: "Cérémonie",
      de: "Anlass",
      it: "Occasione",
    },
  },
];

/* ============================================================
   PRODUCT FALLBACK TRANSLATIONS
============================================================ */

const productFallbacks: Record<
  string,
  {
    title: Record<SupportedLanguage, string>;
    eyebrow: Record<SupportedLanguage, string>;
    color: Record<SupportedLanguage, string>;
    description: Record<
      SupportedLanguage,
      string
    >;
  }
> = {
  royalRed: {
    title: {
      en: "Royal Red",
      ta: "ராயல் ரெட்",
      fr: "Rouge Royal",
      de: "Königliches Rot",
      it: "Rosso Reale",
    },

    eyebrow: {
      en: "Bridal Saree",
      ta: "மணப்பெண் புடவை",
      fr: "Sari de mariage",
      de: "Braut-Sari",
      it: "Sari da sposa",
    },

    color: {
      en: "Rich Red",
      ta: "ஆழமான சிவப்பு",
      fr: "Rouge profond",
      de: "Tiefrot",
      it: "Rosso intenso",
    },

    description: {
      en: "A timeless bridal saree celebrating traditional Indian elegance.",
      ta: "பாரம்பரிய இந்திய நேர்த்தியை வெளிப்படுத்தும் காலத்தால் அழியாத மணப்பெண் புடவை.",
      fr: "Un sari de mariage intemporel célébrant l'élégance traditionnelle indienne.",
      de: "Ein zeitloser Braut-Sari, der traditionelle indische Eleganz zelebriert.",
      it: "Un sari da sposa senza tempo che celebra l'eleganza tradizionale indiana.",
    },
  },

  ivoryGold: {
    title: {
      en: "Ivory Gold",
      ta: "ஐவரி கோல்ட்",
      fr: "Ivoire Doré",
      de: "Elfenbein Gold",
      it: "Avorio Dorato",
    },

    eyebrow: {
      en: "Bridal Saree",
      ta: "மணப்பெண் புடவை",
      fr: "Sari de mariage",
      de: "Braut-Sari",
      it: "Sari da sposa",
    },

    color: {
      en: "Ivory Gold",
      ta: "ஐவரி தங்கம்",
      fr: "Ivoire doré",
      de: "Elfenbein Gold",
      it: "Avorio dorato",
    },

    description: {
      en: "An elegant ivory saree enriched with subtle golden detailing.",
      ta: "மென்மையான தங்க அலங்காரங்களால் சிறப்பிக்கப்பட்ட நேர்த்தியான ஐவரி புடவை.",
      fr: "Un sari ivoire élégant rehaussé de délicats détails dorés.",
      de: "Ein eleganter Elfenbein-Sari mit feinen goldenen Details.",
      it: "Un elegante sari avorio impreziosito da delicati dettagli dorati.",
    },
  },

  blushRose: {
    title: {
      en: "Blush Rose",
      ta: "ப்ளஷ் ரோஸ்",
      fr: "Rose Poudré",
      de: "Blush Rose",
      it: "Rosa Cipria",
    },

    eyebrow: {
      en: "Occasion Saree",
      ta: "விழா புடவை",
      fr: "Sari de cérémonie",
      de: "Sari für besondere Anlässe",
      it: "Sari da occasione",
    },

    color: {
      en: "Blush Rose",
      ta: "மென்மையான ரோஸ்",
      fr: "Rose poudré",
      de: "Blush Rose",
      it: "Rosa cipria",
    },

    description: {
      en: "A romantic saree combining delicate colour with refined detailing.",
      ta: "மென்மையான நிறத்தையும் நுட்பமான அலங்காரத்தையும் இணைக்கும் காதல் உணர்வுள்ள புடவை.",
      fr: "Un sari romantique associant une couleur délicate à des détails raffinés.",
      de: "Ein romantischer Sari mit zarter Farbgebung und raffinierten Details.",
      it: "Un romantico sari che combina colori delicati e dettagli raffinati.",
    },
  },

  emeraldGrace: {
    title: {
      en: "Emerald Grace",
      ta: "எமரால்ட் கிரேஸ்",
      fr: "Grâce Émeraude",
      de: "Smaragd Eleganz",
      it: "Grazia Smeraldo",
    },

    eyebrow: {
      en: "Occasion Saree",
      ta: "விழா புடவை",
      fr: "Sari de cérémonie",
      de: "Sari für besondere Anlässe",
      it: "Sari da occasione",
    },

    color: {
      en: "Emerald",
      ta: "மரகத பச்சை",
      fr: "Émeraude",
      de: "Smaragdgrün",
      it: "Smeraldo",
    },

    description: {
      en: "A rich emerald saree designed around graceful draping and craftsmanship.",
      ta: "நேர்த்தியான அணிதல் மற்றும் கைவினைத்திறனை மையமாகக் கொண்டு உருவாக்கப்பட்ட மரகத பச்சை புடவை.",
      fr: "Un sari émeraude riche conçu autour d'un drapé gracieux et d'un savoir-faire raffiné.",
      de: "Ein satter Smaragd-Sari, der auf anmutigem Drapieren und handwerklicher Kunst basiert.",
      it: "Un ricco sari color smeraldo progettato attorno a un drappeggio elegante e a una raffinata lavorazione artigianale.",
    },
  },

  champagneDrape: {
    title: {
      en: "Champagne Drape",
      ta: "சாம்பெயின் டிரேப்",
      fr: "Drapé Champagne",
      de: "Champagner Drapierung",
      it: "Drappeggio Champagne",
    },

    eyebrow: {
      en: "Occasion Saree",
      ta: "விழா புடவை",
      fr: "Sari de cérémonie",
      de: "Sari für besondere Anlässe",
      it: "Sari da occasione",
    },

    color: {
      en: "Champagne",
      ta: "சாம்பெயின்",
      fr: "Champagne",
      de: "Champagner",
      it: "Champagne",
    },

    description: {
      en: "A luminous champagne saree combining understated luxury and elegance.",
      ta: "அமைதியான ஆடம்பரத்தையும் நேர்த்தியையும் இணைக்கும் ஒளிரும் சாம்பெயின் புடவை.",
      fr: "Un sari champagne lumineux alliant luxe discret et élégance.",
      de: "Ein leuchtender Champagner-Sari, der dezente Luxusästhetik und Eleganz verbindet.",
      it: "Un luminoso sari champagne che combina lusso discreto ed eleganza.",
    },
  },

  midnightBlue: {
    title: {
      en: "Midnight Blue",
      ta: "மிட்நைட் ப்ளூ",
      fr: "Bleu Nuit",
      de: "Mitternachtsblau",
      it: "Blu Notte",
    },

    eyebrow: {
      en: "Occasion Saree",
      ta: "விழா புடவை",
      fr: "Sari de cérémonie",
      de: "Sari für besondere Anlässe",
      it: "Sari da occasione",
    },

    color: {
      en: "Midnight Blue",
      ta: "மிட்நைட் நீலம்",
      fr: "Bleu nuit",
      de: "Mitternachtsblau",
      it: "Blu notte",
    },

    description: {
      en: "A deep blue saree bringing dramatic colour to evening celebrations.",
      ta: "மாலை நேர விழாக்களுக்கு அழுத்தமான நிறத்தை வழங்கும் ஆழமான நீல புடவை.",
      fr: "Un sari bleu profond apportant une couleur saisissante aux célébrations du soir.",
      de: "Ein tiefblauer Sari, der Abendfeiern eine ausdrucksstarke Farbe verleiht.",
      it: "Un sari blu intenso che dona un tocco deciso alle celebrazioni serali.",
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
    pieces: string;
    viewDetails: string;
    appointmentEyebrow: string;
    appointmentTitle: string;
    appointmentButton: string;
    empty: string;
  }
> = {
  en: {
    eyebrow: "Muhurtham Collection",
    title: "Sarees",
    description:
      "Discover a refined selection of bridal and occasion sarees, celebrating graceful draping, timeless colour and Indian craftsmanship.",
    pieces: "Pieces",
    viewDetails: "View Details",
    appointmentEyebrow: "Your Muhurtham",
    appointmentTitle:
      "Find the piece made for your moment.",
    appointmentButton:
      "Book an Appointment",
    empty: "No pieces found",
  },

  ta: {
    eyebrow: "முகூர்த்தம் தொகுப்பு",
    title: "புடவைகள்",
    description:
      "பாரம்பரிய இந்திய கைவினைத்திறன், காலத்தால் அழியாத நிறங்கள் மற்றும் நேர்த்தியான அணிதலைக் கொண்ட மணப்பெண் மற்றும் விழா புடவைகளின் சிறப்பான தொகுப்பை கண்டறியுங்கள்.",
    pieces: "தயாரிப்புகள்",
    viewDetails: "விவரங்களைப் பார்க்க",
    appointmentEyebrow:
      "உங்கள் முகூர்த்தம்",
    appointmentTitle:
      "உங்கள் சிறப்பான தருணத்திற்காக உருவாக்கப்பட்ட புடவையைத் தேர்ந்தெடுக்குங்கள்.",
    appointmentButton:
      "சந்திப்பு முன்பதிவு செய்யுங்கள்",
    empty: "தயாரிப்புகள் எதுவும் இல்லை",
  },

  fr: {
    eyebrow: "Collection Muhurtham",
    title: "Saris",
    description:
      "Découvrez une sélection raffinée de saris de mariage et de cérémonie, célébrant le drapé élégant, les couleurs intemporelles et le savoir-faire indien.",
    pieces: "Pièces",
    viewDetails: "Voir les détails",
    appointmentEyebrow:
      "Votre Muhurtham",
    appointmentTitle:
      "Trouvez la pièce créée pour votre moment.",
    appointmentButton:
      "Prendre rendez-vous",
    empty: "Aucune pièce trouvée",
  },

  de: {
    eyebrow: "Muhurtham Kollektion",
    title: "Saris",
    description:
      "Entdecken Sie eine raffinierte Auswahl an Braut- und Anlass-Saris, die anmutige Drapierungen, zeitlose Farben und indische Handwerkskunst zelebrieren.",
    pieces: "Stücke",
    viewDetails: "Details ansehen",
    appointmentEyebrow:
      "Ihr Muhurtham",
    appointmentTitle:
      "Finden Sie das Stück, das für Ihren besonderen Moment geschaffen wurde.",
    appointmentButton:
      "Termin vereinbaren",
    empty: "Keine Stücke gefunden",
  },

  it: {
    eyebrow: "Collezione Muhurtham",
    title: "Sari",
    description:
      "Scoprite una raffinata selezione di sari da sposa e da occasione, celebrando drappeggi eleganti, colori senza tempo e l'artigianato indiano.",
    pieces: "Capi",
    viewDetails: "Vedi dettagli",
    appointmentEyebrow:
      "Il vostro Muhurtham",
    appointmentTitle:
      "Scoprite il capo creato per il vostro momento speciale.",
    appointmentButton:
      "Prenota un appuntamento",
    empty: "Nessun capo trovato",
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
    supportedLanguages.includes(
      firstSegment as SupportedLanguage,
    )
  ) {
    return firstSegment as SupportedLanguage;
  }

  return "en";
}

/* ============================================================
   PAGE
============================================================ */

function SareesPage() {
  const location = useLocation();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const { i18n } = useTranslation();

  const language = resolveLanguage(
    location.pathname,
  );

  /*
   * Fixed translator for the language in the URL.
   */
  const fixedT = i18n.getFixedT(language);

  /*
   * Page fallback for current language.
   */
  const fallback =
    pageFallbacks[language];

  /* ==========================================================
     SAFE TRANSLATION FUNCTION
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

  const activeCategory: SareeCategory =
    categoryFromUrl === "bridal" ||
    categoryFromUrl === "occasion"
      ? categoryFromUrl
      : "all";

  /* ==========================================================
     CATEGORY CHANGE
  ========================================================== */

  const handleCategoryChange = (
    category: SareeCategory,
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
     FILTER PRODUCTS
  ========================================================== */

  const filteredSarees =
    activeCategory === "all"
      ? sarees
      : sarees.filter(
          (saree) =>
            saree.category ===
            activeCategory,
        );

  /* ==========================================================
     PAGE TRANSLATIONS
  ========================================================== */

  const pageEyebrow = translate(
    "sarees.eyebrow",
    fallback.eyebrow,
  );

  const pageTitle = translate(
    "sarees.title",
    fallback.title,
  );

  const pageDescription = translate(
    "sarees.description",
    fallback.description,
  );

  const piecesLabel = translate(
    "common.pieces",
    fallback.pieces,
  );

  const viewDetailsLabel =
    translate(
      "common.viewDetails",
      fallback.viewDetails,
    );

  /* ==========================================================
     APPOINTMENT TRANSLATIONS
  ========================================================== */

  const appointmentEyebrow =
    translate(
      "sarees.appointment.eyebrow",
      fallback.appointmentEyebrow,
    );

  const appointmentTitle =
    translate(
      "sarees.appointment.title",
      fallback.appointmentTitle,
    );

  const appointmentButton =
    translate(
      "common.bookAppointment",
      fallback.appointmentButton,
    );

  const emptyLabel = translate(
    "sarees.empty",
    fallback.empty,
  );

  return (
    <main className="min-h-screen bg-ivory text-ink">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="border-b border-black/6">

        <div
          className="
            mx-auto
            max-w-375
            px-6
            pb-16
            pt-16
            sm:px-10
            sm:pb-20
            sm:pt-20
            lg:px-16
            lg:pb-24
            lg:pt-24
          "
        >

          <motion.div
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="max-w-4xl"
          >

            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.38em]
                text-brown
              "
            >
              {pageEyebrow}
            </p>

            <h1
              className="
                mt-5
                font-display
                text-5xl
                leading-[0.95]
                tracking-[-0.03em]
                sm:text-6xl
                lg:text-8xl
              "
            >
              {pageTitle}
            </h1>

            <div
              className="
                mt-7
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  h-px
                  w-16
                  bg-brown
                "
              />

              <span
                className="
                  h-2
                  w-2
                  rotate-45
                  border
                  border-brown
                "
              />

              <span
                className="
                  h-px
                  w-16
                  bg-brown
                "
              />

            </div>

            <p
              className="
                mt-7
                max-w-2xl
                text-sm
                leading-7
                text-black/55
                sm:text-base
              "
            >
              {pageDescription}
            </p>

          </motion.div>

        </div>

      </section>

      {/* ======================================================
          CATEGORY BAR
      ====================================================== */}

      <section className="border-b border-black/6">

        <div
          className="
            mx-auto
            flex
            max-w-375
            items-center
            justify-between
            px-6
            py-5
            sm:px-10
            lg:px-16
          "
        >

          <div
            className="
              flex
              items-center
              gap-8
              sm:gap-12
            "
          >

            <p
              className="
                whitespace-nowrap
                text-[9px]
                uppercase
                tracking-[0.22em]
                text-black/45
              "
            >
              {String(
                filteredSarees.length,
              ).padStart(2, "0")}{" "}
              {piecesLabel}
            </p>

            <div
              className="
                flex
                items-center
                gap-7
                sm:gap-9
              "
            >

              {categories.map(
                (category) => {
                  const isActive =
                    activeCategory ===
                    category.key;

                  return (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          category.key,
                        )
                      }
                      className={`
                        group
                        relative
                        py-2
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.2em]
                        transition-colors
                        duration-300
                        ${
                          isActive
                            ? "text-brown"
                            : "text-black/45 hover:text-black/75"
                        }
                      `}
                    >

                      {translate(
                        category.translationKey,
                        category.fallback[
                          language
                        ],
                      )}

                      <span
                        className={`
                          absolute
                          bottom-0
                          left-0
                          h-px
                          bg-brown
                          transition-all
                          duration-300
                          ${
                            isActive
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }
                        `}
                      />

                    </button>
                  );
                },
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          PRODUCT GRID
      ====================================================== */}

      <section
        className="
          mx-auto
          max-w-375
          px-5
          py-12
          sm:px-8
          sm:py-16
          lg:px-12
          lg:py-20
        "
      >

        <motion.div
          layout
          className="
            grid
            grid-cols-1
            gap-x-5
            gap-y-12
            sm:grid-cols-2
            lg:grid-cols-4
            lg:gap-x-6
            lg:gap-y-16
          "
        >

          {filteredSarees.map(
            (saree, index) => {

              const product =
                productFallbacks[
                  saree.translationKey
                ];

              const productName =
                translate(
                  `products.${saree.translationKey}.title`,
                  product.title[
                    language
                  ],
                );

              const productEyebrow =
                translate(
                  `products.${saree.translationKey}.eyebrow`,
                  product.eyebrow[
                    language
                  ],
                );

              const productColor =
                translate(
                  `products.${saree.translationKey}.color`,
                  product.color[
                    language
                  ],
                );

              const productDescription =
                translate(
                  `products.${saree.translationKey}.description`,
                  product.description[
                    language
                  ],
                );

              return (
                <motion.div
                  layout
                  key={saree.slug}
                  initial={{
                    opacity: 0,
                    y: 45,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: Math.min(
                      index * 0.06,
                      0.35,
                    ),
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                >

                  <Link
                    to={`/${language}/sarees/${saree.slug}`}
                    className="group block"
                  >

                    <div
                      className="
                        relative
                        aspect-3/4
                        overflow-hidden
                        bg-[#E9E2D8]
                      "
                    >

                      <img
                        src={saree.image}
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
                          object-center
                          transition-transform
                          duration-1000
                          ease-out
                          group-hover:scale-[1.035]
                        "
                      />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-linear-to-t
                          from-black/20
                          via-transparent
                          to-transparent
                          opacity-70
                          transition-opacity
                          duration-700
                          group-hover:opacity-90
                        "
                      />

                      <div
                        className="
                          absolute
                          left-4
                          top-4
                        "
                      >

                        <span
                          className="
                            text-[8px]
                            font-medium
                            tracking-[0.18em]
                            text-white
                            drop-shadow-sm
                          "
                        >
                          {saree.number}
                        </span>

                      </div>

                      <div
                        className="
                          absolute
                          right-4
                          top-4
                        "
                      >

                        <span
                          className="
                            rounded-sm
                            bg-white/90
                            px-3
                            py-1.5
                            text-[7px]
                            font-medium
                            uppercase
                            tracking-[0.16em]
                            text-black/65
                            backdrop-blur-sm
                          "
                        >
                          {productEyebrow}
                        </span>

                      </div>

                      <div
                        className="
                          absolute
                          bottom-4
                          right-4
                        "
                      >

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            translate-y-2
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-ink
                            opacity-0
                            shadow-lg
                            transition-all
                            duration-500
                            group-hover:translate-y-0
                            group-hover:opacity-100
                          "
                        >

                          <ArrowUpRight
                            size={17}
                            strokeWidth={1}
                            className="
                              transition-transform
                              duration-500
                              group-hover:translate-x-0.5
                              group-hover:-translate-y-0.5
                            "
                          />

                        </div>

                      </div>

                    </div>

                    <div className="px-1 pt-5">

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >

                        <div>

                          <p
                            className="
                              text-[8px]
                              font-medium
                              uppercase
                              tracking-[0.25em]
                              text-brown
                            "
                          >
                            {productEyebrow}
                          </p>

                          <h2
                            className="
                              mt-2
                              font-display
                              text-[23px]
                              leading-none
                              tracking-[-0.015em]
                              text-ink
                              transition-colors
                              duration-300
                              group-hover:text-brown
                            "
                          >
                            {productName}
                          </h2>

                        </div>

                        <span
                          className="
                            pt-1
                            text-[8px]
                            uppercase
                            tracking-[0.15em]
                            text-black/30
                          "
                        >
                          {saree.number}
                        </span>

                      </div>

                      <p
                        className="
                          mt-3
                          max-w-xs
                          text-[11px]
                          leading-5
                          text-black/45
                        "
                      >
                        {productDescription}
                      </p>

                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          border-t
                          border-black/7
                          pt-3
                        "
                      >

                        <span
                          className="
                            text-[8px]
                            uppercase
                            tracking-[0.17em]
                            text-black/35
                          "
                        >
                          {productColor}
                        </span>

                        <span
                          className="
                            flex
                            items-center
                            gap-2
                            text-[8px]
                            font-medium
                            uppercase
                            tracking-[0.16em]
                            text-black/55
                            transition-colors
                            duration-300
                            group-hover:text-brown
                          "
                        >

                          {viewDetailsLabel}

                          <ArrowUpRight
                            size={12}
                            strokeWidth={1}
                            className="
                              transition-transform
                              duration-300
                              group-hover:translate-x-0.5
                              group-hover:-translate-y-0.5
                            "
                          />

                        </span>

                      </div>

                    </div>

                  </Link>

                </motion.div>
              );
            },
          )}

        </motion.div>

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {filteredSarees.length === 0 && (
          <div
            className="
              flex
              min-h-50
              items-center
              justify-center
              text-center
            "
          >

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              {emptyLabel}
            </p>

          </div>
        )}

      </section>

      {/* ======================================================
          APPOINTMENT CTA

          COLOR FIX:
          ------------------------------------------------------
          The global `.luxury-heading` class was overriding
          the heading color.

          We explicitly force:
          - Eyebrow = warm beige
          - Heading = white
          - Button = white

          This prevents the dark-on-dark issue shown in
          the screenshot.
      ====================================================== */}

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

            {/* ==================================================
                APPOINTMENT TEXT
            ================================================== */}

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
                {appointmentEyebrow}
              </p>

              {/* ==================================================
                  TITLE

                  IMPORTANT:
                  text-white! overrides the global luxury-heading
                  color so the title remains clearly visible.
              ================================================== */}

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
                "
              >
                {appointmentTitle}
              </h2>

            </motion.div>

            {/* ==================================================
                APPOINTMENT BUTTON
            ================================================== */}

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

                {appointmentButton}

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

export default SareesPage;