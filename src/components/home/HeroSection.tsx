import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  useEffect,
  useState,
} from "react";

type HeroSlide = {
  id: number;
  image: string;
  title: string;
  description: string;
  accent: string;
};

function HeroSection() {
  const { t } = useTranslation();
  const location = useLocation();

  const language =
    location.pathname.split("/")[1] || "en";

  /* =====================================================
     HERO SLIDES
  ===================================================== */

  const slides: HeroSlide[] = [
    {
      id: 1,
      image: "/images/hero.png",
      title: t("home.hero.title", {
        defaultValue: "The Wedding Chapter",
      }),
      description: t("home.hero.description", {
        defaultValue:
          "Timeless Indian elegance, thoughtfully presented in Switzerland.",
      }),
      accent: "#E5C7A8",
    },

    {
      id: 2,
      image: "/images/hero-2.png",
      title: t("home.hero.slide2.title", {
        defaultValue: "Made for Your Moment.",
      }),
      description: t(
        "home.hero.slide2.description",
        {
          defaultValue:
            "Refined bridal elegance created for unforgettable celebrations.",
        },
      ),
      accent: "#D9B6A2",
    },

    {
      id: 3,
      image: "/images/hero-3.png",
      title: t("home.hero.slide3.title", {
        defaultValue: "The Modern Groom.",
      }),
      description: t(
        "home.hero.slide3.description",
        {
          defaultValue:
            "Contemporary ceremonial style with timeless Indian character.",
        },
      ),
      accent: "#D8B982",
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  /* =====================================================
     CURRENT SLIDE
  ===================================================== */

  const activeSlide =
    slides[currentSlide];

  /* =====================================================
     AUTOMATIC SLIDER

     Changes every 5 seconds.

     Pauses while mouse is over hero.
  ===================================================== */

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentSlide((current) =>
        current === slides.length - 1
          ? 0
          : current + 1,
      );
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, slides.length]);

  /* =====================================================
     NEXT SLIDE
  ===================================================== */

  const nextSlide = () => {
    setCurrentSlide((current) =>
      current === slides.length - 1
        ? 0
        : current + 1,
    );
  };

  /* =====================================================
     PREVIOUS SLIDE
  ===================================================== */

  const previousSlide = () => {
    setCurrentSlide((current) =>
      current === 0
        ? slides.length - 1
        : current - 1,
    );
  };

  /* =====================================================
     SELECT SLIDE
  ===================================================== */

  const selectSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section
      key={location.pathname}
      className="relative min-h-[calc(100vh-155px)] overflow-hidden bg-ink"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =====================================================
          HERO IMAGE AREA
      ===================================================== */}

      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={activeSlide.id}
            src={activeSlide.image}
            alt="Muhurtham Collection"
            className="absolute inset-0 h-full w-full object-cover object-[center_10%]"
            initial={{
              opacity: 0,
              scale: 1.08,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
            }}
            transition={{
              opacity: {
                duration: 1.2,
                ease: "easeInOut",
              },
              scale: {
                duration: 5.8,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              },
            }}
          />
        </AnimatePresence>

        {/* ===================================================
            DARK EDITORIAL OVERLAY
        =================================================== */}

        <div className="absolute inset-0 bg-black/35" />

        {/* ===================================================
            CINEMATIC BOTTOM GRADIENT
        =================================================== */}

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/50 via-black/15 to-transparent" />

        {/* ===================================================
            SOFT CENTER OVERLAY
        =================================================== */}

        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-[calc(100vh-155px)] items-center justify-center px-6 pt-25">
        <div className="max-w-5xl text-center text-white">

          <AnimatePresence
            mode="wait"
            initial={false}
          >
            <motion.div
              key={activeSlide.id}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              {/* =================================================
                  EYEBROW
              ================================================= */}

              <motion.p
                className="mb-5 text-[9px] font-medium uppercase tracking-[0.38em] text-white!"
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                style={{
                  color: activeSlide.accent,
                }}
              >
                YOUR MUHURTHAM
              </motion.p>

              {/* =================================================
                  MAIN HEADING
              ================================================= */}

              <motion.h1
                className="font-display text-5xl leading-[0.95] tracking-[0.03em] text-white! sm:text-6xl md:text-7xl lg:text-[88px]"
                initial={{
                  opacity: 0,
                  y: 40,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 1.1,
                  delay: 0.3,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
                {activeSlide.title}
              </motion.h1>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <motion.p
                className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/85! sm:text-base"
                initial={{
                  opacity: 0,
                  y: 22,
                  filter: "blur(5px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.65,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
                {activeSlide.description}
              </motion.p>

              {/* =================================================
                  CTA BUTTONS
              ================================================= */}

              <motion.div
                className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
                initial={{
                  opacity: 0,
                  y: 22,
                  filter: "blur(4px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.9,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
                {/* =================================================
                    LEHENGAS
                ================================================= */}

                <Link
                  to={`/${language}/lehengas`}
                  className="group inline-flex items-center gap-5 border border-white/75 px-8 py-4 text-[9px] font-medium uppercase tracking-[0.25em] text-white! transition-all duration-500 hover:bg-white hover:text-ink!"
                >
                  {t("home.hero.cta", {
                    defaultValue:
                      "Explore Lehengas",
                  })}

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.1}
                    className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>

                {/* =================================================
                    SHERWANIS
                ================================================= */}

                <Link
                  to={`/${language}/sherwanis`}
                  className="group inline-flex items-center gap-5 border border-white/40 px-8 py-4 text-[9px] font-medium uppercase tracking-[0.25em] text-white/90! transition-all duration-500 hover:border-white hover:bg-white hover:text-ink!"
                >
                  {t("navigation.sherwanis", {
                    defaultValue:
                      "Sherwanis",
                  })}

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.1}
                    className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* =====================================================
          SLIDER ARROWS
      ===================================================== */}

      <div className="absolute bottom-7 right-7 z-20 flex items-center gap-2 sm:bottom-8 sm:right-10">

        {/* PREVIOUS */}

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="group flex h-10 w-10 items-center justify-center border border-white/35 text-white/80 transition-all duration-300 hover:border-white hover:bg-white hover:text-ink"
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.2}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
        </button>

        {/* NEXT */}

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="group flex h-10 w-10 items-center justify-center border border-white/35 text-white/80 transition-all duration-300 hover:border-white hover:bg-white hover:text-ink"
        >
          <ArrowRight
            size={14}
            strokeWidth={1.2}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* =====================================================
          SLIDE INDICATORS
      ===================================================== */}

      <div className="absolute bottom-8 left-7 z-20 flex items-center gap-3 sm:left-10">
        {slides.map(
          (slide, index) => {
            const active =
              currentSlide === index;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() =>
                  selectSlide(index)
                }
                aria-label={`Go to slide ${
                  index + 1
                }`}
                className="group flex items-center justify-center py-2"
              >
                <span
                  className={`block h-px transition-all duration-500 ${
                    active
                      ? "w-12 bg-white"
                      : "w-6 bg-white/40 group-hover:w-9 group-hover:bg-white/75"
                  }`}
                />
              </button>
            );
          },
        )}
      </div>

      {/* =====================================================
          SLIDER PROGRESS INDICATOR

          LEFT SIDE
      ===================================================== */}

      <div className="absolute left-7 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-4 sm:flex">

        {/* CURRENT SLIDE */}

        <span className="text-[7px] uppercase tracking-[0.3em] text-white/70">
          {String(
            currentSlide + 1,
          ).padStart(2, "0")}
        </span>

        {/* VERTICAL PROGRESS LINE */}

        <div className="relative h-16 w-px overflow-hidden bg-white/25">
          <motion.div
            key={`${currentSlide}-${isPaused}`}
            className="absolute left-0 top-0 w-full"
            style={{
              backgroundColor:
                activeSlide.accent,
            }}
            initial={{
              height: "0%",
            }}
            animate={{
              height: isPaused
                ? "0%"
                : "100%",
            }}
            transition={{
              duration: isPaused
                ? 0
                : 5,
              ease: "linear",
            }}
          />
        </div>

        {/* TOTAL SLIDES */}

        <span className="text-[7px] uppercase tracking-[0.3em] text-white/50">
          03
        </span>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <motion.div
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/70!"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 1.35,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <span className="text-[7px] uppercase tracking-[0.3em]">
          Scroll
        </span>

        <motion.div
          animate={{
            y: [0, 5, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowDown
            size={14}
            strokeWidth={1}
          />
        </motion.div>
      </motion.div>

      {/* =====================================================
          MOBILE SLIDE COUNTER
      ===================================================== */}

      <div className="absolute right-7 top-7 z-20 sm:hidden">
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/70">
          {String(
            currentSlide + 1,
          ).padStart(2, "0")}{" "}
          / 03
        </span>
      </div>
    </section>
  );
}

export default HeroSection;