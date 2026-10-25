import { useMemo, useState } from "react";
import {
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  Flower2,
  Inbox,
  Search,
  UserX,
  X,
  AlertCircle,
} from "lucide-react";

import {
  useAppointments,
  useAppointmentStats,
  acceptAppointment,
  rejectAppointment,
  modifyAppointment,
  formatAppointmentDate,
  type Appointment,
  type AppointmentStatus,
} from "../service/appointmentService";

import {
  getSlotsForDate,
  useAvailability,
} from "../service/availabilityService";

import "./appointment.css";

/* ============================================================
   STATUS BADGE COMPONENT
============================================================ */

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const statusClass = {
    Pending: "mc-apt-status-pending",
    Accepted: "mc-apt-status-accepted",
    Rejected: "mc-apt-status-rejected",
    "Modification Requested": "mc-apt-status-modification",
  }[status];

  return (
    <span className={`mc-apt-status ${statusClass}`}>
      <span className="mc-apt-status-dot" />
      {status}
    </span>
  );
}

/* ============================================================
   APPOINTMENT MANAGEMENT PAGE
============================================================ */

export default function AppointmentPage() {
  const appointments = useAppointments();
  const stats = useAppointmentStats();
  const availability = useAvailability();

  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | AppointmentStatus>("ALL");

  // Dialog states
  const [acceptItem, setAcceptItem] = useState<Appointment | null>(null);
  const [rejectItem, setRejectItem] = useState<Appointment | null>(null);
  const [modifyItem, setModifyItem] = useState<Appointment | null>(null);
  const [detailsItem, setDetailsItem] = useState<Appointment | null>(null);

  // Form states for dialogs
  const [rejectionReason, setRejectionReason] = useState("Requested time unavailable");
  const [customRejectReason, setCustomRejectReason] = useState("");
  const [modifyReason, setModifyReason] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [actionError, setActionError] = useState("");

  /* ==========================================================
     FILTERED APPOINTMENTS
  ========================================================== */

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((item) => {
      const matchesSearch = [
        item.id,
        item.customer,
        item.service,
        item.date,
        item.time,
        item.status,
      ].some((val) => val.toLowerCase().includes(query));

      const matchesTab = filterTab === "ALL" || item.status === filterTab;

      return matchesSearch && matchesTab;
    });
  }, [appointments, search, filterTab]);

  /* ==========================================================
     ACCEPT HANDLER
  ========================================================== */

  function handleConfirmAccept() {
    if (!acceptItem) return;
    const res = acceptAppointment(acceptItem.id);
    if (!res.success) {
      setActionError(res.error || "Failed to accept appointment.");
      return;
    }
    setAcceptItem(null);
    setActionError("");
  }

  /* ==========================================================
     REJECT HANDLER
  ========================================================== */

  function handleConfirmReject() {
    if (!rejectItem) return;
    const finalReason =
      rejectionReason === "Other"
        ? customRejectReason.trim()
        : rejectionReason;

    if (!finalReason) {
      setActionError("Please provide a reason for rejection.");
      return;
    }

    const res = rejectAppointment(rejectItem.id, finalReason);
    if (!res.success) {
      setActionError(res.error || "Failed to reject appointment.");
      return;
    }
    setRejectItem(null);
    setCustomRejectReason("");
    setActionError("");
  }

  /* ==========================================================
     MODIFY HANDLER
  ========================================================== */

  function handleConfirmModify() {
    if (!modifyItem) return;
    const trimmedReason = modifyReason.trim();
    if (!trimmedReason) {
      setActionError("Please provide an explanation for the customer.");
      return;
    }

    const res = modifyAppointment(modifyItem.id, {
      reason: trimmedReason,
      proposedDate: proposedDate || undefined,
      proposedTime: proposedTime || undefined,
    });

    if (!res.success) {
      setActionError(res.error || "Failed to submit modification request.");
      return;
    }
    setModifyItem(null);
    setModifyReason("");
    setProposedDate("");
    setProposedTime("");
    setActionError("");
  }

  return (
    <div className="mc-appointments-view">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="mc-apt-header">
        <div>
          <div className="mc-apt-eyebrow">
            <Flower2 size={15} />
            MUHURTHAM COLLECTION · SHOWROOM
          </div>
          <h1>Appointment requests</h1>
          <p>
            Manage private consultations, view customer requests, and plan your
            showroom calendar.
          </p>
        </div>
      </section>

      {/* =====================================================
          KPI STAT CARDS
      ===================================================== */}

      <section className="mc-apt-stats" aria-label="Appointment overview">
        <div className="mc-apt-stat-card">
          <div className="mc-apt-stat-icon">
            <Inbox size={20} />
          </div>
          <span className="mc-apt-stat-title">Pending requests</span>
          <strong>{stats.pending}</strong>
          <small>Awaiting your decision</small>
        </div>

        <div className="mc-apt-stat-card">
          <div className="mc-apt-stat-icon">
            <CheckCircle2 size={20} />
          </div>
          <span className="mc-apt-stat-title">Accepted total</span>
          <strong>{stats.accepted}</strong>
          <small>{stats.acceptedToday} confirmed for today</small>
        </div>

        <div className="mc-apt-stat-card">
          <div className="mc-apt-stat-icon">
            <CalendarClock size={20} />
          </div>
          <span className="mc-apt-stat-title">Modifications</span>
          <strong>{stats.modificationRequested}</strong>
          <small>Awaiting customer agreement</small>
        </div>

        <div className="mc-apt-stat-card">
          <div className="mc-apt-stat-icon">
            <UserX size={20} />
          </div>
          <span className="mc-apt-stat-title">Rejected</span>
          <strong>{stats.rejected}</strong>
          <small>Released showroom slots</small>
        </div>
      </section>

      {/* =====================================================
          MAIN APPOINTMENTS PANEL
      ===================================================== */}

      <section className="mc-apt-panel">
        {/* TOOLBAR */}
        <div className="mc-apt-toolbar">
          <label className="mc-apt-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search by customer, service or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search appointments"
            />
          </label>

          <div className="mc-apt-filter-group">
            <div className="mc-apt-tabs" role="tablist">
              {(
                [
                  "ALL",
                  "Pending",
                  "Accepted",
                  "Modification Requested",
                  "Rejected",
                ] as const
              ).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`mc-apt-tab ${filterTab === tab ? "active" : ""}`}
                  onClick={() => setFilterTab(tab)}
                  role="tab"
                  aria-selected={filterTab === tab}
                >
                  {tab === "Modification Requested" ? "Modifications" : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* APPOINTMENTS TABLE */}
        <div className="mc-apt-table-wrap">
          <table className="mc-apt-table">
            <thead>
              <tr>
                <th scope="col">Customer</th>
                <th scope="col">Service</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((item) => (
                <tr key={item.id}>
                  {/* CUSTOMER */}
                  <td>
                    <div className="mc-apt-customer-cell">
                      <span className="mc-apt-avatar">
                        {item.customer.charAt(0)}
                      </span>
                      <div className="mc-apt-customer-info">
                        <strong>{item.customer}</strong>
                        <small>{item.id}</small>
                      </div>
                    </div>
                  </td>

                  {/* SERVICE */}
                  <td className="mc-apt-service-cell">{item.service}</td>

                  {/* DATE */}
                  <td className="mc-apt-date-cell">
                    {formatAppointmentDate(item.date)}
                  </td>

                  {/* TIME */}
                  <td>
                    <span className="mc-apt-time-badge">
                      <Clock3 size={12} />
                      {item.time}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <StatusBadge status={item.status} />
                  </td>

                  {/* DIRECT ACTION BUTTONS (NO DROPDOWN) */}
                  <td>
                    <div className="mc-apt-actions">
                      {item.status === "Pending" ? (
                        <>
                          {/* ACCEPT */}
                          <button
                            type="button"
                            className="mc-btn-accept"
                            title="Accept appointment"
                            onClick={() => {
                              setActionError("");
                              setAcceptItem(item);
                            }}
                          >
                            <Check size={14} />
                            Accept
                          </button>

                          {/* REJECT */}
                          <button
                            type="button"
                            className="mc-btn-reject"
                            title="Reject appointment"
                            onClick={() => {
                              setActionError("");
                              setRejectItem(item);
                            }}
                          >
                            <X size={14} />
                            Reject
                          </button>

                          {/* ASK TO MODIFY */}
                          <button
                            type="button"
                            className="mc-btn-modify"
                            title="Ask to modify date or time"
                            onClick={() => {
                              setActionError("");
                              setModifyItem(item);
                            }}
                          >
                            <CalendarClock size={14} />
                            Ask to Modify
                          </button>

                          {/* VIEW DETAILS */}
                          <button
                            type="button"
                            className="mc-btn-view-details"
                            title="View full details"
                            onClick={() => setDetailsItem(item)}
                          >
                            <Eye size={14} />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="mc-btn-view-details"
                          onClick={() => setDetailsItem(item)}
                        >
                          <Eye size={14} />
                          View details
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="mc-apt-empty">
                    No appointments match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================
          ACCEPT CONFIRMATION MODAL
      ===================================================== */}

      {acceptItem && (
        <div className="mc-apt-modal-overlay" role="presentation">
          <div
            className="mc-apt-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mc-accept-title"
          >
            <div className="mc-apt-dialog-header">
              <div className="mc-apt-dialog-title">
                <span className="mc-apt-eyebrow">CONFIRM APPOINTMENT</span>
                <h3 id="mc-accept-title">Accept Consultation</h3>
              </div>
              <button
                type="button"
                className="mc-apt-dialog-close"
                onClick={() => setAcceptItem(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ color: "#687069", fontSize: 13, marginBottom: 16 }}>
              You are confirming the following private appointment:
            </p>

            <div className="mc-apt-summary-box">
              <div className="mc-apt-summary-item">
                <span>Customer</span>
                <strong>{acceptItem.customer}</strong>
              </div>
              <div className="mc-apt-summary-item">
                <span>Service</span>
                <strong>{acceptItem.service}</strong>
              </div>
              <div className="mc-apt-summary-item">
                <span>Requested Date</span>
                <strong>{formatAppointmentDate(acceptItem.date)}</strong>
              </div>
              <div className="mc-apt-summary-item">
                <span>Time Slot</span>
                <strong>{acceptItem.time}</strong>
              </div>
            </div>

            {/* CAPACITY WARNING IF ALREADY FULL */}
            {(() => {
              const slots = getSlotsForDate(
                acceptItem.date,
                appointments.filter((a) => a.id !== acceptItem.id),
                availability,
              );
              const targetSlot = slots.find((s) => s.time === acceptItem.time);
              if (targetSlot && targetSlot.bookedCount >= targetSlot.maxCapacity) {
                return (
                  <div
                    style={{
                      background: "#fff2e8",
                      border: "1px solid #f0be9d",
                      borderRadius: 8,
                      padding: "10px 14px",
                      color: "#974b2c",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <AlertCircle size={16} />
                    Note: This slot already has {targetSlot.bookedCount} booked
                    appointment. Accepting will exceed standard capacity.
                  </div>
                );
              }
              return null;
            })()}

            {actionError && (
              <p style={{ color: "#9c412f", fontSize: 12, marginBottom: 12 }}>
                {actionError}
              </p>
            )}

            <div className="mc-apt-dialog-actions">
              <button
                type="button"
                className="mc-apt-dialog-cancel"
                onClick={() => setAcceptItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mc-apt-dialog-confirm-accept"
                onClick={handleConfirmAccept}
              >
                Confirm Acceptance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          REJECT REASON MODAL
      ===================================================== */}

      {rejectItem && (
        <div className="mc-apt-modal-overlay" role="presentation">
          <div
            className="mc-apt-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mc-reject-title"
          >
            <div className="mc-apt-dialog-header">
              <div className="mc-apt-dialog-title">
                <span className="mc-apt-eyebrow">DECLINE REQUEST</span>
                <h3 id="mc-reject-title">Reject Appointment</h3>
              </div>
              <button
                type="button"
                className="mc-apt-dialog-close"
                onClick={() => setRejectItem(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mc-apt-summary-box">
              <div className="mc-apt-summary-item">
                <span>Customer</span>
                <strong>{rejectItem.customer}</strong>
              </div>
              <div className="mc-apt-summary-item">
                <span>Date & Time</span>
                <strong>
                  {formatAppointmentDate(rejectItem.date)} at {rejectItem.time}
                </strong>
              </div>
            </div>

            <div className="mc-apt-form-field">
              <label htmlFor="reject-reason-select">Reason for rejection *</label>
              <select
                id="reject-reason-select"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              >
                <option value="Requested time unavailable">
                  Requested time unavailable
                </option>
                <option value="Showroom closed for private event">
                  Showroom closed for private event
                </option>
                <option value="Appointment slot fully booked">
                  Appointment slot fully booked
                </option>
                <option value="Stylist unavailable on this date">
                  Stylist unavailable on this date
                </option>
                <option value="Other">Other custom reason</option>
              </select>
            </div>

            {rejectionReason === "Other" && (
              <div className="mc-apt-form-field">
                <label htmlFor="custom-reject-reason">
                  Specify reason *
                </label>
                <textarea
                  id="custom-reject-reason"
                  rows={3}
                  value={customRejectReason}
                  placeholder="Explain why this request is being declined..."
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                />
              </div>
            )}

            {actionError && (
              <p style={{ color: "#9c412f", fontSize: 12, marginBottom: 12 }}>
                {actionError}
              </p>
            )}

            <div className="mc-apt-dialog-actions">
              <button
                type="button"
                className="mc-apt-dialog-cancel"
                onClick={() => setRejectItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mc-apt-dialog-confirm-reject"
                onClick={handleConfirmReject}
              >
                Reject Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ASK TO MODIFY MODAL
      ===================================================== */}

      {modifyItem && (
        <div className="mc-apt-modal-overlay" role="presentation">
          <div
            className="mc-apt-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mc-modify-title"
          >
            <div className="mc-apt-dialog-header">
              <div className="mc-apt-dialog-title">
                <span className="mc-apt-eyebrow">SCHEDULE MODIFICATION</span>
                <h3 id="mc-modify-title">Ask to Modify</h3>
              </div>
              <button
                type="button"
                className="mc-apt-dialog-close"
                onClick={() => setModifyItem(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mc-apt-summary-box">
              <div className="mc-apt-summary-item">
                <span>Customer</span>
                <strong>{modifyItem.customer}</strong>
              </div>
              <div className="mc-apt-summary-item">
                <span>Original Request</span>
                <strong>
                  {formatAppointmentDate(modifyItem.date)} at {modifyItem.time}
                </strong>
              </div>
            </div>

            <div className="mc-apt-form-field">
              <label htmlFor="modify-explanation">
                Explanation for customer *
              </label>
              <textarea
                id="modify-explanation"
                rows={3}
                placeholder="e.g. We have a bridal party at 10:00 AM. Would 2:30 PM on the same date or the following Saturday work for you?"
                value={modifyReason}
                onChange={(e) => setModifyReason(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="mc-apt-form-field">
                <label htmlFor="proposed-date">Proposed date (optional)</label>
                <input
                  id="proposed-date"
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                />
              </div>

              <div className="mc-apt-form-field">
                <label htmlFor="proposed-time">Proposed time (optional)</label>
                <select
                  id="proposed-time"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                >
                  <option value="">No specific time proposed</option>
                  {availability.standardTimeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {actionError && (
              <p style={{ color: "#9c412f", fontSize: 12, marginBottom: 12 }}>
                {actionError}
              </p>
            )}

            <div className="mc-apt-dialog-actions">
              <button
                type="button"
                className="mc-apt-dialog-cancel"
                onClick={() => setModifyItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mc-apt-dialog-confirm-modify"
                onClick={handleConfirmModify}
              >
                Submit Modification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW DETAILS MODAL
      ===================================================== */}

      {detailsItem && (
        <div className="mc-apt-modal-overlay" role="presentation">
          <div
            className="mc-apt-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mc-details-title"
          >
            <div className="mc-apt-dialog-header">
              <div className="mc-apt-dialog-title">
                <span className="mc-apt-eyebrow">APPOINTMENT DOSSIER</span>
                <h3 id="mc-details-title">{detailsItem.customer}</h3>
              </div>
              <button
                type="button"
                className="mc-apt-dialog-close"
                onClick={() => setDetailsItem(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mc-apt-summary-box">
              <div className="mc-apt-summary-item">
                <span>Reference</span>
                <strong>{detailsItem.id}</strong>
              </div>
              <div className="mc-apt-summary-item">
                <span>Status</span>
                <StatusBadge status={detailsItem.status} />
              </div>
              <div className="mc-apt-summary-item">
                <span>Service</span>
                <strong>{detailsItem.service}</strong>
              </div>
              <div className="mc-apt-summary-item">
                <span>Schedule</span>
                <strong>
                  {formatAppointmentDate(detailsItem.date)} · {detailsItem.time}
                </strong>
              </div>
              <div className="mc-apt-summary-item">
                <span>Email</span>
                <strong>{detailsItem.email || "—"}</strong>
              </div>
              <div className="mc-apt-summary-item">
                <span>Phone</span>
                <strong>{detailsItem.phone || "—"}</strong>
              </div>
            </div>

            {detailsItem.notes && (
              <div className="mc-apt-form-field">
                <label>Customer message & notes</label>
                <div
                  style={{
                    background: "#fbf6ec",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1px solid #ebd9b8",
                    color: "#4f493d",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {detailsItem.notes}
                </div>
              </div>
            )}

            {detailsItem.rejectionReason && (
              <div className="mc-apt-form-field">
                <label style={{ color: "#9c412f" }}>Reason for rejection</label>
                <div
                  style={{
                    background: "#fff2ee",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #eccbc4",
                    color: "#9c412f",
                    fontSize: 13,
                  }}
                >
                  {detailsItem.rejectionReason}
                </div>
              </div>
            )}

            {detailsItem.modificationProposal && (
              <div className="mc-apt-form-field">
                <label style={{ color: "#875f28" }}>Modification proposal</label>
                <div
                  style={{
                    background: "#fbf5e7",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1px solid #e7d4b4",
                    color: "#6b4f24",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  <p>
                    <strong>Explanation:</strong>{" "}
                    {detailsItem.modificationProposal.reason}
                  </p>
                  {detailsItem.modificationProposal.proposedDate && (
                    <p style={{ marginTop: 4 }}>
                      <strong>Proposed Date:</strong>{" "}
                      {formatAppointmentDate(
                        detailsItem.modificationProposal.proposedDate,
                      )}
                    </p>
                  )}
                  {detailsItem.modificationProposal.proposedTime && (
                    <p style={{ marginTop: 4 }}>
                      <strong>Proposed Time:</strong>{" "}
                      {detailsItem.modificationProposal.proposedTime}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mc-apt-dialog-actions">
              <button
                type="button"
                className="mc-apt-dialog-cancel"
                onClick={() => setDetailsItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
