import { useEffect, useRef } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import LoadingScreen from "./components/common/LoadingScreen";

import HomePage from "./pages/HomePage";
import LehengasPage from "./pages/LehengasPage";
import SherwanisPage from "./pages/SherwanisPage";
import SareesPage from "./pages/SareesPage";

import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";

import OurStoryPage from "./pages/OurStoryPage";
import ShowroomPage from "./pages/ShowroomPage";
import AppointmentPage from "./pages/AppointmentPage";
import NotFoundPage from "./pages/NotFoundPage";

import LanguageSync from "./components/navigation/LanguageSync";
import Header from "./components/layout/Header";

/* ============================================================
   SUPPORTED LANGUAGES
============================================================ */

const languages = ["en", "de", "fr", "it"] as const;

type Language = (typeof languages)[number];

/* ============================================================
   SCROLL TO TOP
============================================================ */

/*
 * Whenever the route changes, start the new page at the top.
 *
 * This prevents a problem where:
 *
 * Home
 *   ↓ user scrolls to bottom
 *   ↓ clicks Showroom
 * Showroom opens at the same scroll position
 *
 * Instead:
 *
 * Home
 *   ↓ click Showroom
 * Showroom always opens from the top.
 */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    /*
     * Prevent the browser from restoring the previous
     * scroll position automatically.
     */
    window.history.scrollRestoration = "manual";

    /*
     * Always start the newly opened route at the top.
     */
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

/* ============================================================
   APP CONTENT
============================================================ */

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Prevent the refresh redirect from running more than once
   * during the initial application load.
   */
  const refreshChecked = useRef(false);

  /* ==========================================================
     REFRESH → LANGUAGE HOME

     On an actual browser refresh:

       /en/sherwanis
             ↓
       /en

       /fr/collections
             ↓
       /fr

     Normal React Router navigation is NOT affected.

       /en
        ↓ click Collections
       /en/collections

     remains /en/collections.
  ========================================================== */

  useEffect(() => {
    if (refreshChecked.current) {
      return;
    }

    refreshChecked.current = true;

    const navigationEntry =
      performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;

    /*
     * Only perform the redirect when the browser
     * navigation was an actual reload.
     */
    if (navigationEntry?.type !== "reload") {
      return;
    }

    const pathParts = location.pathname
      .split("/")
      .filter(Boolean);

    const currentLanguage = pathParts[0];

    const language: Language = languages.includes(
      currentLanguage as Language,
    )
      ? (currentLanguage as Language)
      : "en";

    const homePath = `/${language}`;

    /*
     * If the user refreshed a deeper page,
     * return to the language home page.
     */
    if (location.pathname !== homePath) {
      navigate(homePath, {
        replace: true,
      });
    }
  }, [location.pathname, navigate]);

  return (
    <>
      {/* =====================================================
          GLOBAL SCROLL MANAGEMENT

          This must be outside Routes so it works for
          every page in the website.
      ===================================================== */}

      <ScrollToTop />

      {/* =====================================================
          GLOBAL LOADING SCREEN
      ===================================================== */}

      <LoadingScreen />

      {/* =====================================================
          GLOBAL LANGUAGE SYNCHRONIZATION
      ===================================================== */}

      <LanguageSync />

      {/* =====================================================
          GLOBAL HEADER

          Header is available throughout the website.
      ===================================================== */}

      <Header />

      {/* =====================================================
          ROUTES
      ===================================================== */}

      <Routes>
        {/* ===================================================
            ROOT

            / → /en
        =================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/en"
              replace
            />
          }
        />

        {/* ===================================================
            LANGUAGE ROUTES
        =================================================== */}

        {languages.map((language) => (
          <Route
            key={language}
            path={`/${language}`}
          >
            {/* ===============================================
                HOME

                /en
                /de
                /fr
                /it
            =============================================== */}

            <Route
              index
              element={<HomePage />}
            />

            {/* ===============================================
                LEHENGAS
            =============================================== */}

            {/* Main Lehenga Catalogue */}

            <Route
              path="lehengas"
              element={
                <LehengasPage />
              }
            />

            {/* Lehenga Bridal Category */}

            <Route
              path="lehengas/bridal"
              element={
                <LehengasPage />
              }
            />

            {/* Lehenga Occasion Category */}

            <Route
              path="lehengas/occasion"
              element={
                <LehengasPage />
              }
            />

            {/* Individual Lehenga */}

            <Route
              path="lehengas/:slug"
              element={
                <CollectionDetailPage />
              }
            />

            {/* ===============================================
                SAREES
            =============================================== */}

            {/* Main Saree Catalogue */}

            <Route
              path="sarees"
              element={
                <SareesPage />
              }
            />

            {/* Bridal Sarees */}

            <Route
              path="sarees/bridal"
              element={
                <SareesPage />
              }
            />

            {/* Occasion Sarees */}

            <Route
              path="sarees/occasion"
              element={
                <SareesPage />
              }
            />

            {/* Individual Saree */}

            <Route
              path="sarees/:slug"
              element={
                <CollectionDetailPage />
              }
            />

            {/* ===============================================
                SHERWANIS
            =============================================== */}

            {/* Main Sherwani Catalogue */}

            <Route
              path="sherwanis"
              element={
                <SherwanisPage />
              }
            />

            {/* Groom Sherwanis */}

            <Route
              path="sherwanis/groom"
              element={
                <SherwanisPage />
              }
            />

            {/* Occasion Sherwanis */}

            <Route
              path="sherwanis/occasion"
              element={
                <SherwanisPage />
              }
            />

            {/* Individual Sherwani */}

            <Route
              path="sherwanis/:slug"
              element={
                <CollectionDetailPage />
              }
            />

            {/* ===============================================
                COLLECTIONS
            =============================================== */}

            {/* Main Collections Page */}

            <Route
              path="collections"
              element={
                <CollectionsPage />
              }
            />

            {/* Individual Collection */}

            <Route
              path="collections/:slug"
              element={
                <CollectionDetailPage />
              }
            />

            {/* ===============================================
                OUR STORY
            =============================================== */}

            <Route
              path="our-story"
              element={
                <OurStoryPage />
              }
            />

            {/* ===============================================
                SHOWROOM
            =============================================== */}

            <Route
              path="showroom"
              element={
                <ShowroomPage />
              }
            />

            {/* ===============================================
                APPOINTMENT
            =============================================== */}

            <Route
              path="appointment"
              element={
                <AppointmentPage />
              }
            />

            {/* ===============================================
                LANGUAGE-SPECIFIC 404
            =============================================== */}

            <Route
              path="*"
              element={
                <NotFoundPage />
              }
            />
          </Route>
        ))}

        {/* ===================================================
            GLOBAL 404
        =================================================== */}

        <Route
          path="*"
          element={
            <NotFoundPage />
          }
        />
      </Routes>
    </>
  );
}

/* ============================================================
   APP
============================================================ */

function App() {
  return (
    <AppContent />
  );
}

export default App;