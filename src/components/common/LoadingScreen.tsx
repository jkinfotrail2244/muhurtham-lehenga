import { useEffect, useRef, useState } from "react";

function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  const animationFrameRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;

    // Premium, slower loading experience
    const duration = 4000;

    const animate = (time: number) => {
      if (startTime === null) {
        startTime = time;
      }

      const elapsed = time - startTime;
      const percentage = Math.min(elapsed / duration, 1);

      /*
       * Smooth ease-in-out motion.
       * Keeps the beginning gentle,
       * accelerates through the middle,
       * then slows elegantly near 100%.
       */
      const eased =
        percentage < 0.5
          ? 2 * percentage * percentage
          : 1 - Math.pow(-2 * percentage + 2, 2) / 2;

      setProgress(Math.round(eased * 100));

      if (percentage < 1) {
        animationFrameRef.current =
          requestAnimationFrame(animate);
      } else {
        /*
         * Hold at 100% briefly before
         * fading the loading screen away.
         */
        hideTimeoutRef.current = window.setTimeout(() => {
          setVisible(false);
        }, 700);
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-9999 overflow-hidden bg-[#faf8f3] transition-opacity duration-700 ease-out ${
        visible
          ? "opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 bg-[#faf8f3]" />

      {/* CENTRAL SOFT LIGHT */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(250,248,243,0.4) 45%, transparent 72%)",
        }}
      />

      {/* =====================================================
          TOP LEFT SILK
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-24 h-82.5 w-170 rotate-[-17deg] opacity-80">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(145deg, #efe4d2 0%, #fffdf8 28%, #e4d2b8 48%, #f8f1e7 66%, #d9c29e 100%)",
            clipPath:
              "polygon(0 25%, 18% 9%, 43% 17%, 62% 4%, 81% 13%, 100% 0%, 88% 34%, 66% 42%, 48% 56%, 30% 48%, 11% 67%, 0 58%)",
            filter:
              "drop-shadow(0 18px 25px rgba(112, 82, 52, 0.10))",
          }}
        />

        <div
          className="absolute -left-5 top-18.75 h-32.5 w-155"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), rgba(190,155,110,0.35), transparent)",
            clipPath:
              "polygon(0 48%, 22% 27%, 44% 38%, 64% 19%, 83% 29%, 100% 8%, 86% 52%, 64% 68%, 43% 57%, 23% 74%, 0 68%)",
          }}
        />
      </div>

      {/* =====================================================
          BOTTOM RIGHT SILK
      ===================================================== */}

      <div className="pointer-events-none absolute -bottom-32 -right-36 h-92.5 w-190 rotate-[-14deg] opacity-85">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #e5d4b9 0%, #fffdf9 25%, #dfc9a7 43%, #f9f2e8 62%, #d6bd96 100%)",
            clipPath:
              "polygon(0 78%, 16% 57%, 35% 65%, 51% 44%, 69% 50%, 83% 25%, 100% 8%, 94% 38%, 77% 62%, 61% 67%, 45% 84%, 26% 79%, 8% 100%)",
            filter:
              "drop-shadow(0 -10px 30px rgba(112, 82, 52, 0.10))",
          }}
        />

        <div
          className="absolute bottom-10 -right-7.5 h-35 w-175"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), rgba(191,155,105,0.30), transparent)",
            clipPath:
              "polygon(0 72%, 19% 46%, 39% 57%, 58% 32%, 75% 40%, 91% 13%, 100% 0%, 88% 39%, 70% 60%, 51% 54%, 32% 78%, 12% 72%, 0 100%)",
          }}
        />
      </div>

      {/* =====================================================
          SMALL GOLD CORNER ACCENTS
      ===================================================== */}

      <div className="pointer-events-none absolute left-[7%] top-[32%] h-px w-20 bg-linear-to-r from-transparent via-[#c8a16f]/45 to-transparent" />

      <div className="pointer-events-none absolute right-[7%] top-[32%] h-px w-20 bg-linear-to-r from-transparent via-[#c8a16f]/45 to-transparent" />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="flex w-full max-w-175 flex-col items-center text-center">

          {/* =================================================
              LOTUS EMBLEM
          ================================================= */}

          <div
            className={`mb-6 transition-all duration-1000 ease-out ${
              progress > 5
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Top petal */}
              <path
                d="M36 8C30.5 14 29.5 21 36 29C42.5 21 41.5 14 36 8Z"
                stroke="#c9a36f"
                strokeWidth="1.4"
              />

              {/* Left inner petal */}
              <path
                d="M35.5 29C27 20.5 20 21 17 23C18.5 32 25 36 35.5 35"
                stroke="#c9a36f"
                strokeWidth="1.4"
              />

              {/* Right inner petal */}
              <path
                d="M36.5 29C45 20.5 52 21 55 23C53.5 32 47 36 36.5 35"
                stroke="#c9a36f"
                strokeWidth="1.4"
              />

              {/* Left outer petal */}
              <path
                d="M35 34C24 27 14 29 10 33C15 42 24 45 35 40"
                stroke="#c9a36f"
                strokeWidth="1.4"
              />

              {/* Right outer petal */}
              <path
                d="M37 34C48 27 58 29 62 33C57 42 48 45 37 40"
                stroke="#c9a36f"
                strokeWidth="1.4"
              />

              {/* Bottom petal */}
              <path
                d="M36 35C29 42 29 50 36 57C43 50 43 42 36 35Z"
                stroke="#c9a36f"
                strokeWidth="1.4"
              />

              {/* Center diamond */}
              <path
                d="M36 25L39 30L36 35L33 30L36 25Z"
                fill="#c9a36f"
              />

              {/* Stem */}
              <path
                d="M36 57V65"
                stroke="#c9a36f"
                strokeWidth="1.4"
              />

              {/* Tiny top diamond */}
              <path
                d="M36 4L39 8L36 12L33 8L36 4Z"
                fill="#c9a36f"
              />
            </svg>
          </div>

          {/* =================================================
              DECORATIVE LINE + LOGO
          ================================================= */}

          <div
            className={`flex w-full items-center justify-center gap-5 transition-all duration-1000 ease-out ${
              progress > 12
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#a67c4d]/55 sm:w-24" />

            <div
              className="font-display text-[43px] font-normal uppercase leading-none tracking-[0.20em] text-[#171513] sm:text-[58px]"
              style={{
                textShadow:
                  "0 1px 1px rgba(0,0,0,0.03)",
              }}
            >
              MUHURTHAM
            </div>

            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#a67c4d]/55 sm:w-24" />
          </div>

          {/* =================================================
              COLLECTION
          ================================================= */}

          <div
            className={`mt-5 text-[9px] font-medium uppercase tracking-[0.65em] text-[#806044] transition-all duration-1000 ease-out ${
              progress > 18
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
          >
            COLLECTION
          </div>

          {/* =================================================
              PROGRESS
          ================================================= */}

          <div
            className={`mt-12 w-full max-w-140 transition-all duration-1000 ease-out ${
              progress > 20
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            <div className="flex items-center gap-5">

              {/* Progress track */}
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#e9e2d8]">
                {/* Progress fill */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, #9c713f 0%, #d7b27d 72%, #b18755 100%)",
                    boxShadow:
                      "0 0 10px rgba(166,124,77,0.18)",
                    transition:
                      "width 100ms linear",
                  }}
                />

                {/* Progress point */}
                <div
                  className="absolute top-1/2 h-3.75 w-3.75 -translate-y-1/2 rounded-full border border-[#b78b56]/50 bg-[#c19a67]"
                  style={{
                    left: `calc(${progress}% - 7px)`,
                    boxShadow:
                      "0 2px 8px rgba(120,82,38,0.25)",
                    transition:
                      "left 100ms linear",
                  }}
                />
              </div>

              {/* Percentage */}
              <div className="w-10 text-left font-serif text-[14px] text-[#604b36]">
                {progress}%
              </div>
            </div>
          </div>

          {/* =================================================
              TAGLINE
          ================================================= */}

          <div
            className={`mt-9 text-[8px] font-medium uppercase tracking-[0.50em] text-[#795a3d] transition-all duration-1000 ease-out sm:text-[9px] ${
              progress > 38
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            DRESSING YOUR MOST BEAUTIFUL MOMENTS
          </div>

          {/* =================================================
              BOTTOM ORNAMENT
          ================================================= */}

          <div
            className={`mt-14 flex flex-col items-center transition-all duration-1000 ease-out ${
              progress > 55
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            <div className="h-14 w-px bg-linear-to-b from-[#b38a5b]/70 via-[#b38a5b]/40 to-transparent" />

            <div className="mt-5 text-[8px] font-medium uppercase leading-[2.1] tracking-[0.48em] text-[#85664a]">
              TRADITION
              <br />
              MEETS
              <br />
              TIMELESS ELEGANCE
            </div>

            <div className="mt-4 text-[16px] text-[#a2784b]">
              ✦
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          VERY SUBTLE VIGNETTE
      ===================================================== */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(105,76,46,0.035) 100%)",
        }}
      />
    </div>
  );
}

export default LoadingScreen;