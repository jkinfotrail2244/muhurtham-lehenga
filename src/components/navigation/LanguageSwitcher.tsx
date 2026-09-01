import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  supportedLanguages,
  type LanguageCode,
} from "../../i18n";

function LanguageSwitcher() {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    (location.pathname.split("/")[1] as LanguageCode) || "en";

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const changeLanguage = (language: LanguageCode) => {
    const segments = location.pathname.split("/");

    segments[1] = language;

    navigate(segments.join("/") || `/${language}`);

    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-opacity duration-300 hover:opacity-60"
        aria-expanded={open}
        aria-label="Select language"
      >
        {currentLanguage.toUpperCase()}

        <ChevronDown
          size={12}
          strokeWidth={1.4}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+14px)] z-50 min-w-42.5 border border-black/10 bg-warm-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          {(
            Object.entries(supportedLanguages) as [
              LanguageCode,
              string,
            ][]
          ).map(([code, name]) => (
            <button
              key={code}
              type="button"
              onClick={() => changeLanguage(code)}
              className={`flex w-full items-center justify-between px-4 py-3 text-left text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                currentLanguage === code
                  ? "bg-ivory text-brown"
                  : "text-ink hover:bg-ivory"
              }`}
            >
              <span>{name}</span>

              {currentLanguage === code && (
                <span className="text-[8px]">●</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;