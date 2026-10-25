import { lazy, Suspense, useEffect, useRef } from "react";
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
import AnnouncementTicker from "./components/layout/AnnouncementTicker";

const AdminAccess = lazy(() => import("./admin/AdminAccess"));

const languages = ["en", "de", "fr", "it"] as const;

type Language = (typeof languages)[number];

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const refreshChecked = useRef(false);

  const isAdminRoute =
    location.pathname.toLowerCase() === "/admin" ||
    location.pathname.toLowerCase().startsWith("/admin/");

  useEffect(() => {
    if (refreshChecked.current) {
      return;
    }

    refreshChecked.current = true;

    if (isAdminRoute) {
      return;
    }

    const navigationEntry = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;

    if (navigationEntry?.type !== "reload") {
      return;
    }

    const pathParts = location.pathname.split("/").filter(Boolean);
    const currentLanguage = pathParts[0];

    const language: Language = languages.includes(
      currentLanguage as Language,
    )
      ? (currentLanguage as Language)
      : "en";

    const homePath = `/${language}`;

    if (location.pathname !== homePath) {
      navigate(homePath, { replace: true });
    }
  }, [isAdminRoute, location.pathname, navigate]);

  return (
    <>
      <ScrollToTop />

      {!isAdminRoute && (
        <>
          <LoadingScreen />
          <LanguageSync />
          <Header />
          <AnnouncementTicker />
        </>
      )}

      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div role="status" style={{ padding: 32 }}>
                  Loading admin workspace…
                </div>
              }
            >
              <AdminAccess />
            </Suspense>
          }
        />

        <Route path="/" element={<Navigate to="/en" replace />} />

        {languages.map((language) => (
          <Route key={language} path={`/${language}`}>
            <Route index element={<HomePage />} />

            <Route path="lehengas" element={<LehengasPage />} />
            <Route path="lehengas/bridal" element={<LehengasPage />} />
            <Route path="lehengas/occasion" element={<LehengasPage />} />
            <Route
              path="lehengas/:slug"
              element={<CollectionDetailPage />}
            />

            <Route path="sarees" element={<SareesPage />} />
            <Route path="sarees/bridal" element={<SareesPage />} />
            <Route path="sarees/occasion" element={<SareesPage />} />
            <Route
              path="sarees/:slug"
              element={<CollectionDetailPage />}
            />

            <Route path="sherwanis" element={<SherwanisPage />} />
            <Route path="sherwanis/groom" element={<SherwanisPage />} />
            <Route
              path="sherwanis/occasion"
              element={<SherwanisPage />}
            />
            <Route
              path="sherwanis/:slug"
              element={<CollectionDetailPage />}
            />

            <Route path="collections" element={<CollectionsPage />} />
            <Route
              path="collections/:slug"
              element={<CollectionDetailPage />}
            />

            <Route path="our-story" element={<OurStoryPage />} />
            <Route path="showroom" element={<ShowroomPage />} />
            <Route path="appointment" element={<AppointmentPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        ))}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppContent />;
}