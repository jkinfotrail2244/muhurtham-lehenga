import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

function HeroSection() {
  const { t } = useTranslation();
  const location = useLocation();

  const language =
    location.pathname.split("/")[1] || "en";

  return (
    <section
      className="relative min-h-[calc(100vh-185px)] overflow-hidden bg-ink"
    >
      {/* =====================================================
          HERO IMAGE
      ===================================================== */}

      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src="/images/hero.png"
          alt="Muhurtham Collection"
          className="h-full w-full object-cover object-[center_10%]"
          initial={{
            opacity: 0,
            scale: 1.06,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            opacity: {
              duration: 0.6,
              ease: "easeOut",
            },
            scale: {
              duration: 1.6,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
        />

        {/* Editorial overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Soft cinematic bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/50 via-black/15 to-transparent" />
      </div>

      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-[calc(100vh-185px)] items-center justify-center px-6 pt-25">
        <div className="max-w-5xl text-center text-white">

          {/* =================================================
              EYEBROW
          ================================================= */}

          <motion.p
            className="mb-5 text-[9px] font-medium uppercase tracking-[0.38em] opacity-90"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 0.9,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* =================================================
              MAIN HEADING
          ================================================= */}

          <motion.h1
            className="font-display text-5xl leading-[0.95] tracking-[0.03em] sm:text-6xl md:text-7xl lg:text-[88px]"
            initial={{
              opacity: 0,
              y: 45,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {t("home.hero.title")}
          </motion.h1>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <motion.p
            className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/85 sm:text-base"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {t("home.hero.description")}
          </motion.p>

          {/* =================================================
              CTA BUTTONS
          ================================================= */}

          <motion.div
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Lehengas */}

            <Link
              to={`/${language}/lehengas`}
              className="group inline-flex items-center gap-5 border border-white/75 px-8 py-4 text-[9px] font-medium uppercase tracking-[0.25em] transition-all duration-500 hover:bg-white hover:text-ink"
            >
              {t("home.hero.cta")}

              <ArrowUpRight
                size={14}
                strokeWidth={1.1}
                className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            {/* Sherwanis */}

            <Link
              to={`/${language}/sherwanis`}
              className="group inline-flex items-center gap-5 border border-white/40 px-8 py-4 text-[9px] font-medium uppercase tracking-[0.25em] text-white/90 transition-all duration-500 hover:border-white hover:bg-white hover:text-ink"
            >
              {t("navigation.sherwanis")}

              <ArrowUpRight
                size={14}
                strokeWidth={1.1}
                className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <motion.div
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/70"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 1.3,
          ease: [0.22, 1, 0.36, 1],
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
    </section>
  );
}

export default HeroSection;