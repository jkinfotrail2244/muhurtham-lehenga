import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const bridalLehengas = [
  {
    number: "01",
    name: "The Crimson Bridal",
    description: "Traditional bridal artistry in deep crimson.",
    image: "/images/lehenga-bridal.png",
    isNew: true,
  },
  {
    number: "02",
    name: "Ivory Garden Bridal",
    description: "Delicate embroidery in timeless ivory.",
    image: "/images/lehenga-occasion.png",
    isNew: true,
  },
  {
    number: "03",
    name: "Rose Bridal Ensemble",
    description: "Soft romantic tones for an unforgettable day.",
    image: "/images/lehenga-wedding.png",
    isNew: false,
  },
  {
    number: "04",
    name: "Royal Heritage Bridal",
    description: "A regal expression of Indian craftsmanship.",
    image: "/images/lehenga-bridal.png",
    isNew: false,
  },
  {
    number: "05",
    name: "Champagne Bridal",
    description: "Subtle shimmer with refined detailing.",
    image: "/images/lehenga-occasion.png",
    isNew: true,
  },
  {
    number: "06",
    name: "The Burgundy Bride",
    description: "Rich tones created for the wedding chapter.",
    image: "/images/lehenga-wedding.png",
    isNew: false,
  },
  {
    number: "07",
    name: "Pearl Garden Lehenga",
    description: "Elegant detailing inspired by timeless gardens.",
    image: "/images/lehenga-bridal.png",
    isNew: false,
  },
  {
    number: "08",
    name: "The Heirloom Bridal",
    description: "Crafted with an appreciation for tradition.",
    image: "/images/lehenga-occasion.png",
    isNew: false,
  },
];

function BridalPage() {
  const location = useLocation();

  const language =
    location.pathname.split("/")[1] || "en";

  return (
    <main className="min-h-screen bg-ivory text-ink">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 lg:pb-14 lg:pt-20">
        <div className="page-container">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            {/* TITLE */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="eyebrow text-brown">
                01 / Bridal Collection
              </p>

              <h1 className="luxury-heading mt-4 text-5xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-[76px]">
                Bridal Lehengas
              </h1>

              <p className="editorial-copy mt-5 max-w-xl">
                For the beginning of forever — a considered
                collection of bridal silhouettes shaped by
                Indian craftsmanship and timeless elegance.
              </p>
            </motion.div>

            {/* CONTROLS */}

            <motion.div
              className="flex items-center gap-3"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <button
                type="button"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  border
                  border-black/15
                  px-5
                  py-3
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  transition-all
                  duration-300
                  hover:border-brown
                  hover:bg-brown
                  hover:text-white
                "
              >
                <SlidersHorizontal
                  size={13}
                  strokeWidth={1.2}
                />

                Filter
              </button>

              <div className="flex items-center border border-black/15">
                <span className="border-r border-black/10 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-black/50">
                  Sort
                </span>

                <span className="px-5 py-3 text-[9px] uppercase tracking-[0.2em]">
                  New Arrivals
                </span>
              </div>
            </motion.div>

          </div>

          {/* DIVIDER */}

          <motion.div
            className="mt-10 h-px w-full bg-black/10"
            initial={{
              scaleX: 0,
              transformOrigin: "left",
            }}
            animate={{
              scaleX: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

        </div>
      </section>

      {/* =====================================================
          PRODUCT GRID
      ===================================================== */}

      <section className="px-6 pb-24 sm:pb-28 lg:pb-32">
        <div className="page-container">

          {/* COLLECTION META */}

          <div className="mb-7 flex items-center justify-between">
            <p className="text-[8px] uppercase tracking-[0.25em] text-black/40">
              Bridal Edit
            </p>

            <p className="text-[8px] uppercase tracking-[0.25em] text-black/40">
              {String(bridalLehengas.length).padStart(2, "0")} Pieces
            </p>
          </div>

          {/* GRID */}

          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">

            {bridalLehengas.map((item, index) => (
              <motion.article
                key={item.number}
                className="group"
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
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.7,
                  delay: (index % 4) * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >

                <Link
                  to={`/${language}/lehengas/bridal/${item.number}`}
                  className="block"
                >

                  {/* =================================================
                      IMAGE CARD
                  ================================================= */}

                  <div className="relative aspect-4/5 overflow-hidden bg-[#d9cabe]">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-1200
                        ease-out
                        group-hover:scale-[1.035]
                      "
                    />

                    {/* SUBTLE IMAGE OVERLAY */}

                    <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

                    {/* NUMBER */}

                    <div className="absolute left-4 top-4">

                      <span className="text-[8px] uppercase tracking-[0.28em] text-white drop-shadow-md">
                        {item.number}
                      </span>

                    </div>

                    {/* NEW LABEL */}

                    {item.isNew && (
                      <div className="absolute left-4 top-9">
                        <span
                          className="
                            border
                            border-white/60
                            bg-black/15
                            px-3
                            py-1.5
                            text-[8px]
                            uppercase
                            tracking-[0.2em]
                            text-white
                            backdrop-blur-[3px]
                          "
                        >
                          New
                        </span>
                      </div>
                    )}

                    {/* ARROW */}

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
                        border-white/70
                        bg-black/10
                        text-white
                        backdrop-blur-[3px]
                        transition-all
                        duration-500
                        group-hover:bg-white
                        group-hover:text-ink
                      "
                    >
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.1}
                        className="
                          transition-transform
                          duration-500
                          group-hover:translate-x-0.5
                          group-hover:-translate-y-0.5
                        "
                      />
                    </div>

                  </div>

                  {/* =================================================
                      PRODUCT INFORMATION
                  ================================================= */}

                  <div className="pt-4">

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <h2 className="font-display text-xl leading-tight sm:text-[22px]">
                          {item.name}
                        </h2>

                        <p className="mt-2 max-w-65 text-[10px] leading-5 tracking-[0.03em] text-black/50 sm:text-[11px]">
                          {item.description}
                        </p>

                      </div>

                      <span
                        className="
                          mt-1
                          shrink-0
                          text-[8px]
                          uppercase
                          tracking-[0.2em]
                          text-brown
                          opacity-0
                          transition-opacity
                          duration-500
                          group-hover:opacity-100
                        "
                      >
                        Explore
                      </span>

                    </div>

                    {/* THIN LINE */}

                    <div className="mt-4 h-px w-full bg-black/10 transition-colors duration-500 group-hover:bg-brown/40" />

                  </div>

                </Link>

              </motion.article>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          BOTTOM EDITORIAL CTA
      ===================================================== */}

      <section className="border-t border-black/10 bg-warm-white px-6 py-20 sm:py-24 lg:py-28">
        <div className="page-container">

          <motion.div
            className="mx-auto max-w-3xl text-center"
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
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <p className="eyebrow text-brown">
              Your Bridal Chapter
            </p>

            <h2 className="luxury-heading mt-5 text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              The beginning
              <br />
              of forever.
            </h2>

            <p className="editorial-copy mx-auto mt-6 max-w-xl">
              Discover a bridal ensemble selected around
              your celebration, your style and your moment.
            </p>

            <Link
              to={`/${language}/appointment`}
              className="
                group
                mt-8
                inline-flex
                items-center
                gap-5
                border
                border-ink
                px-7
                py-4
                text-[9px]
                font-medium
                uppercase
                tracking-[0.23em]
                transition-all
                duration-500
                hover:bg-ink
                hover:text-white
              "
            >
              Book an Appointment

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
      </section>

    </main>
  );
}

export default BridalPage;