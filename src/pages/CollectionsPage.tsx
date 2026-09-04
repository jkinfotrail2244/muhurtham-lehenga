import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* =========================================================
   TYPES
========================================================= */

type SupportedLanguage =
  | "en"
  | "ta"
  | "fr"
  | "de"
  | "it";

type MainCollectionKey =
  | "lehengas"
  | "sherwanis"
  | "sarees";

type CategoryCollectionKey =
  | "bridalLehengas"
  | "occasionLehengas"
  | "groomSherwanis"
  | "occasionSherwanis"
  | "bridalSarees";

type MainCollection = {
  number: string;
  translationKey: MainCollectionKey;
  image: string;
  path: string;
};

type CategoryCollection = {
  number: string;
  translationKey: CategoryCollectionKey;
  image: string;
  path: string;
};

/* =========================================================
   MAIN COLLECTIONS

   IMPORTANT:
   Do NOT put translated customer-facing text here.

   We use translationKey and translate the visible text
   according to the language in the URL.
========================================================= */

const mainCollections: MainCollection[] = [
  {
    number: "01",
    translationKey: "lehengas",
    image: "/images/collectionpage2.png",
    path: "lehengas",
  },

  {
    number: "02",
    translationKey: "sherwanis",
    image: "/images/collectionpage3.png",
    path: "sherwanis",
  },

  {
    number: "03",
    translationKey: "sarees",
    image: "/images/saree-collection.png",
    path: "sarees",
  },
];

/* =========================================================
   CURATED CATEGORIES
========================================================= */

const categoryCollections: CategoryCollection[] = [
  {
    number: "01",
    translationKey: "bridalLehengas",
    image: "/images/collection4.png",
    path: "lehengas/bridal",
  },

  {
    number: "02",
    translationKey: "occasionLehengas",
    image: "/images/collection5.png",
    path: "lehengas/occasion",
  },

  {
    number: "03",
    translationKey: "groomSherwanis",
    image: "/images/collection6.png",
    path: "sherwanis/groom",
  },

  {
    number: "04",
    translationKey: "occasionSherwanis",
    image: "/images/collection7.png",
    path: "sherwanis/occasion",
  },

  {
    number: "05",
    translationKey: "bridalSarees",
    image: "/images/saree-bridal.png",
    path: "sarees/bridal",
  },
];

/* =========================================================
   LANGUAGE RESOLVER
========================================================= */

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

/* =========================================================
   PAGE FALLBACK TRANSLATIONS

   These make the page safe even if a translation key is
   missing from one of your JSON files.
========================================================= */

const pageFallbacks: Record<
  SupportedLanguage,
  {
    eyebrow: string;
    title: string;
    description: string;
    exploreCollections: string;

    curatedEyebrow: string;
    curatedTitle: string;

    main: Record<
      MainCollectionKey,
      {
        title: string;
        description: string;
      }
    >;

    categories: Record<
      CategoryCollectionKey,
      string
    >;

    explore: string;

    appointmentEyebrow: string;
    appointmentTitle: string;
    appointmentButton: string;
  }
> = {
  /* =======================================================
     ENGLISH
  ======================================================= */

  en: {
    eyebrow: "Muhurtham Collection",

    title: "Collections",

    description:
      "A curated edit of Indian occasionwear, where timeless tradition meets contemporary elegance.",

    exploreCollections:
      "Explore Collections",

    curatedEyebrow:
      "Curated Categories",

    curatedTitle:
      "Explore Every Occasion",

    main: {
      lehengas: {
        title: "Lehengas",

        description:
          "Timeless silhouettes, intricate embroidery and refined craftsmanship for every unforgettable celebration.",
      },

      sherwanis: {
        title: "Sherwanis",

        description:
          "Refined ceremonial tailoring, detailed craftsmanship and sophisticated styles for the modern groom.",
      },

      sarees: {
        title: "Sarees",

        description:
          "Elegant drapes, luxurious fabrics and timeless Indian craftsmanship for weddings and unforgettable celebrations.",
      },
    },

    categories: {
      bridalLehengas:
        "Bridal Lehengas",

      occasionLehengas:
        "Occasion Lehengas",

      groomSherwanis:
        "Groom Sherwanis",

      occasionSherwanis:
        "Occasion Sherwanis",

      bridalSarees:
        "Bridal Sarees",
    },

    explore: "Explore",

    appointmentEyebrow:
      "Your Muhurtham",

    appointmentTitle:
      "Find the piece made for your moment.",

    appointmentButton:
      "Book an Appointment",
  },

  /* =======================================================
     TAMIL
  ======================================================= */

  ta: {
    eyebrow:
      "முகூர்த்தம் ஆடைத் தொகுப்பு",

    title:
      "ஆடைத் தொகுப்புகள்",

    description:
      "காலத்தால் அழியாத பாரம்பரியத்தையும் நவீன நேர்த்தியையும் இணைக்கும் இந்திய விழாக்கால ஆடைகளின் சிறப்பாகத் தேர்ந்தெடுக்கப்பட்ட தொகுப்பு.",

    exploreCollections:
      "தொகுப்புகளைப் பார்க்க",

    curatedEyebrow:
      "தேர்ந்தெடுக்கப்பட்ட வகைகள்",

    curatedTitle:
      "ஒவ்வொரு விழாவிற்கும் பார்க்க",

    main: {
      lehengas: {
        title: "லெஹங்காக்கள்",

        description:
          "மறக்க முடியாத ஒவ்வொரு கொண்டாட்டத்திற்கும் காலத்தால் அழியாத வடிவங்கள், நுணுக்கமான எம்பிராய்டரி மற்றும் சிறந்த கைவினைத்திறன்.",
      },

      sherwanis: {
        title: "ஷெர்வானிகள்",

        description:
          "நவீன மணமகனுக்காக நேர்த்தியான பாரம்பரிய தையல், நுணுக்கமான கைவினைத்திறன் மற்றும் உயர்ந்த பாணியுடன் உருவாக்கப்பட்டவை.",
      },

      sarees: {
        title: "புடவைகள்",

        description:
          "திருமணங்கள் மற்றும் மறக்க முடியாத கொண்டாட்டங்களுக்காக நேர்த்தியான அணிதல், ஆடம்பரமான துணிகள் மற்றும் காலத்தால் அழியாத இந்திய கைவினைத்திறன்.",
      },
    },

    categories: {
      bridalLehengas:
        "மணமகள் லெஹங்காக்கள்",

      occasionLehengas:
        "விழா லெஹங்காக்கள்",

      groomSherwanis:
        "மணமகன் ஷெர்வானிகள்",

      occasionSherwanis:
        "விழா ஷெர்வானிகள்",

      bridalSarees:
        "மணமகள் புடவைகள்",
    },

    explore:
      "பார்க்க",

    appointmentEyebrow:
      "உங்கள் முகூர்த்தம்",

    appointmentTitle:
      "உங்கள் சிறப்பான தருணத்திற்காக உருவாக்கப்பட்ட ஆடையைத் தேர்ந்தெடுக்குங்கள்.",

    appointmentButton:
      "சந்திப்பு முன்பதிவு செய்யுங்கள்",
  },

  /* =======================================================
     FRENCH
  ======================================================= */

  fr: {
    eyebrow:
      "Collection Muhurtham",

    title:
      "Collections",

    description:
      "Une sélection raffinée de tenues indiennes de cérémonie, où la tradition intemporelle rencontre l'élégance contemporaine.",

    exploreCollections:
      "Découvrir les collections",

    curatedEyebrow:
      "Catégories sélectionnées",

    curatedTitle:
      "Découvrez chaque occasion",

    main: {
      lehengas: {
        title: "Lehengas",

        description:
          "Des silhouettes intemporelles, des broderies raffinées et un savoir-faire exceptionnel pour chaque célébration inoubliable.",
      },

      sherwanis: {
        title: "Sherwanis",

        description:
          "Une confection cérémonielle raffinée, un savoir-faire minutieux et des styles sophistiqués pour le marié moderne.",
      },

      sarees: {
        title: "Saris",

        description:
          "Des drapés élégants, des tissus luxueux et un savoir-faire indien intemporel pour les mariages et les célébrations inoubliables.",
      },
    },

    categories: {
      bridalLehengas:
        "Lehengas de mariée",

      occasionLehengas:
        "Lehengas de cérémonie",

      groomSherwanis:
        "Sherwanis du marié",

      occasionSherwanis:
        "Sherwanis de cérémonie",

      bridalSarees:
        "Saris de mariée",
    },

    explore:
      "Découvrir",

    appointmentEyebrow:
      "Votre Muhurtham",

    appointmentTitle:
      "Trouvez la pièce créée pour votre moment.",

    appointmentButton:
      "Prendre rendez-vous",
  },

  /* =======================================================
     GERMAN
  ======================================================= */

  de: {
    eyebrow:
      "Muhurtham Kollektion",

    title:
      "Kollektionen",

    description:
      "Eine ausgewählte Kollektion indischer Anlassmode, in der zeitlose Tradition auf moderne Eleganz trifft.",

    exploreCollections:
      "Kollektionen entdecken",

    curatedEyebrow:
      "Ausgewählte Kategorien",

    curatedTitle:
      "Entdecken Sie jeden Anlass",

    main: {
      lehengas: {
        title: "Lehengas",

        description:
          "Zeitlose Silhouetten, kunstvolle Stickereien und feinste Handwerkskunst für jede unvergessliche Feier.",
      },

      sherwanis: {
        title: "Sherwanis",

        description:
          "Elegante festliche Schneiderei, feinste Handwerkskunst und anspruchsvolle Designs für den modernen Bräutigam.",
      },

      sarees: {
        title: "Saris",

        description:
          "Elegante Drapierungen, luxuriöse Stoffe und zeitlose indische Handwerkskunst für Hochzeiten und unvergessliche Feiern.",
      },
    },

    categories: {
      bridalLehengas:
        "Braut-Lehengas",

      occasionLehengas:
        "Anlass-Lehengas",

      groomSherwanis:
        "Sherwanis für den Bräutigam",

      occasionSherwanis:
        "Anlass-Sherwanis",

      bridalSarees:
        "Braut-Saris",
    },

    explore:
      "Entdecken",

    appointmentEyebrow:
      "Ihr Muhurtham",

    appointmentTitle:
      "Finden Sie das Stück, das für Ihren Moment geschaffen wurde.",

    appointmentButton:
      "Termin vereinbaren",
  },

  /* =======================================================
     ITALIAN
  ======================================================= */

  it: {
    eyebrow:
      "Collezione Muhurtham",

    title:
      "Collezioni",

    description:
      "Una selezione raffinata di abiti indiani da cerimonia, dove la tradizione senza tempo incontra l'eleganza contemporanea.",

    exploreCollections:
      "Scopri le collezioni",

    curatedEyebrow:
      "Categorie selezionate",

    curatedTitle:
      "Scopri ogni occasione",

    main: {
      lehengas: {
        title: "Lehenga",

        description:
          "Silhouette senza tempo, ricami raffinati e artigianalità d'eccellenza per ogni celebrazione indimenticabile.",
      },

      sherwanis: {
        title: "Sherwani",

        description:
          "Sartoria cerimoniale raffinata, lavorazione artigianale e stile sofisticato per lo sposo moderno.",
      },

      sarees: {
        title: "Sari",

        description:
          "Drappeggi eleganti, tessuti lussuosi e artigianalità indiana senza tempo per matrimoni e celebrazioni indimenticabili.",
      },
    },

    categories: {
      bridalLehengas:
        "Lehenga da sposa",

      occasionLehengas:
        "Lehenga da cerimonia",

      groomSherwanis:
        "Sherwani dello sposo",

      occasionSherwanis:
        "Sherwani da cerimonia",

      bridalSarees:
        "Sari da sposa",
    },

    explore:
      "Scopri",

    appointmentEyebrow:
      "Il vostro Muhurtham",

    appointmentTitle:
      "Scoprite il capo creato per il vostro momento.",

    appointmentButton:
      "Prenota un appuntamento",
  },
};

/* =========================================================
   PAGE
========================================================= */

function CollectionsPage() {
  const location = useLocation();

  const { i18n } = useTranslation();

  /* ========================================================
     LANGUAGE FROM URL
  ======================================================== */

  const language = resolveLanguage(
    location.pathname,
  );

  /* ========================================================
     FIXED TRANSLATOR

     This ensures:

     /ta/collections -> Tamil
     /fr/collections -> French
     /de/collections -> German
     /it/collections -> Italian
     /en/collections -> English

     regardless of the global i18next state.
  ======================================================== */

  const fixedT =
    i18n.getFixedT(language);

  const fallback =
    pageFallbacks[language];

  /* ========================================================
     SAFE TRANSLATION

     First checks i18next JSON.

     If a key is missing, uses the correct language
     fallback instead of showing English.
  ======================================================== */

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

  /* ========================================================
     LANGUAGE-AWARE PATH
  ======================================================== */

  const getPath = (path: string) =>
    `/${language}/${path}`;

  return (
    <main className="min-h-screen bg-ivory text-ink">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-black/6
        "
      >

        <div
          className="
            grid
            min-h-107.5
            lg:min-h-117.5
            lg:grid-cols-2
          "
        >

          {/* =================================================
              HERO CONTENT
          ================================================= */}

          <div
            className="
              flex
              items-center
              px-8
              py-20
              sm:px-12
              lg:px-16
              xl:px-24
            "
          >

            <motion.div
              className="max-w-xl"
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

              {/* HERO EYEBROW */}

              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.3em]
                  text-brown
                "
              >
                {translate(
                  "collections.eyebrow",
                  fallback.eyebrow,
                )}
              </p>

              {/* HERO TITLE */}

              <h1
                className="
                  luxury-heading
                  mt-5
                  text-6xl
                  leading-[0.95]
                  sm:text-7xl
                  lg:text-8xl
                "
              >
                {translate(
                  "collections.title",
                  fallback.title,
                )}
              </h1>

              {/* DECORATIVE DIVIDER */}

              <div className="mt-7 flex items-center gap-3">

                <span
                  className="
                    h-px
                    w-16
                    bg-brown/60
                  "
                />

                <span
                  className="
                    h-2
                    w-2
                    rotate-45
                    border
                    border-brown/70
                  "
                />

                <span
                  className="
                    h-px
                    w-10
                    bg-brown/60
                  "
                />

              </div>

              {/* HERO DESCRIPTION */}

              <p
                className="
                  mt-7
                  max-w-md
                  font-serif
                  text-sm
                  leading-6
                  text-black/60
                  sm:text-base
                "
              >
                {translate(
                  "collections.description",
                  fallback.description,
                )}
              </p>

              {/* HERO BUTTON */}

              <Link
                to={getPath("collections")}
                className="
                  group
                  mt-8
                  inline-flex
                  items-center
                  gap-5
                  border
                  border-ink
                  px-6
                  py-3.5
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  transition-all
                  duration-500
                  hover:bg-ink
                  hover:text-white
                "
              >

                {translate(
                  "collections.exploreCollections",
                  fallback.exploreCollections,
                )}

                <ArrowUpRight
                  size={14}
                  strokeWidth={1}
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

          {/* =================================================
              HERO IMAGE
          ================================================= */}

          <motion.div
            className="
              relative
              min-h-82.5
              overflow-hidden
              lg:min-h-0
            "
            initial={{
              opacity: 0,
              scale: 1.025,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.2,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            <img
              src="/images/collectionpage1.png"
              alt={translate(
                "collections.title",
                fallback.title,
              )}
              className="
                h-full
                w-full
                object-cover
                object-[68%_center]
                transition-transform
                duration-1400
                ease-out
                hover:scale-[1.015]
              "
            />

            {/* SOFT LUXURY OVERLAY */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-linear-to-r
                from-ivory/15
                via-transparent
                to-black/5
              "
            />

          </motion.div>

        </div>

      </section>

      {/* =====================================================
          MAIN COLLECTIONS
      ===================================================== */}

      <section
        className="
          page-container
          py-5
          sm:py-8
          lg:py-12
        "
      >

        <div
          className="
            grid
            gap-5
            lg:grid-cols-2
          "
        >

          {mainCollections.map(
            (collection, index) => {

              const collectionData =
                fallback.main[
                  collection.translationKey
                ];

              const title =
                translate(
                  `collections.main.${collection.translationKey}.title`,
                  collectionData.title,
                );

              const description =
                translate(
                  `collections.main.${collection.translationKey}.description`,
                  collectionData.description,
                );

              return (
                <motion.div
                  key={collection.number}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.08,
                  }}
                >

                  <Link
                    to={getPath(
                      collection.path,
                    )}
                    className="group block"
                  >

                    <article
                      className="
                        relative
                        overflow-hidden
                        rounded-sm
                        border
                        border-black/6
                        bg-[#f4eee6]
                        shadow-[0_4px_18px_rgba(0,0,0,0.04)]
                      "
                    >

                      <div
                        className="
                          relative
                          min-h-62.5
                          overflow-hidden
                          sm:min-h-70
                          lg:min-h-75
                        "
                      >

                        {/* IMAGE */}

                        <img
                          src={collection.image}
                          alt={title}
                          loading={
                            index < 2
                              ? "eager"
                              : "lazy"
                          }
                          className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            object-[center_30%]
                            transition-transform
                            duration-1400
                            ease-out
                            group-hover:scale-[1.035]
                          "
                        />

                        {/* SOFT FADE */}

                        <div
                          className="
                            absolute
                            inset-0
                            bg-linear-to-r
                            from-[#f8f4ee]/95
                            via-[#f8f4ee]/65
                            to-transparent
                          "
                        />

                        {/* NUMBER */}

                        <div
                          className="
                            absolute
                            left-7
                            top-6
                          "
                        >

                          <span
                            className="
                              text-[8px]
                              font-medium
                              tracking-[0.18em]
                              text-ink
                            "
                          >
                            {collection.number}
                          </span>

                          <div
                            className="
                              mt-3
                              h-px
                              w-7
                              bg-brown/70
                            "
                          />

                        </div>

                        {/* CONTENT */}

                        <div
                          className="
                            absolute
                            inset-y-0
                            left-0
                            flex
                            w-[58%]
                            flex-col
                            justify-center
                            px-7
                            py-8
                            sm:w-[52%]
                            sm:px-9
                          "
                        >

                          {/* COLLECTION TITLE */}

                          <h2
                            className="
                              font-display
                              text-3xl
                              leading-tight
                              sm:text-4xl
                            "
                          >
                            {title}
                          </h2>

                          {/* COLLECTION DESCRIPTION */}

                          <p
                            className="
                              mt-4
                              max-w-xs
                              text-[10px]
                              leading-5
                              text-black/60
                              sm:text-[11px]
                            "
                          >
                            {description}
                          </p>

                          {/* EXPLORE */}

                          <div
                            className="
                              mt-6
                              flex
                              items-center
                              gap-3
                              text-[8px]
                              font-medium
                              uppercase
                              tracking-[0.24em]
                            "
                          >

                            <span>
                              {translate(
                                "collections.explore",
                                fallback.explore,
                              )}{" "}
                              {title}
                            </span>

                            <ArrowUpRight
                              size={13}
                              strokeWidth={1}
                              className="
                                transition-transform
                                duration-500
                                group-hover:translate-x-1
                                group-hover:-translate-y-1
                              "
                            />

                          </div>

                        </div>

                      </div>

                    </article>

                  </Link>

                </motion.div>
              );
            },
          )}

        </div>

      </section>

      {/* =====================================================
          CURATED CATEGORIES
      ===================================================== */}

      <section
        className="
          page-container
          pb-20
          pt-8
          sm:pb-24
          lg:pb-28
        "
      >

        {/* =================================================
            HEADING
        ================================================= */}

        <motion.div
          className="mb-8 text-center"
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
          }}
        >

          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-brown
            "
          >
            {translate(
              "collections.curated.eyebrow",
              fallback.curatedEyebrow,
            )}
          </p>

          <h2
            className="
              luxury-heading
              mt-3
              text-3xl
              sm:text-4xl
              lg:text-5xl
            "
          >
            {translate(
              "collections.curated.title",
              fallback.curatedTitle,
            )}
          </h2>

          {/* DIVIDER */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-3
            "
          >

            <span
              className="
                h-px
                w-10
                bg-brown/50
              "
            />

            <span
              className="
                h-2
                w-2
                rotate-45
                border
                border-brown/60
              "
            />

            <span
              className="
                h-px
                w-10
                bg-brown/50
              "
            />

          </div>

        </motion.div>

        {/* =================================================
            CATEGORY CARDS
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {categoryCollections.map(
            (collection, index) => {

              const title =
                translate(
                  `collections.categories.${collection.translationKey}`,
                  fallback.categories[
                    collection.translationKey
                  ],
                );

              return (
                <motion.div
                  key={collection.number}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.06,
                  }}
                >

                  <Link
                    to={getPath(
                      collection.path,
                    )}
                    className="group block"
                  >

                    <article
                      className="
                        relative
                        overflow-hidden
                        rounded-sm
                        border
                        border-black/6
                        bg-[#f4eee6]
                        shadow-[0_4px_16px_rgba(0,0,0,0.035)]
                      "
                    >

                      <div
                        className="
                          relative
                          aspect-3/4
                          overflow-hidden
                        "
                      >

                        {/* IMAGE */}

                        <img
                          src={collection.image}
                          alt={title}
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-1200
                            ease-out
                            group-hover:scale-[1.045]
                          "
                        />

                        {/* EDITORIAL OVERLAY */}

                        <div
                          className="
                            absolute
                            inset-0
                            bg-linear-to-r
                            from-[#f8f4ee]/92
                            via-[#f8f4ee]/35
                            to-transparent
                          "
                        />

                        {/* NUMBER */}

                        <div
                          className="
                            absolute
                            left-5
                            top-5
                          "
                        >

                          <span
                            className="
                              text-[8px]
                              font-medium
                              tracking-[0.18em]
                              text-ink
                            "
                          >
                            {collection.number}
                          </span>

                          <div
                            className="
                              mt-3
                              h-px
                              w-7
                              bg-brown/65
                            "
                          />

                        </div>

                        {/* ARROW */}

                        <div
                          className="
                            absolute
                            bottom-5
                            left-5
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-black/15
                            bg-white/75
                            opacity-0
                            backdrop-blur-sm
                            transition-all
                            duration-500
                            group-hover:translate-x-1
                            group-hover:opacity-100
                          "
                        >

                          <ArrowUpRight
                            size={13}
                            strokeWidth={1}
                          />

                        </div>

                        {/* TITLE */}

                        <div
                          className="
                            absolute
                            bottom-5
                            left-5
                            right-5
                          "
                        >

                          <h3
                            className="
                              max-w-42
                              font-display
                              text-xl
                              leading-tight
                              sm:text-2xl
                            "
                          >
                            {title}
                          </h3>

                        </div>

                      </div>

                    </article>

                  </Link>

                </motion.div>
              );
            },
          )}

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

export default CollectionsPage;