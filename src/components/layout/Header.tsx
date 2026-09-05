import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../navigation/LanguageSwitcher";
import MegaMenu from "../navigation/MegaMenu";
import MobileMenu from "./MobileMenu";

/* ============================================================
   HEADER NAVIGATION
============================================================ */

const headerItems = [
  {
    key: "home",
    path: "",
    hasMegaMenu: false,
  },
  {
    key: "lehengas",
    path: "lehengas",
    hasMegaMenu: true,
  },
  {
    key: "sarees",
    path: "sarees",
    hasMegaMenu: true,
  },
  {
    key: "sherwanis",
    path: "sherwanis",
    hasMegaMenu: true,
  },
  {
    key: "collections",
    path: "collections",
    hasMegaMenu: true,
  },
  {
    key: "ourStory",
    path: "our-story",
    hasMegaMenu: false,
  },
  {
    key: "showroom",
    path: "showroom",
    hasMegaMenu: false,
  },
  {
    key: "appointment",
    path: "appointment",
    hasMegaMenu: false,
  },
];

/* ============================================================
   SEARCH DATA
============================================================ */

const searchItems = [
  {
    name: "Lehengas",
    description: "Bridal & occasion lehengas",
    path: "lehengas",
  },
  {
    name: "Sarees",
    description: "Bridal & occasion sarees",
    path: "sarees",
  },
  {
    name: "Sherwanis",
    description: "Groom & occasion sherwanis",
    path: "sherwanis",
  },
  {
    name: "Collections",
    description: "Explore the Muhurtham collections",
    path: "collections",
  },
  {
    name: "Our Story",
    description: "Discover the story behind Muhurtham",
    path: "our-story",
  },
  {
    name: "Showroom",
    description: "Visit our showroom",
    path: "showroom",
  },
  {
    name: "Appointment",
    description: "Book a private appointment",
    path: "appointment",
  },
];

/* ============================================================
   COMPONENT
============================================================ */

function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [megaMenu, setMegaMenu] =
    useState<string | null>(null);

  /* ==========================================================
     SEARCH STATE
  ========================================================== */

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  /* ==========================================================
     GET CURRENT LANGUAGE
  ========================================================== */

  const pathnameParts =
    location.pathname.split("/");

  const supportedLanguages = [
    "en",
    "de",
    "fr",
    "it",
  ];

  const language = supportedLanguages.includes(
    pathnameParts[1],
  )
    ? pathnameParts[1]
    : "en";

  /* ==========================================================
     CLOSE MENUS
  ========================================================== */

  const closeMenus = () => {
    setMegaMenu(null);
    setMobileOpen(false);
  };

  /* ==========================================================
     NAVIGATION PATH
  ========================================================== */

  const getPath = (path: string) => {
    if (!path) {
      return `/${language}`;
    }

    return `/${language}/${path}`;
  };

  /* ==========================================================
     ACTIVE NAVIGATION
  ========================================================== */

  const isActive = (path: string) => {
    const targetPath = getPath(path);

    if (path === "") {
      return location.pathname === targetPath;
    }

    return (
      location.pathname === targetPath ||
      location.pathname.startsWith(
        `${targetPath}/`,
      )
    );
  };

  /* ==========================================================
     NAVIGATION LABEL
  ========================================================== */

  const getLabel = (key: string) => {
    const translationKey =
      `navigation.${key}`;

    const translated = t(
      translationKey,
      {
        defaultValue: "",
      },
    );

    if (translated) {
      return translated;
    }

    const fallbackLabels: Record<
      string,
      string
    > = {
      home: "Home",
      lehengas: "Lehengas",
      sarees: "Sarees",
      sherwanis: "Sherwanis",
      collections: "Collections",
      ourStory: "Our Story",
      showroom: "Showroom",
      appointment: "Appointment",
    };

    return (
      fallbackLabels[key] || key
    );
  };

  /* ==========================================================
     OPEN SEARCH
  ========================================================== */

  const openSearch = () => {
    setSearchOpen(true);
    setMegaMenu(null);
    setMobileOpen(false);
  };

  /* ==========================================================
     CLOSE SEARCH
  ========================================================== */

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  /* ==========================================================
     SEARCH RESULTS
  ========================================================== */

  const filteredSearchItems =
    searchItems.filter((item) => {
      const query =
        searchQuery.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        item.name
          .toLowerCase()
          .includes(query) ||
        item.description
          .toLowerCase()
          .includes(query)
      );
    });

  /* ==========================================================
     SEARCH NAVIGATION
  ========================================================== */

  const handleSearchNavigation = (
    path: string,
  ) => {
    closeSearch();
    closeMenus();
    navigate(getPath(path));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="relative z-50 border-b border-black/8 bg-warm-white"
        onMouseLeave={() =>
          setMegaMenu(null)
        }
      >
        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <div className="hidden h-12 items-center justify-between border-b border-black/6 px-8 lg:flex">

          {/* =================================================
              CUSTOMER CARE
          ================================================= */}

          <div className="flex items-center gap-5">

            <a
              href="https://wa.me/94757233942"
              target="_blank"
              rel="noreferrer"
              className="flex items-center text-[9px] font-medium uppercase tracking-[0.18em] text-ink transition-opacity duration-300 hover:opacity-55"
              aria-label="Customer Care"
            >
              <span className="mr-3 text-brown">
                ●
              </span>

              {t(
                "common.customerCare",
                {
                  defaultValue:
                    "Customer Care",
                },
              )}
            </a>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-6">

            {/* SEARCH */}

            <button
              type="button"
              onClick={openSearch}
              className="transition-opacity duration-300 hover:opacity-55"
              aria-label={t(
                "common.search",
                {
                  defaultValue:
                    "Search",
                },
              )}
            >
              <Search
                size={17}
                strokeWidth={1.25}
              />
            </button>

            {/* LANGUAGE */}

            <LanguageSwitcher />

          </div>
        </div>

        {/* =====================================================
            BRAND ROW
        ===================================================== */}

        <div className="flex h-23 items-center justify-center px-5 lg:h-29.5">
          <Link
            to={`/${language}`}
            onClick={closeMenus}
            className="group text-center"
            aria-label="Muhurtham Collection Home"
          >
            <span className="block font-display text-[28px] uppercase leading-none tracking-[0.24em] sm:text-[34px] lg:text-[43px]">
              Muhurtham
            </span>

            <span className="mt-2 block text-[7px] font-medium uppercase tracking-[0.38em] text-brown opacity-80">
              Collection
            </span>
          </Link>
        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav className="hidden h-14.5 items-center justify-center lg:flex">
          <div className="flex items-center gap-9">

            {headerItems.map((item) => {

              const active =
                isActive(item.path);

              const label =
                getLabel(item.key);

              /* =================================================
                 MEGA MENU NAVIGATION
              ================================================= */

              if (item.hasMegaMenu) {
                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() =>
                      setMegaMenu(
                        item.key,
                      )
                    }
                  >
                    <Link
                      to={getPath(
                        item.path,
                      )}
                      onClick={() => {
                        setMegaMenu(null);
                        setMobileOpen(false);
                      }}
                      className={`group relative block py-5 text-[9px] font-medium uppercase tracking-[0.2em] transition-opacity duration-300 ${
                        active
                          ? "text-brown"
                          : "text-ink hover:opacity-55"
                      }`}
                    >
                      {label}

                      <span
                        className={`absolute bottom-2 left-0 h-px bg-brown transition-all duration-300 ${
                          active
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>
                  </div>
                );
              }

              /* =================================================
                 NORMAL NAVIGATION
              ================================================= */

              return (
                <Link
                  key={item.key}
                  to={getPath(
                    item.path,
                  )}
                  onClick={closeMenus}
                  className={`group relative py-5 text-[9px] font-medium uppercase tracking-[0.2em] transition-opacity duration-300 ${
                    active
                      ? "text-brown"
                      : "text-ink hover:opacity-55"
                  }`}
                >
                  {label}

                  <span
                    className={`absolute bottom-2 left-0 h-px bg-brown transition-all duration-300 ${
                      active
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}

          </div>
        </nav>

        {/* =====================================================
            MOBILE BAR
        ===================================================== */}

        <div className="flex h-16 items-center justify-between border-t border-black/6 px-5 lg:hidden">

          {/* MENU */}

          <button
            type="button"
            onClick={() => {
              setMegaMenu(null);
              setMobileOpen(true);
            }}
            className="flex items-center gap-2"
            aria-label={t(
              "common.menu",
              {
                defaultValue:
                  "Menu",
              },
            )}
          >
            <Menu
              size={20}
              strokeWidth={1.2}
            />

            <span className="text-[9px] uppercase tracking-[0.18em]">
              {t(
                "common.menu",
                {
                  defaultValue:
                    "Menu",
                },
              )}
            </span>
          </button>

          {/* MOBILE RIGHT SIDE */}

          <div className="flex items-center gap-5">

            {/* SEARCH */}

            <button
              type="button"
              onClick={openSearch}
              aria-label={t(
                "common.search",
                {
                  defaultValue:
                    "Search",
                },
              )}
              className="transition-opacity duration-300 hover:opacity-55"
            >
              <Search
                size={18}
                strokeWidth={1.2}
              />
            </button>

            {/* LANGUAGE */}

            <LanguageSwitcher />

            {/* CLOSE */}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setMegaMenu(null);
              }}
              className={
                mobileOpen
                  ? "block"
                  : "hidden"
              }
              aria-label={t(
                "common.close",
                {
                  defaultValue:
                    "Close",
                },
              )}
            >
              <X
                size={20}
                strokeWidth={1.2}
              />
            </button>

          </div>
        </div>

        {/* =====================================================
            MEGA MENU
        ===================================================== */}

        <MegaMenu
          activeCategory={megaMenu}
          language={language}
          onClose={() =>
            setMegaMenu(null)
          }
        />

      </header>

      {/* =======================================================
          MOBILE MENU
      ======================================================= */}

      <MobileMenu
        open={mobileOpen}
        onClose={closeMenus}
      />

      {/* =======================================================
          SEARCH OVERLAY
      ======================================================= */}

      {searchOpen && (
        <div className="fixed inset-0 z-100 bg-[#F8F5F0]">

          {/* =================================================
              SEARCH HEADER
          ================================================= */}

          <div className="flex h-20 items-center justify-between border-b border-black/8 px-6 sm:px-10 lg:px-16">

            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-brown">
              Search
            </p>

            <button
              type="button"
              onClick={closeSearch}
              className="flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.2em] text-ink transition-opacity duration-300 hover:opacity-55"
              aria-label="Close Search"
            >
              Close

              <X
                size={18}
                strokeWidth={1.2}
              />
            </button>

          </div>

          {/* =================================================
              SEARCH CONTENT
          ================================================= */}

          <div className="mx-auto max-w-5xl px-6 py-14 sm:px-10 sm:py-20 lg:px-16">

            {/* SEARCH INPUT */}

            <div className="border-b border-black/20">

              <div className="flex items-center gap-4 pb-5">

                <Search
                  size={22}
                  strokeWidth={1}
                  className="text-black/45"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value,
                    )
                  }
                  autoFocus
                  placeholder="Search lehengas, sarees, sherwanis..."
                  className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-black/25 sm:text-3xl lg:text-4xl"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery("")
                    }
                    className="text-black/35 transition-opacity hover:opacity-60"
                    aria-label="Clear search"
                  >
                    <X
                      size={18}
                      strokeWidth={1.2}
                    />
                  </button>
                )}

              </div>

            </div>

            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            <div className="mt-12">

              <div className="mb-6 flex items-center justify-between">

                <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
                  {searchQuery
                    ? `${filteredSearchItems.length} Results`
                    : "Explore"}
                </p>

              </div>

              {filteredSearchItems.length > 0 ? (
                <div className="divide-y divide-black/8 border-t border-black/8">

                  {filteredSearchItems.map(
                    (item) => (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() =>
                          handleSearchNavigation(
                            item.path,
                          )
                        }
                        className="group flex w-full items-center justify-between py-6 text-left transition-opacity duration-300 hover:opacity-60"
                      >

                        <div>

                          <p className="font-display text-2xl text-ink sm:text-3xl">
                            {item.name}
                          </p>

                          <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-black/40">
                            {item.description}
                          </p>

                        </div>

                        <span className="text-xl text-brown transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                          ↗
                        </span>

                      </button>
                    ),
                  )}

                </div>
              ) : (
                <div className="border-t border-black/8 py-12">

                  <p className="font-display text-2xl">
                    No results found
                  </p>

                  <p className="mt-3 text-sm text-black/45">
                    Try searching for lehengas,
                    sarees, sherwanis or
                    collections.
                  </p>

                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Header;