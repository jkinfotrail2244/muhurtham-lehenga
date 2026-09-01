import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Diamond,
  Heart,
  Leaf,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

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
   PAGE
============================================================ */

function OurStoryPage() {
  const location = useLocation();

  const { t, i18n } = useTranslation();

  /* ==========================================================
     GET LANGUAGE FROM URL
  ========================================================== */

  const pathnameParts = location.pathname.split("/");

  const pathLanguage = pathnameParts[1];

  const language: SupportedLanguage =
    supportedLanguages.includes(
      pathLanguage as SupportedLanguage,
    )
      ? (pathLanguage as SupportedLanguage)
      : "en";

  /* ==========================================================
     KEEP I18NEXT IN SYNC WITH URL

     /en/our-story
     /ta/our-story
     /fr/our-story
     /de/our-story
     /it/our-story
  ========================================================== */

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  /* ==========================================================
     LANGUAGE-AWARE ROUTES
  ========================================================== */

  const getPath = (path: string) => {
    if (!path) {
      return `/${language}`;
    }

    return `/${language}/${path}`;
  };

  /* ==========================================================
     TRANSLATION HELPER

     All normal page content is taken from the JSON files.

     Example:
     ourStory.hero.title
     ourStory.promise.title
     ourStory.cta.title
  ========================================================== */

  const text = (
    key: string,
    fallback: string,
  ): string => {
    return t(`ourStory.${key}`, {
      defaultValue: fallback,
    });
  };

  /* ==========================================================
     BRAND NAME

     IMPORTANT:
     The previous version had "Muhurtham Collection" hard-coded.

     Therefore changing the language could never change it.

     We intentionally make the brand display language-aware.
  ========================================================== */

  const brandCollectionName: Record<
    SupportedLanguage,
    string
  > = {
    en: "Muhurtham Collection",
    ta: "முகூர்த்தம் கலெக்ஷன்",
    fr: "Collection Muhurtham",
    de: "Muhurtham Kollektion",
    it: "Collezione Muhurtham",
  };

  /* ==========================================================
     BRAND SHORT NAME
  ========================================================== */

  const brandShortName: Record<
    SupportedLanguage,
    string
  > = {
    en: "Muhurtham",
    ta: "முகூர்த்தம்",
    fr: "Muhurtham",
    de: "Muhurtham",
    it: "Muhurtham",
  };

  /* ==========================================================
     FOUNDER NAME

     Proper names are normally not translated.

     However, because you specifically want Tamil script,
     Tamil gets a Tamil-script version.
  ========================================================== */

  const founderName: Record<
    SupportedLanguage,
    string
  > = {
    en: "Kavisha Kamalanathan",
    ta: "கவிஷா கமலாநாதன்",
    fr: "Kavisha Kamalanathan",
    de: "Kavisha Kamalanathan",
    it: "Kavisha Kamalanathan",
  };

  return (
    <main className="min-h-screen bg-ivory text-ink">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-black/6">

        <div className="grid min-h-155 lg:min-h-180 lg:grid-cols-2">

          {/* HERO CONTENT */}

          <div className="flex items-center px-8 py-24 sm:px-12 lg:px-16 xl:px-24">

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                ease: "easeOut",
              }}
              className="max-w-xl"
            >

              {/* BRAND / EYEBROW */}

              <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-brown">
                {brandCollectionName[language]}
              </p>

              {/* TITLE */}

              <h1 className="luxury-heading mt-6 text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
                {text(
                  "hero.title",
                  "Our Story",
                )}
              </h1>

              {/* DIVIDER */}

              <div className="mt-8 flex items-center gap-3">

                <span className="h-px w-16 bg-brown/60" />

                <span className="h-2 w-2 rotate-45 border border-brown/70" />

                <span className="h-px w-10 bg-brown/60" />

              </div>

              {/* SUBTITLE */}

              <p className="mt-8 max-w-lg font-serif text-base leading-7 text-black/60 sm:text-lg">
                {text(
                  "hero.subtitle",
                  "Where tradition becomes timeless elegance.",
                )}
              </p>

              {/* DESCRIPTION */}

              <p className="mt-5 max-w-lg text-[11px] leading-6 text-black/55 sm:text-xs">
                {text(
                  "hero.description",
                  "Muhurtham Collection was created with a simple vision — to bring the beauty, craftsmanship and cultural richness of Indian bridal fashion to Switzerland.",
                )}
              </p>

              {/* CTA */}

              <Link
                to={getPath("collections")}
                className="group mt-9 inline-flex items-center gap-5 border border-ink px-7 py-4 text-[8px] font-medium uppercase tracking-[0.25em] transition-all duration-500 hover:bg-ink hover:text-white"
              >
                {text(
                  "hero.cta",
                  "Discover Our Collection",
                )}

                <ArrowUpRight
                  size={14}
                  strokeWidth={1}
                  className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

            </motion.div>

          </div>

          {/* HERO IMAGE */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 1.04,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
            className="relative min-h-107.5 overflow-hidden lg:min-h-0"
          >

            <img
              src="/images/our-story.png"
              alt={text(
                "hero.imageAlt",
                brandCollectionName[language],
              )}
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-linear-to-r from-ivory/10 via-transparent to-black/5" />

          </motion.div>

        </div>

      </section>

      {/* =====================================================
          CONCEPT & VISION
      ===================================================== */}

      <section className="relative overflow-hidden py-24 sm:py-28 lg:py-36">

        <div className="pointer-events-none absolute right-0 top-0 h-full w-[32%] bg-[#e8eeee]/55" />

        <div className="page-container relative">

          <motion.div
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
            }}
            className="text-center"
          >

            <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-brown">
              {text(
                "concept.eyebrow",
                "OUR CONCEPT & VISION",
              )}
            </p>

            <h2 className="luxury-heading mx-auto mt-5 max-w-4xl text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              {text(
                "concept.title",
                "Every outfit tells a story — and that story begins with us.",
              )}
            </h2>

            <div className="mx-auto mt-7 flex items-center justify-center gap-3">

              <span className="h-px w-14 bg-brown/55" />

              <span className="h-2 w-2 rotate-45 border border-brown/65" />

              <span className="h-px w-9 bg-brown/55" />

            </div>

          </motion.div>

          {/* THREE PILLARS */}

          <div className="mt-20 grid gap-px overflow-hidden border border-black/7 bg-black/7 md:grid-cols-3">

            {/* CONSULTATIONS */}

            <motion.div
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
              }}
              transition={{
                duration: 0.7,
              }}
              className="bg-ivory px-7 py-10 text-center sm:px-10"
            >

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brown/30">

                <Heart
                  size={20}
                  strokeWidth={1}
                  className="text-brown"
                />

              </div>

              <h3 className="mt-6 whitespace-pre-line font-display text-2xl">
                {text(
                  "pillars.consultations.title",
                  "Personalized\nConsultations",
                )}
              </h3>

              <p className="mx-auto mt-5 max-w-xs text-[11px] leading-6 text-black/55">
                {text(
                  "pillars.consultations.description",
                  "We take time for our clients, offering tailored advice to help them find their perfect bridal outfit or suit.",
                )}
              </p>

            </motion.div>

            {/* UNIQUE COLLECTION */}

            <motion.div
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
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="bg-ivory px-7 py-10 text-center sm:px-10"
            >

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brown/30">

                <Diamond
                  size={20}
                  strokeWidth={1}
                  className="text-brown"
                />

              </div>

              <h3 className="mt-6 whitespace-pre-line font-display text-2xl">
                {text(
                  "pillars.collection.title",
                  "A Unique\nCollection",
                )}
              </h3>

              <p className="mx-auto mt-5 max-w-xs text-[11px] leading-6 text-black/55">
                {text(
                  "pillars.collection.description",
                  "Our collection brings together traditional elegance and modern design, reflecting the richness of Indian wedding culture.",
                )}
              </p>

            </motion.div>

            {/* VISION */}

            <motion.div
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
              }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
              className="bg-ivory px-7 py-10 text-center sm:px-10"
            >

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brown/30">

                <Sparkles
                  size={20}
                  strokeWidth={1}
                  className="text-brown"
                />

              </div>

              <h3 className="mt-6 whitespace-pre-line font-display text-2xl">
                {text(
                  "pillars.vision.title",
                  "Our\nVision",
                )}
              </h3>

              <p className="mx-auto mt-5 max-w-xs text-[11px] leading-6 text-black/55">
                {text(
                  "pillars.vision.description",
                  "To create a place where brides and grooms can bring their wedding dreams to life through quality, warmth and personal service.",
                )}
              </p>

            </motion.div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PHILOSOPHY
      ===================================================== */}

      <section className="border-y border-black/6 bg-[#e8eeee]/40">

        <div className="grid lg:grid-cols-2">

          {/* IMAGE */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.9,
            }}
            className="relative min-h-140 overflow-hidden lg:min-h-180"
          >

            <img
              src="/images/our-story-couple.png"
              alt={text(
                "philosophy.imageAlt",
                "Muhurtham bridal and groom collection",
              )}
              className="h-full w-full object-cover object-center transition-transform duration-1400 hover:scale-[1.025]"
            />

          </motion.div>

          {/* TEXT */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.9,
            }}
            className="flex items-center px-8 py-20 sm:px-12 lg:px-16 xl:px-24"
          >

            <div className="max-w-xl">

              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-brown">
                {text(
                  "philosophy.eyebrow",
                  "THE MUHURTHAM PHILOSOPHY",
                )}
              </p>

              <h2 className="luxury-heading mt-5 whitespace-pre-line text-4xl leading-tight sm:text-5xl">
                {text(
                  "philosophy.title",
                  "Designed for\nmeaningful moments.",
                )}
              </h2>

              <div className="mt-7 h-px w-20 bg-brown/50" />

              <p className="mt-8 text-sm leading-7 text-black/60">
                {text(
                  "philosophy.paragraph1",
                  "Our vision is to be a place where brides and grooms can bring their wedding dreams to life.",
                )}
              </p>

              <p className="mt-5 text-sm leading-7 text-black/60">
                {text(
                  "philosophy.paragraph2",
                  "We aim to inspire and delight our clients not only with the quality of our garments, but also with a warm, professional and welcoming atmosphere.",
                )}
              </p>

              <p className="mt-5 text-sm leading-7 text-black/60">
                {text(
                  "philosophy.paragraph3",
                  "At Muhurtham Collection, our concept is simple yet powerful: to bring the beauty, elegance and cultural richness of Indian and Tamil bridal fashion to Switzerland — with a focus on authenticity, exclusivity and personal service.",
                )}
              </p>

              {/* BRAND NAME */}

              <div className="mt-9 flex items-center gap-3">

                <span className="h-px w-10 bg-brown/50" />

                <span className="font-display text-lg text-brown">
                  {brandShortName[language]}
                </span>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* =====================================================
          FOUNDER
      ===================================================== */}

      <section className="page-container py-24 sm:py-28 lg:py-36">

        <motion.div
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
          }}
          transition={{
            duration: 0.8,
          }}
          className="mb-16 text-center"
        >

          <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-brown">
            {text(
              "founder.eyebrow",
              "THE PERSON BEHIND MUHURTHAM",
            )}
          </p>

          <h2 className="luxury-heading mt-4 text-4xl sm:text-5xl lg:text-6xl">
            {text(
              "founder.title",
              "Meet the Founder",
            )}
          </h2>

          <div className="mx-auto mt-6 flex items-center justify-center gap-3">

            <span className="h-px w-12 bg-brown/50" />

            <span className="h-2 w-2 rotate-45 border border-brown/60" />

            <span className="h-px w-8 bg-brown/50" />

          </div>

        </motion.div>

        <div className="grid overflow-hidden border border-black/7 bg-[#f5f0e9] lg:grid-cols-[0.9fr_1.1fr]">

          {/* FOUNDER PHOTO */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative min-h-125 lg:min-h-162.5"
          >

            <img
              src="/images/founder.jpeg"
              alt={text(
                "founder.imageAlt",
                `${founderName[language]} - ${brandCollectionName[language]}`,
              )}
              className="h-full w-full object-cover object-center"
            />

          </motion.div>

          {/* FOUNDER CONTENT */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="flex items-center px-8 py-16 sm:px-12 lg:px-16 xl:px-20"
          >

            <div className="max-w-xl">

              <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-brown">
                {text(
                  "founder.role",
                  "FOUNDER & CREATIVE DIRECTOR",
                )}
              </p>

              {/* =================================================
                  FOUNDER NAME

                  FIXED:
                  Previously hard-coded:
                  Kavisha Kamalanathan

                  Now:
                  English  -> Kavisha Kamalanathan
                  Tamil    -> கவிஷா கமலாநாதன்
                  French   -> Kavisha Kamalanathan
                  German   -> Kavisha Kamalanathan
                  Italian  -> Kavisha Kamalanathan
              ================================================= */}

              <h3 className="luxury-heading mt-5 text-4xl sm:text-5xl">
                {founderName[language]}
              </h3>

              <div className="mt-7 h-px w-20 bg-brown/50" />

              <p className="mt-8 text-sm leading-7 text-black/60">
                {text(
                  "founder.paragraph1",
                  "Muhurtham Collection was founded with a passion for bringing authentic Indian bridal elegance to Switzerland.",
                )}
              </p>

              <p className="mt-5 text-sm leading-7 text-black/60">
                {text(
                  "founder.paragraph2",
                  "With a deep appreciation for craftsmanship, culture and personal service, the vision was to create a space where every bride and groom could discover pieces that feel meaningful, personal and timeless.",
                )}
              </p>

              <p className="mt-5 text-sm leading-7 text-black/60">
                {text(
                  "founder.paragraph3",
                  "Every detail of the Muhurtham experience is thoughtfully considered — from the selection of each garment to the personal attention given to every client.",
                )}
              </p>

              {/* QUOTE */}

              <div className="mt-10 border-l border-brown/50 pl-6">

                <p className="font-display text-xl leading-8 text-black/75">
                  {text(
                    "founder.quote",
                    "“Every celebration deserves something unforgettable.”",
                  )}
                </p>

                {/* FOUNDER NAME UNDER QUOTE */}

                <p className="mt-3 text-[8px] uppercase tracking-[0.25em] text-brown">
                  {founderName[language]}
                </p>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* =====================================================
          OUR PROMISE
      ===================================================== */}

      <section className="border-y border-black/6 bg-[#f5f0e9] py-24 sm:py-28 lg:py-32">

        <div className="page-container">

          <div className="text-center">

            <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-brown">
              {text(
                "promise.eyebrow",
                "WHAT WE STAND FOR",
              )}
            </p>

            <h2 className="luxury-heading mt-4 text-4xl sm:text-5xl lg:text-6xl">
              {text(
                "promise.title",
                "Our Promise",
              )}
            </h2>

          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* AUTHENTICITY */}

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
                duration: 0.6,
              }}
              className="text-center"
            >

              <Leaf
                size={25}
                strokeWidth={1}
                className="mx-auto text-brown"
              />

              <h3 className="mt-5 font-display text-2xl">
                {text(
                  "promise.authenticity.title",
                  "Authenticity",
                )}
              </h3>

              <p className="mt-3 text-[11px] leading-6 text-black/55">
                {text(
                  "promise.authenticity.description",
                  "Celebrating genuine craftsmanship, culture and heritage.",
                )}
              </p>

            </motion.div>

            {/* EXCLUSIVITY */}

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
                duration: 0.6,
                delay: 0.1,
              }}
              className="text-center"
            >

              <Diamond
                size={25}
                strokeWidth={1}
                className="mx-auto text-brown"
              />

              <h3 className="mt-5 font-display text-2xl">
                {text(
                  "promise.exclusivity.title",
                  "Exclusivity",
                )}
              </h3>

              <p className="mt-3 text-[11px] leading-6 text-black/55">
                {text(
                  "promise.exclusivity.description",
                  "Thoughtfully selected pieces for meaningful occasions.",
                )}
              </p>

            </motion.div>

            {/* PERSONAL SERVICE */}

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
                duration: 0.6,
                delay: 0.2,
              }}
              className="text-center"
            >

              <Heart
                size={25}
                strokeWidth={1}
                className="mx-auto text-brown"
              />

              <h3 className="mt-5 font-display text-2xl">
                {text(
                  "promise.personalService.title",
                  "Personal Service",
                )}
              </h3>

              <p className="mt-3 text-[11px] leading-6 text-black/55">
                {text(
                  "promise.personalService.description",
                  "A private, welcoming experience from selection to appointment.",
                )}
              </p>

            </motion.div>

            {/* TIMELESS ELEGANCE */}

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
                duration: 0.6,
                delay: 0.3,
              }}
              className="text-center"
            >

              <Sparkles
                size={25}
                strokeWidth={1}
                className="mx-auto text-brown"
              />

              <h3 className="mt-5 font-display text-2xl">
                {text(
                  "promise.timelessElegance.title",
                  "Timeless Elegance",
                )}
              </h3>

              <p className="mt-3 text-[11px] leading-6 text-black/55">
                {text(
                  "promise.timelessElegance.description",
                  "Designs created to remain beautiful beyond a single celebration.",
                )}
              </p>

            </motion.div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-ink px-6 py-24 text-white sm:py-28 lg:py-32">

        <div className="page-container">

          <motion.div
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
            }}
            transition={{
              duration: 0.8,
            }}
            className="text-center"
          >

            <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-brown">
              {text(
                "cta.eyebrow",
                "YOUR MUHURTHAM",
              )}
            </p>

            <h2 className="luxury-heading mx-auto mt-5 max-w-4xl whitespace-pre-line text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {text(
                "cta.title",
                "Your celebration\nbegins here.",
              )}
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/55">
              {text(
                "cta.description",
                "Discover a collection thoughtfully created for life's most meaningful celebrations.",
              )}
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

              {/* LEHENGAS */}

              <Link
                to={getPath("lehengas")}
                className="group inline-flex items-center justify-center gap-5 border border-brown px-7 py-4 text-[8px] font-medium uppercase tracking-[0.25em] text-white transition-all duration-500 hover:bg-brown hover:text-white"
              >

                {text(
                  "cta.exploreLehengas",
                  "Explore Lehengas",
                )}

                <ArrowUpRight
                  size={14}
                  strokeWidth={1}
                  className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                />

              </Link>

              {/* SHERWANIS */}

              <Link
                to={getPath("sherwanis")}
                className="group inline-flex items-center justify-center gap-5 border border-brown px-7 py-4 text-[8px] font-medium uppercase tracking-[0.25em] text-white transition-all duration-500 hover:bg-brown hover:text-white"
              >

                {text(
                  "cta.exploreSherwanis",
                  "Explore Sherwanis",
                )}

                <ArrowUpRight
                  size={14}
                  strokeWidth={1}
                  className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                />

              </Link>

              {/* APPOINTMENT */}

              <Link
                to={getPath("appointment")}
                className="group inline-flex items-center justify-center gap-5 border border-brown px-7 py-4 text-[8px] font-medium uppercase tracking-[0.25em] text-white transition-all duration-500 hover:bg-brown hover:text-white"
              >

                {text(
                  "cta.bookAppointment",
                  "Book an Appointment",
                )}

                <ArrowUpRight
                  size={14}
                  strokeWidth={1}
                  className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                />

              </Link>

            </div>

          </motion.div>

        </div>

      </section>

    </main>
  );
}

export default OurStoryPage;