import { useMemo, useSyncExternalStore } from "react";
import type { Appointment } from "./appointmentService";

/* ==========================================
   MUHURTHAM COLLECTION
   SHOWROOM AVAILABILITY SERVICE
========================================== */

export type DaySchedule = {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  name: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type AvailabilityConfig = {
  weeklySchedule: DaySchedule[];
  standardTimeSlots: string[];
  maxAppointmentsPerSlot: number;
  blockedDates: Record<string, string>; // YYYY-MM-DD -> Reason
  blockedTimeSlots: Record<string, string[]>; // YYYY-MM-DD -> [timeSlots]
};

export type SlotAvailability = {
  time: string;
  isAvailable: boolean;
  bookedCount: number;
  maxCapacity: number;
  isBlockedByAdmin: boolean;
  isCapacityReached: boolean;
  reason?: string;
};

/* ==========================================
   STORAGE CONFIGURATION
========================================== */

const STORAGE_KEY = "muhurtham-availability-v1";
const UPDATE_EVENT = "muhurtham-availability-updated";

/* ==========================================
   DEFAULT CONFIGURATION
========================================== */

export const DEFAULT_TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "3:30 PM",
  "5:00 PM",
];

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { dayOfWeek: 0, name: "Sunday", isOpen: false, openTime: "Closed", closeTime: "Closed" },
  { dayOfWeek: 1, name: "Monday", isOpen: true, openTime: "10:00 AM", closeTime: "06:00 PM" },
  { dayOfWeek: 2, name: "Tuesday", isOpen: true, openTime: "10:00 AM", closeTime: "06:00 PM" },
  { dayOfWeek: 3, name: "Wednesday", isOpen: true, openTime: "10:00 AM", closeTime: "06:00 PM" },
  { dayOfWeek: 4, name: "Thursday", isOpen: true, openTime: "10:00 AM", closeTime: "06:00 PM" },
  { dayOfWeek: 5, name: "Friday", isOpen: true, openTime: "10:00 AM", closeTime: "06:00 PM" },
  { dayOfWeek: 6, name: "Saturday", isOpen: true, openTime: "10:00 AM", closeTime: "06:00 PM" },
];

export const INITIAL_AVAILABILITY: AvailabilityConfig = {
  weeklySchedule: DEFAULT_SCHEDULE,
  standardTimeSlots: DEFAULT_TIME_SLOTS,
  maxAppointmentsPerSlot: 1,
  blockedDates: {},
  blockedTimeSlots: {},
};

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

function parseAvailability(raw: string | null): AvailabilityConfig {
  if (raw === null) return INITIAL_AVAILABILITY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return INITIAL_AVAILABILITY;
    const config = parsed as Partial<AvailabilityConfig>;

    return {
      weeklySchedule: Array.isArray(config.weeklySchedule)
        ? config.weeklySchedule
        : DEFAULT_SCHEDULE,
      standardTimeSlots: Array.isArray(config.standardTimeSlots)
        ? config.standardTimeSlots
        : DEFAULT_TIME_SLOTS,
      maxAppointmentsPerSlot:
        typeof config.maxAppointmentsPerSlot === "number" &&
        config.maxAppointmentsPerSlot > 0
          ? config.maxAppointmentsPerSlot
          : 1,
      blockedDates:
        config.blockedDates && typeof config.blockedDates === "object"
          ? config.blockedDates
          : {},
      blockedTimeSlots:
        config.blockedTimeSlots && typeof config.blockedTimeSlots === "object"
          ? config.blockedTimeSlots
          : {},
    };
  } catch {
    return INITIAL_AVAILABILITY;
  }
}

/* ==========================================
   READ & SAVE
========================================== */

export function readAvailability(): AvailabilityConfig {
  return parseAvailability(getSnapshot());
}

export function saveAvailability(config: AvailabilityConfig): string | null {
  if (typeof window === "undefined") {
    return "Browser storage is unavailable.";
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event(UPDATE_EVENT));
    return null;
  } catch {
    return "Unable to save availability settings to browser storage.";
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

export function useAvailability(): AvailabilityConfig {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return useMemo(() => parseAvailability(snapshot), [snapshot]);
}

/* ==========================================
   CHECK DATE AVAILABILITY
========================================== */

export function isDateBlocked(
  dateStr: string,
  config = readAvailability(),
): boolean {
  return Boolean(config.blockedDates[dateStr]);
}

export function getBlockedDateReason(
  dateStr: string,
  config = readAvailability(),
): string | null {
  return config.blockedDates[dateStr] || null;
}

export function isDayOfWeekOpen(
  dayOfWeek: number,
  config = readAvailability(),
): boolean {
  const schedule = config.weeklySchedule.find(
    (s) => s.dayOfWeek === dayOfWeek,
  );
  return schedule ? schedule.isOpen : dayOfWeek !== 0; // Default closed on Sunday
}

/* ==========================================
   CALCULATE SLOTS FOR DATE
========================================== */

export function getSlotsForDate(
  dateStr: string,
  appointments: Appointment[],
  config = readAvailability(),
): SlotAvailability[] {
  const isDateFullyBlocked = isDateBlocked(dateStr, config);
  const dateReason = getBlockedDateReason(dateStr, config);
  const blockedSlotsForDate = config.blockedTimeSlots[dateStr] || [];
  const maxCapacity = config.maxAppointmentsPerSlot;

  // Active bookings on this date (Accepted or Pending count against capacity)
  const activeBookings = appointments.filter(
    (a) =>
      a.date === dateStr &&
      (a.status === "Accepted" || a.status === "Pending"),
  );

  return config.standardTimeSlots.map((time) => {
    const isSlotBlocked = blockedSlotsForDate.includes(time);
    const bookedCount = activeBookings.filter(
      (a) => a.time === time || a.time.startsWith(time.split(" ")[0]),
    ).length;
    const isCapacityReached = bookedCount >= maxCapacity;

    const isAvailable =
      !isDateFullyBlocked && !isSlotBlocked && !isCapacityReached;

    let reason: string | undefined;
    if (isDateFullyBlocked) {
      reason = dateReason || "Showroom closed";
    } else if (isSlotBlocked) {
      reason = "Slot blocked by administrator";
    } else if (isCapacityReached) {
      reason = "Fully booked";
    }

    return {
      time,
      isAvailable,
      bookedCount,
      maxCapacity,
      isBlockedByAdmin: isSlotBlocked || isDateFullyBlocked,
      isCapacityReached,
      reason,
    };
  });
}

/* ==========================================
   MUTATION HELPERS
========================================== */

export function blockDate(
  dateStr: string,
  reason = "Showroom unavailable",
): string | null {
  const current = readAvailability();
  const next: AvailabilityConfig = {
    ...current,
    blockedDates: {
      ...current.blockedDates,
      [dateStr]: reason,
    },
  };
  return saveAvailability(next);
}

export function unblockDate(dateStr: string): string | null {
  const current = readAvailability();
  const updated = { ...current.blockedDates };
  delete updated[dateStr];
  const next: AvailabilityConfig = {
    ...current,
    blockedDates: updated,
  };
  return saveAvailability(next);
}

export function toggleBlockSlot(
  dateStr: string,
  timeSlot: string,
): string | null {
  const current = readAvailability();
  const currentSlots = current.blockedTimeSlots[dateStr] || [];
  const exists = currentSlots.includes(timeSlot);

  const nextSlots = exists
    ? currentSlots.filter((t) => t !== timeSlot)
    : [...currentSlots, timeSlot];

  const next: AvailabilityConfig = {
    ...current,
    blockedTimeSlots: {
      ...current.blockedTimeSlots,
      [dateStr]: nextSlots,
    },
  };
  return saveAvailability(next);
}

export function updateMaxCapacity(max: number): string | null {
  if (max < 1) return "Capacity must be at least 1.";
  const current = readAvailability();
  const next: AvailabilityConfig = {
    ...current,
    maxAppointmentsPerSlot: max,
  };
  return saveAvailability(next);
}
