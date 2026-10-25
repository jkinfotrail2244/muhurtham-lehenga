
import { useState } from "react";
import type { FormEvent } from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Package,
  Tag,
} from "lucide-react";

import AdminApp from "./AdminApp";
import "./admin-access.css";

/* =========================================
   ADMIN AUTHENTICATION CONFIGURATION
========================================= */

const SESSION_KEY = "muhurtham.mock-admin-session";

const REMEMBER_KEY = "muhurtham.mock-admin-remember";

const EMAIL = "admin@muhurtham.com";

const PASSWORD = "Muhurtham@123";

/* =========================================
   READ EXISTING SESSION
========================================= */

function readSession(): boolean {
  try {
    return (
      sessionStorage.getItem(SESSION_KEY) === "active" ||
      Number(localStorage.getItem(REMEMBER_KEY)) > Date.now()
    );
  } catch {
    return false;
  }
}

/* =========================================
   SAFE ADMIN REDIRECT
========================================= */

function safePath(value: unknown): string {
  return typeof value === "string" &&
    (value === "/admin" || value.startsWith("/admin/")) &&
    !/^\/admin\/login(?:[/?#]|$)/i.test(value)
    ? value
    : "/admin";
}

/* =========================================
   BOTANICAL DECORATION
========================================= */

function Botanical({
  className,
}: {
  className: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 360"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden="true"
    >
      <path d="M98 355C130 281 65 210 109 133C132 92 109 40 125 8" />

      {[
        { x: 106, y: 65, rotation: -38 },
        { x: 112, y: 112, rotation: 55 },
        { x: 95, y: 155, rotation: -55 },
        { x: 91, y: 198, rotation: 48 },
        { x: 99, y: 240, rotation: -48 },
        { x: 109, y: 283, rotation: 58 },
        { x: 106, y: 325, rotation: -55 },
      ].map(({ x, y, rotation }, index) => (
        <g
          key={index}
          transform={`translate(${x} ${y}) rotate(${rotation})`}
        >
          <path d="M0 0C-30-14-37-42-31-65C-4-47 10-23 0 0Z" />

          <path d="M0 0L-31-65M-8-17L-24-24M-14-29L-30-37M-20-42L-33-48M-8-17L-5-34M-14-29L-13-46" />
        </g>
      ))}

      <path d="M110 135C139 120 157 101 164 77M96 221C64 210 40 185 30 164" />

      <path d="M164 77C144 76 138 60 146 42C166 48 174 62 164 77ZM30 164C12 160 7 142 13 127C32 132 39 149 30 164Z" />
    </svg>
  );
}

/* =========================================
   LEFT BRAND PANEL
========================================= */

function BrandPanel() {
  return (
    <section
      className="ml-brand-panel"
      aria-label="Muhurtham Collection"
    >
      {/* =====================================
          BRIDAL BACKGROUND IMAGE
      ===================================== */}

      <svg
        className="ml-photo"
        viewBox="0 0 950 941"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="ml-photo-clip">
            <path d="M790 0C565 190 490 460 610 941H950V0Z" />
          </clipPath>

          <linearGradient
            id="ml-gold"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop stopColor="#9b773c" />

            <stop offset=".45" stopColor="#f2d49a" />

            <stop offset="1" stopColor="#a67d3f" />
          </linearGradient>
        </defs>

        <image
          href="/admin/login-reference.png"
          width="1672"
          height="941"
          preserveAspectRatio="none"
          clipPath="url(#ml-photo-clip)"
        />

        <path
          d="M790 0C565 190 490 460 610 941"
          fill="none"
          stroke="url(#ml-gold)"
          strokeWidth="7"
        />
      </svg>

      {/* =====================================
          BOTANICAL DECORATIONS
      ===================================== */}

      <Botanical className="ml-botanical ml-botanical-top" />

      <Botanical className="ml-botanical ml-botanical-curve" />

      <Botanical className="ml-botanical ml-botanical-bottom" />

      {/* =====================================
          COMPANY INFORMATION
      ===================================== */}

      <div className="ml-brand-content">
        {/* LOGO */}

        <Link className="ml-logo" to="/en">
          <span className="ml-monogram">
            M
          </span>

          <span>
            MUHURTHAM

            <small>COLLECTION</small>
          </span>
        </Link>

        {/* =====================================
            BRAND STORY
        ===================================== */}

        <div className="ml-story">
          <p className="ml-eyebrow">
            THE ADMIN WORKSPACE
          </p>

          <h1>
            Beautiful
            <br />
            collections.
            <br />
            Thoughtfully
            <br />
            <span>managed.</span>
          </h1>

          <span className="ml-gold-rule" />

          <p className="ml-story-description">
            One place to manage your products,
            <br />
            offers, and showroom appointments.
          </p>

          {/* =================================
              ADMIN FEATURES
          ================================= */}

          <div className="ml-features">
            {/* PRODUCTS */}

            <div>
              <span className="ml-feature-icon">
                <Package />
              </span>

              <p>
                Manage
                <br />
                Products
              </p>
            </div>

            {/* APPOINTMENTS */}

            <div>
              <span className="ml-feature-icon">
                <CalendarDays />
              </span>

              <p>
                Handle
                <br />
                Appointments
              </p>
            </div>

            {/* OFFERS */}

            <div>
              <span className="ml-feature-icon">
                <Tag />
              </span>

              <p>
                Create
                <br />
                Offers
              </p>
            </div>
          </div>
        </div>

        {/* BRAND FOOTER */}

        <p className="ml-brand-footer">
          Muhurtham Collection · Showroom management
        </p>
      </div>
    </section>
  );
}

/* =========================================
   LOGIN PROPS
========================================= */

type LoginProps = {
  onLogin: (
    email: string,
    password: string,
    remember: boolean,
  ) => string | null;
};

/* =========================================
   LOGIN COMPONENT
========================================= */

function Login({
  onLogin,
}: LoginProps) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);

  const [visible, setVisible] = useState(false);

  const [message, setMessage] = useState("");

  /* =====================================
     FORM SUBMISSION
  ===================================== */

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(
      onLogin(email, password, remember) ?? "",
    );
  }

  return (
    <main className="ml-login">
      {/* LEFT BRAND PANEL */}

      <BrandPanel />

      {/* =====================================
          RIGHT LOGIN PANEL
      ===================================== */}

      <section
        className="ml-form-panel"
        aria-labelledby="ml-title"
      >
        <Botanical className="ml-botanical ml-botanical-right" />

        <div className="ml-card">
          {/* =================================
              LOCK ICON
          ================================= */}

          <div className="ml-lock-icon">
            <LockKeyhole aria-hidden="true" />
          </div>

          {/* =================================
              LOGIN HEADING
          ================================= */}

          <p className="ml-eyebrow">
            ADMIN ACCESS
          </p>

          <h2 id="ml-title">
            Welcome back
          </h2>

          <p className="ml-intro">
            Sign in to your Muhurtham Collection dashboard.
          </p>

          {/* =================================
              LOGIN FORM
          ================================= */}

          <form onSubmit={submit}>
            {/* EMAIL */}

            <div className="ml-field">
              <label htmlFor="ml-email">
                Email address
              </label>

              <div className="ml-input">
                <Mail
                  className="ml-input-icon"
                  aria-hidden="true"
                />

                <input
                  id="ml-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  placeholder="Enter your email"
                  value={email}
                  maxLength={254}
                  required
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMessage("");
                  }}
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="ml-field">
              <label htmlFor="ml-password">
                Password
              </label>

              <div className="ml-input">
                <LockKeyhole
                  className="ml-input-icon"
                  aria-hidden="true"
                />

                <input
                  id="ml-password"
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  required
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setMessage("");
                  }}
                />

                {/* PASSWORD VISIBILITY */}

                <button
                  type="button"
                  className="ml-eye"
                  aria-label={
                    visible
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-pressed={visible}
                  onClick={() =>
                    setVisible((value) => !value)
                  }
                >
                  {visible ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* =================================
                LOGIN OPTIONS
            ================================= */}

            <div className="ml-options">
              {/* REMEMBER ME */}

              <label className="ml-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) =>
                    setRemember(event.target.checked)
                  }
                />

                Keep me signed in
              </label>

              {/* FORGOT PASSWORD */}

              <button
                className="ml-forgot"
                type="button"
                onClick={() =>
                  setMessage(
                    "Password reset is not available yet. It will be enabled after backend integration.",
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            {/* =================================
                VALIDATION MESSAGE
            ================================= */}

            {message && (
              <p
                className="ml-message"
                role="alert"
              >
                {message}
              </p>
            )}

            {/* =================================
                SIGN IN BUTTON
            ================================= */}

            <button
              className="ml-submit"
              type="submit"
            >
              Sign in to dashboard

              <ArrowRight
                size={18}
                aria-hidden="true"
              />
            </button>
          </form>

          {/* =================================
              BACK TO WEBSITE
          ================================= */}

          <div className="ml-back">
            <Link to="/en">
              <ArrowLeft
                size={17}
                aria-hidden="true"
              />

              Back to website
            </Link>

            <span />
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================
   ADMIN ACCESS COMPONENT
========================================= */

export default function AdminAccess() {
  /* =====================================
     SESSION STATE
  ===================================== */

  const [
    authenticated,
    setAuthenticated,
  ] = useState(readSession);

  /* =====================================
     ROUTER
  ===================================== */

  const location = useLocation();

  const navigate = useNavigate();

  /* =====================================
     DETECT LOGIN PAGE
  ===================================== */

  const isLogin =
    location.pathname
      .replace(/\/+$/, "")
      .toLowerCase() === "/admin/login";

  /* =====================================
     RESTORE ORIGINAL DESTINATION
  ===================================== */

  const state = location.state as {
    from?: unknown;
  } | null;

  const returnPath = safePath(state?.from);

  /* =====================================
     ADMIN LOGIN
  ===================================== */

  function login(
    email: string,
    password: string,
    remember: boolean,
  ): string | null {
    /* VALIDATE LOGIN */

    if (
      email.trim().toLowerCase() !== EMAIL ||
      password !== PASSWORD
    ) {
      return "Incorrect email or password. Please try again.";
    }

    /* SAVE SESSION */

    try {
      sessionStorage.removeItem(SESSION_KEY);

      localStorage.removeItem(REMEMBER_KEY);

      if (remember) {
        localStorage.setItem(
          REMEMBER_KEY,
          String(
            Date.now() +
              7 * 24 * 60 * 60 * 1000,
          ),
        );
      } else {
        sessionStorage.setItem(
          SESSION_KEY,
          "active",
        );
      }
    } catch {
      return "Browser storage is unavailable. Enable it and try again.";
    }

    /* AUTHENTICATED */

    setAuthenticated(true);

    navigate(returnPath, {
      replace: true,
    });

    return null;
  }

  /* =====================================
     ADMIN LOGOUT
  ===================================== */

  function logout() {
    /* REMOVE SESSION */

    try {
      sessionStorage.removeItem(SESSION_KEY);

      localStorage.removeItem(REMEMBER_KEY);
    } catch {
      // Clear the current in-memory session below.
    }

    /* CLEAR AUTHENTICATION */

    setAuthenticated(false);

    /* REDIRECT TO LOGIN */

    navigate("/admin/login", {
      replace: true,
      state: null,
    });
  }

  /* =====================================
     NOT AUTHENTICATED
  ===================================== */

  if (!authenticated) {
    return isLogin ? (
      <Login onLogin={login} />
    ) : (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from:
            location.pathname +
            location.search +
            location.hash,
        }}
      />
    );
  }

  /* =====================================
     AUTHENTICATED USER ON LOGIN PAGE
  ===================================== */

  if (isLogin) {
    return (
      <Navigate
        to={returnPath}
        replace
      />
    );
  }

  /* =====================================
     AUTHENTICATED ADMIN DASHBOARD

     - NO DEMO SESSION BAR
     - NO DUPLICATE LOGOUT BUTTON
     - SIDEBAR LOGOUT HANDLED BY AdminApp
  ===================================== */

  return (
    <div className="mc-admin-access">
      <AdminApp onLogout={logout} />
    </div>
  );
}
