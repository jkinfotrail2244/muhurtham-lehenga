import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { navigationItems } from "../../data/navigation";
import LanguageSwitcher from "../navigation/LanguageSwitcher";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const [expanded, setExpanded] = useState<string | null>(
    null,
  );

  const language =
    location.pathname.split("/")[1] || "en";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-90 bg-black/20 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed right-0 top-0 z-100 flex h-dvh w-[min(88vw,430px)] flex-col bg-ivory"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-6">
              <span className="eyebrow text-brown">
                {t("common.menu")}
              </span>

              <button
                type="button"
                onClick={onClose}
                aria-label={t("common.close")}
              >
                <X size={21} strokeWidth={1.2} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-8">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const label = t(
                    `navigation.${item.key}`,
                  );

                  if (!item.hasMegaMenu) {
                    return (
                      <Link
                        key={item.key}
                        to={`/${language}/${item.path}`}
                        onClick={onClose}
                        className="block border-b border-black/8 py-5 font-display text-2xl"
                      >
                        {label}
                      </Link>
                    );
                  }

                  const isExpanded =
                    expanded === item.key;

                  return (
                    <div
                      key={item.key}
                      className="border-b border-black/8"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded(
                            isExpanded
                              ? null
                              : item.key,
                          )
                        }
                        className="flex w-full items-center justify-between py-5 font-display text-2xl"
                      >
                        {label}

                        <ChevronDown
                          size={17}
                          strokeWidth={1.2}
                          className={`transition-transform duration-300 ${
                            isExpanded
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4 pl-2">
                              <Link
                                to={`/${language}/${item.path}`}
                                onClick={onClose}
                                className="block py-3 text-[10px] uppercase tracking-[0.16em] text-brown"
                              >
                                {t("common.viewAll")}
                              </Link>

                              <Link
                                to={`/${language}/${item.path}`}
                                onClick={onClose}
                                className="block py-3 text-sm text-black/60"
                              >
                                Explore the collection
                              </Link>

                              <Link
                                to={`/${language}/${item.path}`}
                                onClick={onClose}
                                className="block py-3 text-sm text-black/60"
                              >
                                Featured edit
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </nav>

            <div className="flex items-center justify-between border-t border-black/10 px-6 py-6">
              <span className="text-[9px] uppercase tracking-[0.18em] text-black/45">
                Language
              </span>

              <LanguageSwitcher />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;