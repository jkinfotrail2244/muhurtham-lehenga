
import { useMemo, useState } from "react";

import {
  Link,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import {
  ArrowUpRight,
  Bell,
  Box,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock3,
  ExternalLink,
  Flower2,
  House,
  LogOut,
  Menu,
  Package,
  Search,
  Tag,
  X,
} from "lucide-react";

/* =========================================
   PRODUCTS, OFFERS, APPOINTMENTS & AVAILABILITY
========================================= */

import ProductsPage from "./products/ProductsPage";
import OfferPage from "./offer/Offer";
import AppointmentPage from "./appointment/Appointment";
import AvailabilityPage from "./availability/Availability";

import {
  useProductStats,
} from "./services/productService";

import {
  useOfferStats,
} from "./service/offerService";

import {
  useAppointments,
  useAppointmentStats,
  acceptAppointment,
  rejectAppointment,
  type Appointment as StoredAppointment,
} from "./service/appointmentService";

import "./admin.css";
import "./appointment/appointment.css";

/* =========================================
   TYPES
========================================= */

type AdminAppProps = {
  onLogout: () => void;
};

type AppointmentTableProps = {
  appointments: StoredAppointment[];
  search: string;
};

type PlaceholderProps = {
  title: string;
  description: string;
  features: string[];
};

/* =========================================
   DATE HELPERS
========================================= */

function readableDate(value: string): string {
  if (!value) return "";
  const parts = value.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day, 12, 0, 0).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}



/* =========================================
   SIDEBAR NAVIGATION
========================================= */

const menu = [
  {
    to: "/admin",
    name: "Overview",
    icon: House,
    end: true,
  },
  {
    to: "/admin/products",
    name: "Products",
    icon: Box,
    end: false,
  },
  {
    to: "/admin/offers",
    name: "Discounts & Offers",
    icon: Tag,
    end: false,
  },
  {
    to: "/admin/appointments",
    name: "Appointments",
    icon: CalendarDays,
    end: false,
  },
  {
    to: "/admin/availability",
    name: "Availability",
    icon: Clock3,
    end: false,
  },
];

/* =========================================
   BOTANICAL DECORATION
========================================= */

function Botanical({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`mc-botanical ${className}`}
      viewBox="0 0 220 280"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      aria-hidden="true"
    >
      <path d="M22 275C67 218 55 169 99 126C130 95 126 42 167 10" />

      <path d="M75 204C37 184 27 163 18 147M93 144C59 118 57 96 53 79M116 100C150 87 173 66 187 48M59 240C90 223 112 223 133 225" />

      <path d="M18 147C44 145 57 158 75 204C42 197 21 178 18 147ZM53 79C81 94 92 115 93 144C66 135 48 109 53 79ZM187 48C157 42 136 66 116 100C154 99 178 83 187 48ZM133 225C114 202 91 202 59 240C94 243 118 240 133 225Z" />

      <path d="M167 10C156 37 139 48 126 42C139 17 151 10 167 10Z" />

      <path d="M27 263C38 226 27 210 9 202M109 130C135 132 149 145 162 158" />

      <path d="M9 202C37 200 54 216 27 263C9 244 5 226 9 202ZM162 158C137 162 121 150 109 130C133 119 151 128 162 158Z" />
    </svg>
  );
}

/* =========================================
   GOLDEN ORNAMENT
========================================= */

function Ornament({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={`mc-ornament ${className}`}
      aria-hidden="true"
    >
      <Flower2
        size={15}
        strokeWidth={1.4}
      />
    </span>
  );
}

/* =========================================
   APPOINTMENT STATUS BADGE
========================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  let modifier = "pending";
  if (status === "Accepted") modifier = "accepted";
  else if (status === "Rejected") modifier = "rejected";
  else if (status === "Modification Requested" || status === "Modified") modifier = "modification";

  return (
    <span className={`mc-apt-status mc-apt-status-${modifier}`}>
      <span className="mc-apt-status-dot" />
      {status}
    </span>
  );
}

/* =========================================
   APPOINTMENT TABLE (DIRECT BUTTONS, NO 3-DOT DROPDOWN)
========================================= */

function AppointmentTable({
  appointments,
  search,
}: AppointmentTableProps) {
  const [details, setDetails] = useState<StoredAppointment | null>(null);

  const displayed = appointments.filter((item) =>
    [
      item.id,
      item.customer,
      item.email,
      item.phone,
      item.service,
      item.date,
      item.time,
      item.status,
    ].some((value) =>
      value?.toLowerCase().includes(search.toLowerCase().trim()),
    ),
  );

  const selectedDetails = details
    ? appointments.find((item) => item.id === details.id) ?? details
    : null;

  return (
    <section className="mc-appointments-panel">
      {/* APPOINTMENT HEADING */}
      <header className="mc-appointments-heading">
        <div className="mc-panel-heading-main">
          <span className="mc-panel-icon">
            <CalendarDays size={24} strokeWidth={1.5} />
          </span>

          <div>
            <h2>
              Appointment requests
              <Ornament />
            </h2>

            <p>Customer consultation and showroom booking requests.</p>
          </div>
        </div>

        <Link className="mc-view-all" to="/admin/appointments">
          View all
          <ChevronRight size={18} />
        </Link>
      </header>

      {/* TABLE */}
      <div className="mc-table-scroll">
        <table className="mc-appointments-table">
          <thead>
            <tr>
              <th scope="col">Customer</th>
              <th scope="col">Appointment</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {displayed.map((item) => (
              <tr key={item.id}>
                {/* CUSTOMER */}
                <td>
                  <div className="mc-customer-cell">
                    <span className="mc-customer-avatar">
                      {item.customer.charAt(0).toUpperCase()}
                    </span>

                    <span>
                      <strong>{item.customer}</strong>
                      <small>{item.id}</small>
                    </span>
                  </div>
                </td>

                {/* APPOINTMENT */}
                <td>{item.service}</td>

                {/* DATE */}
                <td>{readableDate(item.date)}</td>

                {/* TIME */}
                <td>{item.time}</td>

                {/* STATUS */}
                <td>
                  <StatusBadge status={item.status} />
                </td>

                {/* ACTIONS - DIRECT VISIBLE BUTTONS */}
                <td className="mc-table-actions">
                  <div className="mc-apt-actions">
                    {item.status === "Pending" ? (
                      <>
                        <button
                          type="button"
                          className="mc-btn-accept"
                          onClick={() => acceptAppointment(item.id)}
                          title="Accept appointment"
                        >
                          <CheckCircle2 size={13} />
                          Accept
                        </button>

                        <button
                          type="button"
                          className="mc-btn-reject"
                          onClick={() =>
                            rejectAppointment(
                              item.id,
                              "Showroom consultation unavailable at requested time.",
                            )
                          }
                          title="Reject appointment"
                        >
                          <X size={13} />
                          Reject
                        </button>

                        <Link
                          to="/admin/appointments"
                          className="mc-btn-modify"
                          title="Ask customer to modify date or time"
                        >
                          <CalendarDays size={13} />
                          Ask to Modify
                        </Link>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="mc-btn-view-details"
                        onClick={() => setDetails(item)}
                        title="View appointment details"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {displayed.length === 0 && (
              <tr>
                <td colSpan={6} className="mc-empty-table">
                  No appointments match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* APPOINTMENT DETAILS MODAL */}
      {selectedDetails && (
        <div
          className="mc-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDetails(null);
            }
          }}
        >
          <div
            className="mc-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mc-details-title"
          >
            <button
              className="mc-dialog-close"
              type="button"
              aria-label="Close appointment details"
              onClick={() => setDetails(null)}
            >
              <X size={20} />
            </button>

            <span className="mc-small-eyebrow">APPOINTMENT DETAILS</span>
            <h2 id="mc-details-title">{selectedDetails.customer}</h2>

            <p>
              <strong>Contact:</strong> {selectedDetails.email} · {selectedDetails.phone}
            </p>
            <p>
              <strong>Request:</strong> {selectedDetails.service}
            </p>
            <p>
              <strong>Reference:</strong> {selectedDetails.id}
            </p>
            <p>
              <strong>Date:</strong> {readableDate(selectedDetails.date)}
            </p>
            <p>
              <strong>Time:</strong> {selectedDetails.time}
            </p>
            <p>
              <strong>Status:</strong> {selectedDetails.status}
            </p>
            {selectedDetails.notes && (
              <p>
                <strong>Customer Notes:</strong> {selectedDetails.notes}
              </p>
            )}
            {selectedDetails.rejectionReason && (
              <p>
                <strong>Rejection Reason:</strong> {selectedDetails.rejectionReason}
              </p>
            )}
            {selectedDetails.modificationProposal?.reason && (
              <p>
                <strong>Modification Notes:</strong> {selectedDetails.modificationProposal.reason}
                {selectedDetails.modificationProposal.proposedDate && (
                  <> (Proposed: {readableDate(selectedDetails.modificationProposal.proposedDate)} at {selectedDetails.modificationProposal.proposedTime || selectedDetails.time})</>
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================
   DASHBOARD OVERVIEW
========================================= */

function Dashboard({
  appointments,
  search,
}: AppointmentTableProps) {
  const productStats = useProductStats();
  const offerStats = useOfferStats();
  const appointmentStats = useAppointmentStats();

  /* =====================================
     DASHBOARD STATISTICS
  ===================================== */

  const cards = [
    {
      title: "Total products",
      value: productStats.total,
      detail: `${productStats.available} available`,
      icon: Package,
      to: "/admin/products",
    },
    {
      title: "Pending appointments",
      value: appointmentStats.pending,
      detail: "Awaiting your decision",
      icon: CalendarDays,
      to: "/admin/appointments",
    },
    {
      title: "Confirmed today",
      value: appointmentStats.acceptedToday,
      detail: "Accepted appointments",
      icon: CheckCircle2,
      to: "/admin/appointments",
    },
    {
      title: "Active offers",
      value: offerStats.live,
      detail: "Currently running campaigns",
      icon: Tag,
      to: "/admin/offers",
    },
  ];

  return (
    <>
      {/* =====================================
          LUXURY HERO BANNER
      ===================================== */}

      <section
        className="mc-hero"
        aria-label="Welcome to Muhurtham Collection"
      >
        <Botanical className="mc-hero-botanical" />

        <div className="mc-hero-copy">
          <p>WELCOME BACK,</p>

          <h1>Demo admin</h1>

          <div className="mc-hero-divider">
            <span />
            <Ornament />
            <span />
          </div>

          <div className="mc-hero-description">
            Manage your collections and plan upcoming appointments at Muhurtham Collection.
          </div>
        </div>

        <div
          className="mc-hero-picture"
          role="img"
          aria-label="Bridal lehenga in the Muhurtham showroom"
        />
      </section>

      {/* =====================================
          DASHBOARD HEADING
      ===================================== */}

      <section className="mc-overview-heading">
        <div>
          <div className="mc-small-eyebrow">
            YOUR SHOWROOM AT A GLANCE
            <span className="mc-label-line">
              <Ornament />
            </span>
          </div>

          <h2>Dashboard overview</h2>

          <p>Manage your collections and plan upcoming appointments.</p>
        </div>

        <Link
          to="/admin/appointments"
          className="mc-primary-button"
        >
          <CalendarDays size={22} />
          View appointments
          <ArrowUpRight size={17} />
        </Link>
      </section>

      {/* =====================================
          STATISTIC CARDS
      ===================================== */}

      <section
        className="mc-stat-grid"
        aria-label="Showroom statistics"
      >
        {cards.map(
          ({
            title,
            value,
            detail,
            icon: Icon,
            to,
          }) => (
            <Link
              to={to}
              className="mc-stat-card"
              key={title}
            >
              <Botanical className="mc-stat-botanical" />

              <div className="mc-stat-icon">
                <Icon
                  size={27}
                  strokeWidth={1.8}
                />
              </div>

              <div className="mc-stat-copy">
                <span>{title}</span>
                <strong>{value}</strong>
                <small>{detail}</small>
              </div>

              <span className="mc-stat-arrow">
                <ChevronRight size={18} />
              </span>
            </Link>
          ),
        )}
      </section>

      {/* =====================================
          APPOINTMENT REQUESTS
      ===================================== */}

      <AppointmentTable
        appointments={appointments}
        search={search}
      />
    </>
  );
}

/* =========================================
   UNIMPLEMENTED ADMIN SECTIONS
========================================= */

function Placeholder({
  title,
  description,
  features,
}: PlaceholderProps) {
  return (
    <div className="mc-placeholder-wrap">
      <div className="mc-small-eyebrow">
        MUHURTHAM COLLECTION · ADMIN
      </div>

      <h1>{title}</h1>

      <p>{description}</p>

      <section className="mc-placeholder-panel">
        <span className="mc-panel-icon">
          <Flower2 size={25} />
        </span>

        <h2>Management workspace</h2>

        <p>
          These features will be available
          when the backend is connected:
        </p>

        <ul>
          {features.map((feature) => (
            <li key={feature}>
              {feature}
            </li>
          ))}
        </ul>

        <Link
          to="/admin"
          className="mc-primary-button"
        >
          Return to overview

          <ChevronRight size={17} />
        </Link>
      </section>
    </div>
  );
}

/* =========================================
   MAIN ADMIN APPLICATION
========================================= */

export default function AdminApp({
  onLogout,
}: AdminAppProps) {
  /* =====================================
     APPOINTMENT STATE (SHARED SERVICE)
  ===================================== */

  const appointments = useAppointments();

  /* =====================================
     SIDEBAR STATE
  ===================================== */

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    mainMenuOpen,
    setMainMenuOpen,
  ] = useState(true);

  /* =====================================
     HEADER SEARCH
  ===================================== */

  const [query, setQuery] = useState("");

  /* =====================================
     HEADER DROPDOWNS
  ===================================== */

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  /* =====================================
     PENDING APPOINTMENTS
  ===================================== */

  const pending = useMemo(
    () =>
      appointments.filter(
        (item) =>
          item.status === "Pending",
      ),
    [appointments],
  );

  /* =====================================
     CLOSE MOBILE SIDEBAR
  ===================================== */

  function closeSidebar() {
    setSidebarOpen(false);
  }

  /* =====================================
     SIDEBAR LOGOUT
  ===================================== */

  function handleLogout() {
    setSidebarOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);

    onLogout();
  }

  /* =====================================
     RENDER ADMIN APPLICATION
  ===================================== */

  return (
    <div className="mc-admin">
      {/* =====================================
          MOBILE SIDEBAR OVERLAY
      ===================================== */}

      {sidebarOpen && (
        <button
          type="button"
          className="mc-mobile-shade"
          aria-label="Close sidebar"
          onClick={closeSidebar}
        />
      )}

      {/* =====================================
          FIXED LEFT SIDEBAR
      ===================================== */}

      <aside
        className={`mc-sidebar ${
          sidebarOpen
            ? "mc-sidebar-open"
            : ""
        }`}
        aria-label="Admin sidebar"
      >
        {/* BOTANICAL DECORATIONS */}

        <Botanical className="mc-sidebar-leaves-top" />

        <Botanical className="mc-sidebar-leaves-bottom" />

        {/* MOBILE CLOSE */}

        <button
          className="mc-mobile-close"
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
        >
          <X size={22} />
        </button>

        {/* =================================
            COMPANY BRAND
        ================================= */}

        <Link
          to="/admin"
          className="mc-sidebar-brand"
          onClick={closeSidebar}
        >
          <span className="mc-sidebar-monogram">
            M
          </span>

          <strong>MUHURTHAM</strong>

          <small>COLLECTION</small>
        </Link>

        {/* ADMIN PANEL LABEL */}

        <div className="mc-sidebar-panel-title">
          <span />

          ADMIN PANEL

          <span />
        </div>

        {/* =================================
            MAIN NAVIGATION
        ================================= */}

        <div className="mc-sidebar-nav-group">
          <button
            type="button"
            className="mc-sidebar-section-title"
            aria-expanded={mainMenuOpen}
            aria-controls="mc-main-navigation"
            onClick={() =>
              setMainMenuOpen(
                (current) => !current,
              )
            }
          >
            MAIN MENU

            {mainMenuOpen ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {mainMenuOpen && (
            <nav
              id="mc-main-navigation"
              className="mc-sidebar-nav"
              aria-label="Main admin navigation"
            >
              {menu.map(
                ({
                  to,
                  name,
                  icon: Icon,
                  end,
                }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={closeSidebar}
                    className={({
                      isActive,
                    }) =>
                      `mc-nav-link ${
                        isActive
                          ? "mc-nav-active"
                          : ""
                      }`
                    }
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>{name}</span>

                    <ChevronRight
                      className="mc-nav-chevron"
                      size={19}
                      aria-hidden="true"
                    />
                  </NavLink>
                ),
              )}
            </nav>
          )}
        </div>

        {/* =================================
            VIEW WEBSITE
        ================================= */}

        <a
          className="mc-sidebar-website"
          href="/en"
        >
          <ExternalLink
            size={21}
            aria-hidden="true"
          />

          <span>View Website</span>

          <ArrowUpRight
            size={19}
            aria-hidden="true"
          />
        </a>

        {/* =================================
            DECORATIVE QUOTATION
        ================================= */}

        <div className="mc-sidebar-quote">
          <Botanical className="mc-quote-leaves" />

          <p>
            Beautiful
            <br />
            collections.
            <br />
            Thoughtfully
            <br />
            managed.
          </p>

          <span />
        </div>

        {/* =================================
            SIDEBAR LOGOUT BUTTON
        ================================= */}

        <button
          type="button"
          className="mc-sidebar-logout"
          onClick={handleLogout}
          aria-label="Log out of the admin dashboard"
          title="Log out"
        >
          <LogOut
            size={21}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>Log out</span>

          <ArrowUpRight
            size={18}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      </aside>

      {/* =====================================
          MAIN ADMIN WORKSPACE
      ===================================== */}

      <div className="mc-workspace">
        {/* =================================
            LUXURY TOPBAR
        ================================= */}

        <header className="mc-topbar">
          {/* LEFT HEADER */}

          <div className="mc-topbar-intro">
            {/* MOBILE SIDEBAR TRIGGER */}

            <button
              className="mc-mobile-menu"
              aria-label="Open sidebar"
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={23} />
            </button>

            {/* ORNAMENT */}

            <span className="mc-topbar-symbol">
              ✥
            </span>

            <div>
              <div className="mc-topbar-title">
                Showroom management

                <span className="mc-topbar-flourish">
                  ──── ❀ ────
                </span>
              </div>

              <p>
                Manage your collections,
                appointments and showroom
                activities.
              </p>
            </div>
          </div>

          {/* =================================
              RIGHT HEADER CONTROLS
          ================================= */}

          <div className="mc-header-controls">
            {/* SEARCH */}

            <label className="mc-search">
              <Search
                size={21}
                aria-hidden="true"
              />

              <input
                type="search"
                aria-label="Search appointments"
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value,
                  )
                }
                placeholder="Search anything..."
              />
            </label>

            {/* =================================
                NOTIFICATIONS
            ================================= */}

            <div className="mc-popover-anchor">
              <button
                type="button"
                className="mc-notification-button"
                aria-label="Notifications"
                aria-expanded={
                  notificationsOpen
                }
                onClick={() => {
                  setNotificationsOpen(
                    (current) => !current,
                  );

                  setProfileOpen(false);
                }}
              >
                <Bell size={21} />

                {pending.length > 0 && (
                  <i aria-hidden="true" />
                )}
              </button>

              {notificationsOpen && (
                <div className="mc-dropdown mc-notifications">
                  <strong>
                    Notifications
                  </strong>

                  <p>
                    {pending.length} pending
                    appointment request
                    {pending.length === 1
                      ? ""
                      : "s"}
                  </p>

                  {pending.map((item) => (
                    <div
                      className="mc-notification"
                      key={item.id}
                    >
                      <span className="mc-notification-dot" />

                      <span>
                        {item.customer} ·{" "}
                        {item.service}
                      </span>
                    </div>
                  ))}

                  {pending.length === 0 && (
                    <div className="mc-notification">
                      You're all caught up.
                    </div>
                  )}

                  <Link
                    to="/admin/appointments"
                    onClick={() =>
                      setNotificationsOpen(
                        false,
                      )
                    }
                  >
                    View appointments

                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              )}
            </div>

            {/* HEADER DIVIDER */}

            <span
              className="mc-header-divider"
              aria-hidden="true"
            />

            {/* =================================
                ADMIN PROFILE
            ================================= */}

            <div className="mc-popover-anchor">
              <button
                type="button"
                className="mc-user-trigger"
                aria-expanded={profileOpen}
                onClick={() => {
                  setProfileOpen(
                    (current) => !current,
                  );

                  setNotificationsOpen(false);
                }}
              >
                <span className="mc-user-avatar">
                  J
                </span>

                <span className="mc-user-text">
                  <strong>
                    Demo Admin
                  </strong>

                  <small>Admin</small>
                </span>

                <ChevronDown size={18} />
              </button>

              {profileOpen && (
                <div className="mc-dropdown mc-profile-menu">
                  <div>
                    <strong>
                      Demo Admin
                    </strong>

                    <p>
                      Muhurtham Collection
                      administrator
                    </p>
                  </div>

                  <Link
                    to="/admin"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="mc-profile-overview-link"
                  >
                    <House size={17} />

                    Dashboard overview
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =====================================
            ADMIN ROUTES
        ===================================== */}

        <main className="mc-main">
          <Routes>
            {/* =================================
                DASHBOARD OVERVIEW
            ================================= */}

            <Route
              index
              element={
                <Dashboard
                  appointments={appointments}
                  search={query}
                />
              }
            />

            {/* =================================
                PRODUCT MANAGEMENT
            ================================= */}

            <Route
              path="products"
              element={<ProductsPage />}
            />

            {/* =================================
                DISCOUNTS & OFFERS
            ================================= */}

            <Route
              path="offers"
              element={<OfferPage />}
            />

            {/* =================================
                APPOINTMENTS
            ================================= */}

            <Route
              path="appointments"
              element={<AppointmentPage />}
            />

            {/* =================================
                AVAILABILITY
            ================================= */}

            <Route
              path="availability"
              element={<AvailabilityPage />}
            />

            {/* =================================
                UNKNOWN ADMIN ROUTE
            ================================= */}

            <Route
              path="*"
              element={
                <Placeholder
                  title="Page not found"
                  description="This admin section doesn't exist."
                  features={[
                    "Return to the overview to continue",
                  ]}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
