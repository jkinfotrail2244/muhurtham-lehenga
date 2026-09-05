import {
  ArrowRight,
  ArrowUpRight,
  Diamond,
  Sparkles,
} from "lucide-react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import HeroSection from "../components/home/HeroSection";

/* ============================================================
   SUPPORTED LANGUAGES
============================================================ */

const supportedLanguages = [
  "en",
  "ta",
  "fr",
  "de",
  "it",
] as const;

type SupportedLanguage =
  (typeof supportedLanguages)[number];

/* ============================================================
   SECTION FADE ANIMATION
============================================================ */

const sectionReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ============================================================
   HOME PAGE
============================================================ */

function HomePage() {
  const location = useLocation();

  const { t, i18n } =
    useTranslation();

  /* ==========================================================
     GET LANGUAGE FROM URL
  ========================================================== */

  const pathnameParts =
    location.pathname.split("/");

  const pathLanguage =
    pathnameParts[1];

  const language: SupportedLanguage =
    supportedLanguages.includes(
      pathLanguage as SupportedLanguage,
    )
      ? (pathLanguage as SupportedLanguage)
      : "en";

  /* ==========================================================
     KEEP I18NEXT SYNCHRONIZED WITH URL
  ========================================================== */

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  /* ==========================================================
     HOME TRANSLATION HELPER
  ========================================================== */

  const homeText = (
    key: string,
    fallback: string,
  ): string => {
    return t(`home.${key}`, {
      defaultValue: fallback,
    });
  };

  /* ==========================================================
     COMMON TRANSLATION HELPER
  ========================================================== */

  const commonText = (
    key: string,
    fallback: string,
  ): string => {
    return t(`common.${key}`, {
      defaultValue: fallback,
    });
  };

  /* ==========================================================
     PRODUCT TRANSLATION HELPER
  ========================================================== */

  const productText = (
    productKey: string,
    field: string,
    fallback: string,
  ): string => {
    return t(
      `products.${productKey}.${field}`,
      {
        defaultValue: fallback,
      },
    );
  };

  /* ==========================================================
     LOCALIZED ROUTE HELPER
  ========================================================== */

  const localizedPath = (
    path: string,
  ): string => {
    const cleanPath =
      path.startsWith("/")
        ? path
        : `/${path}`;

    return `/${language}${cleanPath}`;
  };

  /* ==========================================================
     BRAND
  ========================================================== */

  const brandName = "Muhurtham";

  /* ==========================================================
     FEATURED PRODUCT DATA
  ========================================================== */

  const royalRedName =
    productText(
      "royalRed",
      "title",
      "Royal Red",
    );

  const royalRedCategory =
    productText(
      "royalRed",
      "eyebrow",
      "Bridal Saree",
    );

  const royalMaroonName =
    productText(
      "royalMaroon",
      "title",
      "Royal Maroon",
    );

  const royalMaroonCategory =
    productText(
      "royalMaroon",
      "eyebrow",
      "Bridal Lehenga",
    );

  const ivoryHeritageName =
    productText(
      "ivoryHeritage",
      "title",
      "Ivory Heritage",
    );

  const ivoryHeritageCategory =
    productText(
      "ivoryHeritage",
      "eyebrow",
      "Groom Edit",
    );

  /* ============================================================
     MAIN PAGE
  ============================================================ */

  return (
    <main className="min-h-screen bg-ivory text-ink">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="muhurtham-home-hero">

        <style>{`
          .muhurtham-home-hero h1 {
            color: #ffffff !important;
          }

          .muhurtham-home-hero h1 + p {
            color: #E8D8C8 !important;
          }
        `}</style>

        <HeroSection />

      </div>

      {/* =====================================================
          INTRODUCTION
          FADE ON SCROLL
      ===================================================== */}

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.16,
        }}
        className="relative overflow-hidden bg-[#FBF8F3]"
      >

        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">

          <div className="mx-auto max-w-4xl text-center">

            <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-[#8F6D52]">
              {homeText(
                "hero.eyebrow",
                "THE MUHURTHAM COLLECTION",
              )}
            </p>

            <div className="mx-auto mt-6 flex items-center justify-center gap-3">

              <span className="h-px w-14 bg-[#B18A69]/50" />

              <Diamond
                size={10}
                strokeWidth={1}
                className="rotate-45 text-[#B18A69]"
              />

              <span className="h-px w-14 bg-[#B18A69]/50" />

            </div>

            <h2 className="mt-8 font-display text-4xl leading-[1.12] text-[#181615]! sm:text-5xl lg:text-6xl">
              {homeText(
                "hero.title",
                "The Wedding Chapter",
              )}
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-[14px] leading-8 text-black/55! sm:text-[15px]">
              {homeText(
                "hero.description",
                "Timeless Indian elegance, thoughtfully presented in Switzerland.",
              )}
            </p>

            <Link
              to={localizedPath(
                "/collections",
              )}
              className="group mt-9 inline-flex items-center gap-3 border border-black/20 px-7 py-4 text-[9px] font-medium uppercase tracking-[0.22em] transition-all duration-500 hover:bg-[#181615] hover:text-white"
            >
              {commonText(
                "viewCollection",
                "Discover Our Collections",
              )}

              <ArrowUpRight
                size={14}
                strokeWidth={1}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

          </div>

        </div>

      </motion.section>

      {/* =====================================================
          COLLECTION CATEGORIES
          FADE ON SCROLL
      ===================================================== */}

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.16,
        }}
        className="bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">

          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">

            <div>

              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8F6D52]">
                {homeText(
                  "collections.eyebrow",
                  "MUHURTHAM COLLECTIONS",
                )}
              </p>

              <h2 className="mt-4 font-display text-4xl text-[#181615]! sm:text-5xl">
                {homeText(
                  "collections.title",
                  "Selected Collections",
                )}
              </h2>

              <p className="mt-4 max-w-xl text-[13px] leading-7 text-black/50!">
                {homeText(
                  "collections.description",
                  "Explore our collections, where Indian tradition meets contemporary elegance and refined design.",
                )}
              </p>

            </div>

            <Link
              to={localizedPath(
                "/collections",
              )}
              className="group inline-flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.2em] text-black/65! transition-colors duration-300 hover:text-black!"
            >
              {commonText(
                "viewAll",
                "View All Collections",
              )}

              <ArrowRight
                size={15}
                strokeWidth={1}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">

            {/* =================================================
                LEHENGAS
            ================================================= */}

            <Link
              to={localizedPath(
                "/lehengas",
              )}
              className="group relative block overflow-hidden bg-[#E8DDD1]"
            >

              <div className="relative aspect-4/5 overflow-hidden">

                <img
                  src="/images/lehenga-collection.png"
                  alt={homeText(
                    "collections.lehenga",
                    "Lehengas",
                  )}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">

                  <p className="text-[8px] uppercase tracking-[0.25em] text-white/70">
                    COLLECTION 01
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-5">

                    <h3 className="font-display text-3xl text-white! sm:text-4xl">
                      {homeText(
                        "collections.lehenga",
                        "Lehengas",
                      )}
                    </h3>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 text-white! transition-all duration-500 group-hover:bg-white group-hover:text-black!">

                      <ArrowUpRight
                        size={15}
                        strokeWidth={1}
                      />

                    </span>

                  </div>

                </div>

              </div>

            </Link>

            {/* =================================================
                SAREES
            ================================================= */}

            <Link
              to={localizedPath(
                "/sarees",
              )}
              className="group relative block overflow-hidden bg-[#E8DDD1]"
            >

              <div className="relative aspect-4/5 overflow-hidden">

                <img
                  src="/images/saree-collection.png"
                  alt={homeText(
                    "collections.saree",
                    "Sarees",
                  )}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">

                  <p className="text-[8px] uppercase tracking-[0.25em] text-white/70">
                    COLLECTION 02
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-5">

                    <h3 className="font-display text-3xl text-white! sm:text-4xl">
                      {homeText(
                        "collections.saree",
                        "Sarees",
                      )}
                    </h3>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 text-white! transition-all duration-500 group-hover:bg-white group-hover:text-black!">

                      <ArrowUpRight
                        size={15}
                        strokeWidth={1}
                      />

                    </span>

                  </div>

                </div>

              </div>

            </Link>

            {/* =================================================
                SHERWANIS
            ================================================= */}

            <Link
              to={localizedPath(
                "/sherwanis",
              )}
              className="group relative block overflow-hidden bg-[#E8DDD1]"
            >

              <div className="relative aspect-4/5 overflow-hidden">

                <img
                  src="/images/sherwani-collection.png"
                  alt={homeText(
                    "collections.sherwani",
                    "Sherwanis",
                  )}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">

                  <p className="text-[8px] uppercase tracking-[0.25em] text-white/70">
                    COLLECTION 03
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-5">

                    <h3 className="font-display text-3xl text-white! sm:text-4xl">
                      {homeText(
                        "collections.sherwani",
                        "Sherwanis",
                      )}
                    </h3>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 text-white! transition-all duration-500 group-hover:bg-white group-hover:text-black!">

                      <ArrowUpRight
                        size={15}
                        strokeWidth={1}
                      />

                    </span>

                  </div>

                </div>

              </div>

            </Link>

          </div>

        </div>

      </motion.section>

      {/* =====================================================
          STORY SECTION
          FADE ON SCROLL
      ===================================================== */}

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.16,
        }}
        className="overflow-hidden bg-[#F5EFE8]"
      >

        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">

          <div className="relative min-h-130 overflow-hidden lg:min-h-170">

            <img
              src="/images/new.png"
              alt={homeText(
                "story.eyebrow",
                "Muhurtham",
              )}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute bottom-7 left-7 border border-white/40 bg-black/10 px-5 py-3 backdrop-blur-sm sm:bottom-10 sm:left-10">

              <p className="text-[8px] uppercase tracking-[0.24em] text-white!">
                {brandName}
              </p>

            </div>

          </div>

          <div className="flex items-center px-7 py-20 sm:px-12 lg:px-20 lg:py-24">

            <div className="max-w-xl">

              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8F6D52]">
                {homeText(
                  "story.eyebrow",
                  "MUHURTHAM",
                )}
              </p>

              <h2 className="mt-5 font-display text-4xl leading-[1.15] text-[#181615]! sm:text-5xl">
                {homeText(
                  "story.title",
                  "Where tradition meets refinement.",
                )}
              </h2>

              <div className="my-7 flex items-center gap-3">

                <span className="h-px w-14 bg-[#B18A69]" />

                <span className="h-2 w-2 rotate-45 border border-[#B18A69]" />

                <span className="h-px w-14 bg-[#B18A69]" />

              </div>

              <p className="text-[14px] leading-8 text-black/55!">
                {homeText(
                  "story.description",
                  "Muhurtham is built around the belief that weddingwear should feel deeply personal.",
                )}
              </p>

              <p className="mt-5 text-[14px] leading-8 text-black/55!">
                {homeText(
                  "story.paragraph1",
                  "Every silhouette, colour and detail is selected to bring together the richness of Indian tradition with quiet contemporary elegance.",
                )}
              </p>

              <p className="mt-5 text-[14px] leading-8 text-black/55!">
                {homeText(
                  "story.paragraph2",
                  "From bridal celebrations to intimate occasions, our collection is created for meaningful moments that deserve to be remembered.",
                )}
              </p>

              <Link
                to={localizedPath(
                  "/our-story",
                )}
                className="group mt-8 inline-flex items-center gap-3 border-b border-black/25 pb-3 text-[9px] font-medium uppercase tracking-[0.2em] text-black/70! transition-colors duration-300 hover:text-black!"
              >

                {homeText(
                  "story.cta",
                  "Discover Our Story",
                )}

                <ArrowUpRight
                  size={14}
                  strokeWidth={1}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />

              </Link>

            </div>

          </div>

        </div>

      </motion.section>

      {/* =====================================================
          PHILOSOPHY
          FADE ON SCROLL
      ===================================================== */}

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.16,
        }}
        className="bg-[#FBF8F3]"
      >

        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">

            <div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B18A69]/40">

                <Sparkles
                  size={20}
                  strokeWidth={1}
                  className="text-[#9B6F4F]"
                />

              </div>

              <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.3em] text-[#8F6D52]">
                {homeText(
                  "philosophy.eyebrow",
                  "THE MUHURTHAM PHILOSOPHY",
                )}
              </p>

            </div>

            <div>

              <h2 className="font-display text-4xl leading-[1.18] text-[#181615]! sm:text-5xl lg:text-6xl">
                {homeText(
                  "philosophy.title",
                  "Elegance that lives beyond the occasion.",
                )}
              </h2>

              <p className="mt-7 max-w-2xl text-[14px] leading-8 text-black/50!">
                {homeText(
                  "philosophy.description",
                  "We believe in timeless beauty, refined craftsmanship and pieces created for truly meaningful moments.",
                )}
              </p>

            </div>

          </div>

        </div>

      </motion.section>

      {/* =====================================================
          FEATURED PRODUCTS
          FADE ON SCROLL
      ===================================================== */}

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.16,
        }}
        className="bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">

          <div className="text-center">

            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8F6D52]">
              {commonText(
                "collection",
                "SELECTED PIECES",
              )}
            </p>

            <h2 className="mt-4 font-display text-4xl text-[#181615]! sm:text-5xl">
              {commonText(
                "selectedPieces",
                "From the Collection",
              )}
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-[13px] leading-7 text-black/50!">
              {homeText(
                "collections.description",
                "A few considered pieces from our bridal and occasionwear collections.",
              )}
            </p>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* ROYAL RED */}

            <Link
              to={localizedPath(
                "/sarees/royal-red",
              )}
              className="group"
            >

              <div className="relative aspect-4/5 overflow-hidden bg-[#E8DDD1]">

                <img
                  src="/images/saree-1.png"
                  alt={royalRedName}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]"
                />

                <div className="absolute left-5 top-5 bg-white/90 px-3 py-2 backdrop-blur">

                  <span className="text-[8px] uppercase tracking-[0.18em] text-black/55">
                    SAREE · 01
                  </span>

                </div>

                <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black! opacity-0 shadow-lg transition-all duration-500 group-hover:opacity-100">

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1}
                  />

                </div>

              </div>

              <div className="pt-5">

                <p className="text-[8px] uppercase tracking-[0.22em] text-black/40">
                  {royalRedCategory}
                </p>

                <h3 className="mt-2 font-display text-2xl text-[#181615]!">
                  {royalRedName}
                </h3>

              </div>

            </Link>

            {/* ROYAL MAROON */}

            <Link
              to={localizedPath(
                "/lehengas/royal-maroon",
              )}
              className="group"
            >

              <div className="relative aspect-4/5 overflow-hidden bg-[#E8DDD1]">

                <img
                  src="/images/lehenga-bridal.png"
                  alt={royalMaroonName}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]"
                />

                <div className="absolute left-5 top-5 bg-white/90 px-3 py-2 backdrop-blur">

                  <span className="text-[8px] uppercase tracking-[0.18em] text-black/55">
                    LEHENGA · 01
                  </span>

                </div>

                <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black! opacity-0 shadow-lg transition-all duration-500 group-hover:opacity-100">

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1}
                  />

                </div>

              </div>

              <div className="pt-5">

                <p className="text-[8px] uppercase tracking-[0.22em] text-black/40">
                  {royalMaroonCategory}
                </p>

                <h3 className="mt-2 font-display text-2xl text-[#181615]!">
                  {royalMaroonName}
                </h3>

              </div>

            </Link>

            {/* IVORY HERITAGE */}

            <Link
              to={localizedPath(
                "/sherwanis/ivory-heritage",
              )}
              className="group"
            >

              <div className="relative aspect-4/5 overflow-hidden bg-[#E8DDD1]">

                <img
                  src="/images/sherwani-1.png"
                  alt={ivoryHeritageName}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]"
                />

                <div className="absolute left-5 top-5 bg-white/90 px-3 py-2 backdrop-blur">

                  <span className="text-[8px] uppercase tracking-[0.18em] text-black/55">
                    SHERWANI · 01
                  </span>

                </div>

                <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black! opacity-0 shadow-lg transition-all duration-500 group-hover:opacity-100">

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1}
                  />

                </div>

              </div>

              <div className="pt-5">

                <p className="text-[8px] uppercase tracking-[0.22em] text-black/40">
                  {ivoryHeritageCategory}
                </p>

                <h3 className="mt-2 font-display text-2xl text-[#181615]!">
                  {ivoryHeritageName}
                </h3>

              </div>

            </Link>

          </div>

          <div className="mt-12 flex justify-center">

            <Link
              to={localizedPath(
                "/collections",
              )}
              className="group inline-flex items-center gap-3 border border-black/20 px-8 py-4 text-[9px] font-medium uppercase tracking-[0.22em] transition-all duration-500 hover:bg-[#181615] hover:text-white"
            >

              {commonText(
                "viewAll",
                "Explore All Pieces",
              )}

              <ArrowRight
                size={15}
                strokeWidth={1}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

          </div>

        </div>

      </motion.section>

      {/* =====================================================
          SHOWROOM / APPOINTMENT
          FADE ON SCROLL
      ===================================================== */}

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.16,
        }}
        className="relative overflow-hidden bg-[#1C1917]"
      >

        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-[#C8B09B]!">
              {homeText(
                "appointment.eyebrow",
                "YOUR MUHURTHAM",
              )}
            </p>

            <h2 className="mt-6 font-display text-4xl leading-[1.15] text-white! sm:text-5xl lg:text-6xl">
              {homeText(
                "appointment.title",
                "Find the piece made for your moment.",
              )}
            </h2>

            <p className="mx-auto mt-7 max-w-xl text-[14px] leading-8 text-white/60!">
              {homeText(
                "appointment.description",
                "Discover the collection in person and receive personalised guidance for your special occasion.",
              )}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to={localizedPath(
                  "/showroom",
                )}
                className="group inline-flex items-center justify-center gap-3 border border-white/35 px-8 py-4 text-[9px] font-medium uppercase tracking-[0.22em] text-white! transition-all duration-500 hover:bg-white hover:text-[#181615]!"
              >

                {t(
                  "navigation.showroom",
                  {
                    defaultValue:
                      "Visit Showroom",
                  },
                )}

                <ArrowUpRight
                  size={14}
                  strokeWidth={1}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />

              </Link>

              <Link
                to={localizedPath(
                  "/appointment",
                )}
                className="group inline-flex items-center justify-center gap-3 border border-white/35 bg-transparent px-8 py-4 text-[9px] font-medium uppercase tracking-[0.22em] text-white! transition-all duration-500 hover:bg-white hover:text-[#181615]!"
              >

                {homeText(
                  "appointment.cta",
                  "Book an Appointment",
                )}

                <ArrowUpRight
                  size={14}
                  strokeWidth={1}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />

              </Link>

            </div>

          </div>

        </div>

      </motion.section>

      {/* =====================================================
          FINAL CTA
          FADE ON SCROLL
      ===================================================== */}

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.16,
        }}
        className="bg-[#FBF8F3]"
      >

        <div className="mx-auto max-w-5xl px-6 py-24 text-center sm:px-8 lg:py-32">

          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8F6D52]">
            {homeText(
              "appointment.eyebrow",
              "YOUR WEDDING CHAPTER",
            )}
          </p>

          <h2 className="mt-5 font-display text-4xl leading-[1.15] text-[#181615]! sm:text-5xl lg:text-6xl">
            {homeText(
              "appointment.title",
              "Find something made for your moment.",
            )}
          </h2>

          <div className="mx-auto mt-7 flex items-center justify-center gap-3">

            <span className="h-px w-14 bg-[#B18A69]/50" />

            <Diamond
              size={10}
              strokeWidth={1}
              className="rotate-45 text-[#B18A69]"
            />

            <span className="h-px w-14 bg-[#B18A69]/50" />

          </div>

          <p className="mx-auto mt-7 max-w-xl text-[13px] leading-7 text-black/50!">
            {homeText(
              "appointment.description",
              "Explore our collections and discover the piece that becomes part of your wedding story.",
            )}
          </p>

          <Link
            to={localizedPath(
              "/appointment",
            )}
            className="group mt-9 inline-flex items-center gap-3 bg-[#74533C] px-9 py-4 text-[9px] font-medium uppercase tracking-[0.22em] text-white! transition-all duration-500 hover:bg-[#3D2B20]"
          >

            {homeText(
              "appointment.cta",
              "Book an Appointment",
            )}

            <ArrowRight
              size={15}
              strokeWidth={1}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />

          </Link>

        </div>

      </motion.section>

    </main>
  );
}

export default HomePage;