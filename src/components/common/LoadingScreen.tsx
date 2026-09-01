import { useEffect, useRef, useState } from "react";

function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (lineRef.current) {
        lineRef.current.style.width = "100%";
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center bg-warm-white transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onTransitionEnd={() => {
        if (!visible) {
          // Keep the component mounted only until the fade finishes.
        }
      }}
    >
      <div className="w-55 sm:w-70">
        {/* BRAND */}
        <div className="text-center">
          <div className="font-display text-[28px] uppercase leading-none tracking-[0.24em] sm:text-[34px]">
            Muhurtham
          </div>

          <div className="mt-3 text-[6px] font-medium uppercase tracking-[0.42em] text-brown">
            Collection
          </div>
        </div>

        {/* LOADING LINE */}
        <div className="mt-8 h-px w-full overflow-hidden bg-black/10">
          <div
            ref={lineRef}
            className="h-full bg-brown"
            style={{
              width: "0%",
              transition:
                "width 1600ms cubic-bezier(0.65, 0, 0.35, 1)",
            }}
            onTransitionEnd={() => {
              setTimeout(() => {
                setVisible(false);
              }, 200);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;