import { useMemo, useSyncExternalStore } from "react";

/* ==========================================
   MUHURTHAM COLLECTION
   APPOINTMENT SERVICE
========================================== */

export type AppointmentStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Modification Requested";

export type ModificationProposal = {
  reason: string;
  proposedDate?: string;
  proposedTime?: string;
  proposedAt: string;
};

export type Appointment = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM" or "10:00"
  status: AppointmentStatus;
  notes?: string;
  rejectionReason?: string;
  modificationProposal?: ModificationProposal;
  createdAt: string;
  updatedAt?: string;
};

export type AppointmentStats = {
  total: number;
  pending: number;
  accepted: number;
  acceptedToday: number;
  rejected: number;
  modificationRequested: number;
};

/* ==========================================
   STORAGE CONFIGURATION
========================================== */

const STORAGE_KEY = "muhurtham-appointments-v1";
const UPDATE_EVENT = "muhurtham-appointments-updated";

/* ==========================================
   DATE HELPERS
========================================== */

export function getTodayDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatAppointmentDate(value: string): string {
  if (!value) return "Not set";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ==========================================
   INITIAL SEED DATA
========================================== */

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "APT001",
    customer: "Ananya",
    email: "ananya@example.com",
    phone: "+41 79 123 45 67",
    service: "Bridal consultation",
    date: getTodayDateString(0),
    time: "10:00 AM",
    status: "Accepted",
    notes: "Interested in royal maroon bridal lehengas.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "APT002",
    customer: "Kavitha",
    email: "kavitha@example.com",
    phone: "+41 78 234 56 78",
    service: "Bridal collection viewing",
    date: getTodayDateString(2),
    time: "11:30 AM",
    status: "Pending",
    notes: "Exploring wedding saree & lehenga options.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "APT003",
    customer: "Meera",
    email: "meera@example.com",
    phone: "+41 76 345 67 89",
    service: "Saree consultation",
    date: getTodayDateString(3),
    time: "1:00 PM",
    status: "Pending",
    notes: "Looking for traditional Kanjeevaram and Banarasi silks.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "APT004",
    customer: "Arjun",
    email: "arjun@example.com",
    phone: "+41 79 456 78 90",
    service: "Sherwani fitting",
    date: getTodayDateString(1),
    time: "2:30 PM",
    status: "Accepted",
    notes: "Ivory heritage groom sherwani sizing.",
    createdAt: new Date().toISOString(),
  },
];

/* ==========================================
   VALIDATION
========================================== */

function isAppointment(value: unknown): value is Appointment {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Appointment>;
  return (
    typeof item.id === "string" &&
    typeof item.customer === "string" &&
    typeof item.service === "string" &&
    typeof item.date === "string" &&
    typeof item.time === "string" &&
    (item.status === "Pending" ||
      item.status === "Accepted" ||
      item.status === "Rejected" ||
      item.status === "Modification Requested")
  );
}

/* ==========================================
   STORAGE SNAPSHOTS
========================================== */

function getSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

function parseAppointments(raw: string | null): Appointment[] {
  if (raw === null) {
    return INITIAL_APPOINTMENTS;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_APPOINTMENTS;
    }
    const filtered = parsed.filter(isAppointment);
    return filtered.length > 0 ? filtered : INITIAL_APPOINTMENTS;
  } catch {
    return INITIAL_APPOINTMENTS;
  }
}

/* ==========================================
   READ & SAVE
========================================== */

export function readAppointments(): Appointment[] {
  return parseAppointments(getSnapshot());
}

export function saveAppointments(appointments: Appointment[]): string | null {
  if (typeof window === "undefined") {
    return "Browser storage is unavailable.";
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    window.dispatchEvent(new Event(UPDATE_EVENT));
    return null;
  } catch {
    return "Unable to save appointments to browser storage.";
  }
}

/* ==========================================
   REACTIVE SUBSCRIPTION
========================================== */

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) {
      callback();
    }
  }

  window.addEventListener(UPDATE_EVENT, callback);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(UPDATE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAppointments(): Appointment[] {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return useMemo(() => parseAppointments(snapshot), [snapshot]);
}

/* ==========================================
   STATISTICS
========================================== */

function calculateStats(appointments: Appointment[]): AppointmentStats {
  const today = getTodayDateString(0);
  return {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "Pending").length,
    accepted: appointments.filter((a) => a.status === "Accepted").length,
    acceptedToday: appointments.filter(
      (a) => a.status === "Accepted" && a.date === today,
    ).length,
    rejected: appointments.filter((a) => a.status === "Rejected").length,
    modificationRequested: appointments.filter(
      (a) => a.status === "Modification Requested",
    ).length,
  };
}

export function getAppointmentStats(): AppointmentStats {
  return calculateStats(readAppointments());
}

export function useAppointmentStats(): AppointmentStats {
  const appointments = useAppointments();
  return useMemo(() => calculateStats(appointments), [appointments]);
}

/* ==========================================
   APPOINTMENT ACTIONS
========================================== */

function createAppointmentId(): string {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timePart = Date.now().toString(36).substring(4).toUpperCase();
  return `MC-APT-${timePart}${randomPart}`;
}

export function createAppointment(draft: {
  customer: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
}): { success: boolean; appointment?: Appointment; error?: string } {
  const customer = draft.customer.trim();
  const email = draft.email.trim();
  const phone = draft.phone.trim();
  const service = draft.service.trim();
  const date = draft.date.trim();
  const time = draft.time.trim();

  if (!customer || !email || !phone || !service || !date || !time) {
    return { success: false, error: "All required fields must be completed." };
  }

  const current = readAppointments();

  const newAppointment: Appointment = {
    id: createAppointmentId(),
    customer,
    email,
    phone,
    service,
    date,
    time,
    status: "Pending",
    notes: draft.notes?.trim() || "",
    createdAt: new Date().toISOString(),
  };

  const next = [newAppointment, ...current];
  const error = saveAppointments(next);
  if (error) {
    return { success: false, error };
  }

  return { success: true, appointment: newAppointment };
}

export function acceptAppointment(id: string): {
  success: boolean;
  error?: string;
} {
  const current = readAppointments();
  const target = current.find((a) => a.id === id);
  if (!target) {
    return { success: false, error: "Appointment not found." };
  }

  const next = current.map((item) =>
    item.id === id
      ? {
          ...item,
          status: "Accepted" as const,
          updatedAt: new Date().toISOString(),
        }
      : item,
  );

  const error = saveAppointments(next);
  if (error) return { success: false, error };
  return { success: true };
}

export function rejectAppointment(
  id: string,
  reason: string,
): { success: boolean; error?: string } {
  const trimmed = reason.trim();
  if (!trimmed) {
    return { success: false, error: "A rejection reason is required." };
  }

  const current = readAppointments();
  const target = current.find((a) => a.id === id);
  if (!target) {
    return { success: false, error: "Appointment not found." };
  }

  const next = current.map((item) =>
    item.id === id
      ? {
          ...item,
          status: "Rejected" as const,
          rejectionReason: trimmed,
          updatedAt: new Date().toISOString(),
        }
      : item,
  );

  const error = saveAppointments(next);
  if (error) return { success: false, error };
  return { success: true };
}

export function modifyAppointment(
  id: string,
  proposal: {
    reason: string;
    proposedDate?: string;
    proposedTime?: string;
  },
): { success: boolean; error?: string } {
  const reason = proposal.reason.trim();
  if (!reason) {
    return { success: false, error: "An explanation is required." };
  }

  const current = readAppointments();
  const target = current.find((a) => a.id === id);
  if (!target) {
    return { success: false, error: "Appointment not found." };
  }

  const next = current.map((item) =>
    item.id === id
      ? {
          ...item,
          status: "Modification Requested" as const,
          modificationProposal: {
            reason,
            proposedDate: proposal.proposedDate || undefined,
            proposedTime: proposal.proposedTime || undefined,
            proposedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        }
      : item,
  );

  const error = saveAppointments(next);
  if (error) return { success: false, error };
  return { success: true };
}
