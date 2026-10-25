import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flower2,
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
  Users,
  X,
} from "lucide-react";

import {
  useAvailability,
  blockDate,
  unblockDate,
  toggleBlockSlot,
  updateMaxCapacity,
  getSlotsForDate,
  isDateBlocked,
  getBlockedDateReason,
  isDayOfWeekOpen,
} from "../service/availabilityService";

import {
  useAppointments,
  formatAppointmentDate,
} from "../service/appointmentService";

import "./availability.css";

/* ============================================================
   CALENDAR HELPERS
============================================================ */

function getDaysInMonth(year: number, monthIndex: number) {
  const days: { date: Date; isCurrentMonth: boolean; dateStr: string }[] = [];
  const firstDay = new Date(year, monthIndex, 1);
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const prevMonthTotal = new Date(year, monthIndex, 0).getDate();

  // Monday-based index (0 = Monday, 6 = Sunday)
  const mondayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  for (let i = mondayIndex - 1; i >= 0; i--) {
    const d = new Date(year, monthIndex - 1, prevMonthTotal - i);
    days.push({
      date: d,
      isCurrentMonth: false,
      dateStr: formatDateStr(d),
    });
  }

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, monthIndex, day);
    days.push({
      date: d,
      isCurrentMonth: true,
      dateStr: formatDateStr(d),
    });
  }

  let nextDay = 1;
  while (days.length % 7 !== 0 || days.length < 35) {
    const d = new Date(year, monthIndex + 1, nextDay);
    days.push({
      date: d,
      isCurrentMonth: false,
      dateStr: formatDateStr(d),
    });
    nextDay++;
  }

  return days;
}

function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ============================================================
   AVAILABILITY MANAGEMENT COMPONENT
============================================================ */

export default function AvailabilityPage() {
  const availability = useAvailability();
  const appointments = useAppointments();

  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDateStr, setSelectedDateStr] = useState(formatDateStr(today));

  // Dialog state for blocking a date
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("Showroom closed for private event");
  const [customReason, setCustomReason] = useState("");

  const calendarDays = useMemo(
    () => getDaysInMonth(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  // Selected date info
  const selectedDateBlocked = isDateBlocked(selectedDateStr, availability);
  const selectedDateReason = getBlockedDateReason(selectedDateStr, availability);
  const selectedDateSlots = useMemo(
    () => getSlotsForDate(selectedDateStr, appointments, availability),
    [selectedDateStr, appointments, availability],
  );

  const selectedDateBookings = useMemo(
    () =>
      appointments.filter(
        (a) =>
          a.date === selectedDateStr &&
          (a.status === "Accepted" || a.status === "Pending"),
      ),
    [appointments, selectedDateStr],
  );

  const selectedDateObj = useMemo(
    () => new Date(`${selectedDateStr}T12:00:00`),
    [selectedDateStr],
  );
  const isSelectedDayOpen = isDayOfWeekOpen(
    selectedDateObj.getDay(),
    availability,
  );

  function handleToggleDateBlock() {
    if (selectedDateBlocked) {
      unblockDate(selectedDateStr);
    } else {
      setBlockModalOpen(true);
    }
  }

  function confirmBlockDate() {
    const finalReason =
      blockReason === "Other"
        ? customReason.trim() || "Showroom unavailable"
        : blockReason;
    blockDate(selectedDateStr, finalReason);
    setBlockModalOpen(false);
    setCustomReason("");
  }

  // Stats calculation
  const blockedDatesCount = Object.keys(availability.blockedDates).length;
  const activeBookingsCount = appointments.filter(
    (a) => a.status === "Accepted" || a.status === "Pending",
  ).length;

  return (
    <div className="mc-availability-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="mc-avail-header">
        <div>
          <div className="mc-avail-eyebrow">
            <Flower2 size={15} />
            MUHURTHAM COLLECTION · SHOWROOM SCHEDULE
          </div>
          <h1>Availability & Calendar</h1>
          <p>
            Control showroom booking availability, block dates or slots, and
            manage capacity.
          </p>
        </div>
      </section>

      {/* =====================================================
          KPI STATS
      ===================================================== */}

      <section className="mc-avail-stats" aria-label="Availability overview">
        <div className="mc-avail-stat-card">
          <div className="mc-avail-stat-icon">
            <ShieldCheck size={20} />
          </div>
          <span>Showroom Schedule</span>
          <strong>Mon — Sat</strong>
          <small>Sunday closed by default</small>
        </div>

        <div className="mc-avail-stat-card">
          <div className="mc-avail-stat-icon">
            <Lock size={20} />
          </div>
          <span>Blocked Dates</span>
          <strong>{blockedDatesCount}</strong>
          <small>Holidays & private events</small>
        </div>

        <div className="mc-avail-stat-card">
          <div className="mc-avail-stat-icon">
            <Users size={20} />
          </div>
          <span>Slot Capacity</span>
          <strong>{availability.maxAppointmentsPerSlot} / slot</strong>
          <small>Concurrent consultation limit</small>
        </div>

        <div className="mc-avail-stat-card">
          <div className="mc-avail-stat-icon">
            <Clock3 size={20} />
          </div>
          <span>Active Bookings</span>
          <strong>{activeBookingsCount}</strong>
          <small>Accepted & pending visits</small>
        </div>
      </section>

      {/* =====================================================
          WORKSPACE (CALENDAR + DAY INSPECTOR)
      ===================================================== */}

      <div className="mc-avail-workspace">
        {/* CALENDAR PANEL */}
        <section className="mc-avail-calendar-panel">
          <div className="mc-avail-cal-nav">
            <div className="mc-avail-cal-title">
              <h2>
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
            </div>
            <div className="mc-avail-cal-buttons">
              <button
                type="button"
                className="mc-avail-cal-btn"
                onClick={prevMonth}
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="mc-avail-cal-btn"
                onClick={nextMonth}
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="mc-avail-weekdays">
            {WEEKDAY_NAMES.map((name) => (
              <span key={name} className="mc-avail-weekday">
                {name}
              </span>
            ))}
          </div>

          <div className="mc-avail-days-grid">
            {calendarDays.map((cell) => {
              const isSelected = cell.dateStr === selectedDateStr;
              const isBlocked = isDateBlocked(cell.dateStr, availability);
              const isDayOpen = isDayOfWeekOpen(
                cell.date.getDay(),
                availability,
              );
              const slots = getSlotsForDate(
                cell.dateStr,
                appointments,
                availability,
              );
              const availableSlots = slots.filter((s) => s.isAvailable).length;
              const isFullyBooked = isDayOpen && !isBlocked && availableSlots === 0;

              return (
                <div
                  key={cell.dateStr}
                  className={`mc-avail-day-cell ${
                    !cell.isCurrentMonth ? "other-month" : ""
                  } ${isSelected ? "selected" : ""} ${
                    isBlocked ? "blocked" : ""
                  } ${isFullyBooked ? "fully-booked" : ""}`}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedDateStr(cell.dateStr);
                    }
                  }}
                  aria-label={`Select ${cell.dateStr}`}
                >
                  <span className="mc-avail-day-num">{cell.date.getDate()}</span>

                  {isBlocked ? (
                    <span className="mc-avail-day-tag mc-tag-blocked">
                      Blocked
                    </span>
                  ) : !isDayOpen ? (
                    <span className="mc-avail-day-tag mc-tag-closed">
                      Closed
                    </span>
                  ) : isFullyBooked ? (
                    <span className="mc-avail-day-tag mc-tag-full">
                      Full
                    </span>
                  ) : (
                    <span className="mc-avail-day-tag mc-tag-available">
                      {availableSlots} open
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* DAY INSPECTOR SIDEBAR */}
        <section className="mc-avail-inspector">
          <div className="mc-avail-inspector-header">
            <span className="mc-avail-eyebrow">SELECTED DATE</span>
            <h3>{formatAppointmentDate(selectedDateStr)}</h3>
            <p style={{ color: "#797e77", fontSize: 13, margin: 0 }}>
              {selectedDateObj.toLocaleDateString("en-GB", { weekday: "long" })}
            </p>
          </div>

          {/* STATUS BANNER */}
          <div
            className={`mc-avail-inspector-status ${
              selectedDateBlocked
                ? "mc-avail-status-blocked"
                : "mc-avail-status-open"
            }`}
          >
            <div>
              <strong style={{ display: "block", fontSize: 13 }}>
                {selectedDateBlocked
                  ? "Date Blocked"
                  : !isSelectedDayOpen
                    ? "Showroom Closed (Sunday)"
                    : "Showroom Open"}
              </strong>
              {selectedDateReason && (
                <small style={{ display: "block", marginTop: 2 }}>
                  {selectedDateReason}
                </small>
              )}
            </div>

            <button
              type="button"
              className={`mc-avail-btn-toggle-block ${
                selectedDateBlocked ? "mc-btn-unblock" : "mc-btn-block"
              }`}
              onClick={handleToggleDateBlock}
            >
              {selectedDateBlocked ? (
                <>
                  <Unlock size={12} style={{ display: "inline", marginRight: 4 }} />
                  Unblock Date
                </>
              ) : (
                <>
                  <Lock size={12} style={{ display: "inline", marginRight: 4 }} />
                  Block Date
                </>
              )}
            </button>
          </div>

          {/* WARNING IF BLOCKING DATE HAS BOOKINGS */}
          {selectedDateBlocked && selectedDateBookings.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: "#fff6eb",
                border: "1px solid #f2d1aa",
                borderRadius: 8,
                color: "#97582b",
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              <AlertTriangle size={15} className="shrink-0" />
              <span>
                Note: {selectedDateBookings.length} booking(s) exist on this date.
              </span>
            </div>
          )}

          {/* TIME SLOTS LIST */}
          <div className="mc-avail-slots-title">
            Consultation slots ({selectedDateSlots.length})
          </div>

          <div className="mc-avail-slots-list">
            {selectedDateSlots.map((slot) => {
              const blockedForThisDay =
                (availability.blockedTimeSlots[selectedDateStr] || []).includes(
                  slot.time,
                );

              return (
                <div
                  key={slot.time}
                  className={`mc-avail-slot-row ${
                    blockedForThisDay ? "blocked" : ""
                  } ${slot.isCapacityReached ? "full" : ""}`}
                >
                  <div className="mc-avail-slot-time">
                    <Clock3 size={14} color="#8c734b" />
                    <span>{slot.time}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="mc-avail-slot-capacity">
                      {slot.bookedCount} / {slot.maxCapacity} booked
                    </span>

                    <button
                      type="button"
                      className="mc-avail-slot-toggle"
                      onClick={() =>
                        toggleBlockSlot(selectedDateStr, slot.time)
                      }
                      title={
                        blockedForThisDay
                          ? "Unlock this time slot"
                          : "Lock this time slot"
                      }
                    >
                      {blockedForThisDay ? "Blocked" : "Active"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CAPACITY SETTINGS CARD */}
          <div className="mc-avail-capacity-card">
            <label htmlFor="slot-capacity-select">
              Default appointments per time slot
            </label>
            <select
              id="slot-capacity-select"
              value={availability.maxAppointmentsPerSlot}
              onChange={(e) => updateMaxCapacity(Number(e.target.value))}
            >
              <option value="1">1 booking per slot (Private VIP consultation)</option>
              <option value="2">2 bookings per slot</option>
              <option value="3">3 bookings per slot</option>
            </select>
            <p style={{ margin: "6px 0 0", color: "#8a8174", fontSize: 11 }}>
              Applies across all showroom hours. Reaches fully booked when
              limit is reached.
            </p>
          </div>
        </section>
      </div>

      {/* =====================================================
          BLOCK DATE MODAL
      ===================================================== */}

      {blockModalOpen && (
        <div className="mc-apt-modal-overlay" role="presentation">
          <div
            className="mc-apt-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mc-block-modal-title"
          >
            <div className="mc-apt-dialog-header">
              <div className="mc-apt-dialog-title">
                <span className="mc-apt-eyebrow">MANAGE CALENDAR</span>
                <h3 id="mc-block-modal-title">Block Showroom Date</h3>
              </div>
              <button
                type="button"
                className="mc-apt-dialog-close"
                onClick={() => setBlockModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ color: "#687069", fontSize: 13, marginBottom: 16 }}>
              Customers will not be able to book appointments on{" "}
              <strong>{formatAppointmentDate(selectedDateStr)}</strong>.
            </p>

            <div className="mc-apt-form-field">
              <label htmlFor="block-reason-select">Reason for closing *</label>
              <select
                id="block-reason-select"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
              >
                <option value="Showroom closed for private event">
                  Showroom closed for private event
                </option>
                <option value="Public holiday">Public holiday</option>
                <option value="Atelier inventory & styling audit">
                  Atelier inventory & styling audit
                </option>
                <option value="Showroom maintenance">Showroom maintenance</option>
                <option value="Other">Other custom reason</option>
              </select>
            </div>

            {blockReason === "Other" && (
              <div className="mc-apt-form-field">
                <label htmlFor="custom-block-reason">Specify reason *</label>
                <input
                  id="custom-block-reason"
                  type="text"
                  placeholder="e.g. Wedding expo in Zurich"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              </div>
            )}

            <div className="mc-apt-dialog-actions">
              <button
                type="button"
                className="mc-apt-dialog-cancel"
                onClick={() => setBlockModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mc-apt-dialog-confirm-reject"
                onClick={confirmBlockDate}
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
