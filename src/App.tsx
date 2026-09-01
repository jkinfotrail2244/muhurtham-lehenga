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

const languages = ["en", "de", "fr", "it", "ta"];

/* ============================================================
   APP CONTENT
============================================================ */

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Prevent the refresh redirect from running again
   * after React Router navigation.
   */
  const refreshChecked = useRef(false);

  /* ==========================================================
     REFRESH → LANGUAGE HOME
     
     IMPORTANT:
     
     This check runs ONLY ONCE when the application
     initially loads.
     
     Example:
     
     Browser refresh:
       /en/sherwanis
              ↓
       /en
     
     Browser refresh:
       /en/sarees
              ↓
       /en
     
     Browser refresh:
       /de/collections
              ↓
       /de
     
     But normal navigation:
     
       /en
        ↓ click Collections
       /en/collections
     
     WILL NOT redirect back to /en.
  ========================================================== */

  useEffect(() => {
    if (refreshChecked.current) {
      return;
    }

    refreshChecked.current = true;

    const navigationEntry =
      performance.getEntriesByType(
        "navigation",
      )[0] as
        | PerformanceNavigationTiming
        | undefined;

    /*
     * Only continue when the browser actually
     * performed a page reload.
     */
    if (navigationEntry?.type !== "reload") {
      return;
    }

    const pathParts = location.pathname
      .split("/")
      .filter(Boolean);

    const currentLanguage =
      pathParts[0];

    const language = languages.includes(
      currentLanguage,
    )
      ? currentLanguage
      : "en";

    const homePath = `/${language}`;

    /*
     * If the refreshed page is deeper than
     * the language home, return to the home page.
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
          GLOBAL LOADING SCREEN
      ===================================================== */}

      <LoadingScreen />

      {/* =====================================================
          LANGUAGE SYNC
      ===================================================== */}

      <LanguageSync />

      {/* =====================================================
          GLOBAL HEADER
      ===================================================== */}

      <Header />

      {/* =====================================================
          ROUTES
      ===================================================== */}

      <Routes>

        {/* ===================================================
            ROOT
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
            =============================================== */}

            <Route
              index
              element={<HomePage />}
            />

            {/* ===============================================
                LEHENGAS
            =============================================== */}

            <Route
              path="lehengas"
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
            <Route path="lehengas" element={<LehengasPage />} />
<Route path="lehengas/bridal" element={<LehengasPage />} />
<Route path="lehengas/occasion" element={<LehengasPage />} />

<Route path="lehengas/:slug" element={<CollectionDetailPage />} />

            {/* ===============================================
                SHERWANIS
            =============================================== */}

            <Route
              path="sherwanis"
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
            <Route path="sherwanis" element={<SherwanisPage />} />
<Route path="sherwanis/groom" element={<SherwanisPage />} />
<Route path="sherwanis/occasion" element={<SherwanisPage />} />

<Route path="sherwanis/:slug" element={<CollectionDetailPage />} />

            {/* ===============================================
                SAREES
            =============================================== */}

            {/* Main Saree catalogue */}

            <Route
              path="sarees"
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
            <Route path="sarees" element={<SareesPage />} />
<Route path="sarees/bridal" element={<SareesPage />} />
<Route path="sarees/occasion" element={<SareesPage />} />

<Route path="sarees/:slug" element={<CollectionDetailPage />} />

            {/* ===============================================
                COLLECTIONS
            =============================================== */}

            <Route
              path="collections"
              element={
                <CollectionsPage />
              }
            />

            {/* Collection category/detail pages */}

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
                LANGUAGE 404
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
  return <AppContent />;
}

export default App;