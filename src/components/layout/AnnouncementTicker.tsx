import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

import {
  useLiveOffers,
  formatOfferDiscount,
  type Offer,
} from "../../admin/service/offerService";

import "./AnnouncementTicker.css";

/* ============================================================
   SINGLE ANNOUNCEMENT ITEM
============================================================ */

function TickerItem({
  offer,
  targetPath,
}: {
  offer: Offer;
  targetPath: string;
}) {
  const discountLabel = formatOfferDiscount(offer);

  return (
    <Link
      to={targetPath}
      className="mc-ticker-item"
      aria-label={`Special offer: ${offer.title} - ${discountLabel}`}
    >
      <Sparkles
        size={11}
        className="text-[#A07639] shrink-0"
        aria-hidden="true"
      />

      <span className="mc-ticker-title">
        {offer.title}
      </span>

      <span className="mc-ticker-separator">—</span>

      <span className="mc-ticker-discount">
        {discountLabel}
      </span>

      {offer.code && (
        <span className="mc-ticker-code">
          CODE: {offer.code}
        </span>
      )}

      <span
        className="mc-ticker-separator ml-2"
        aria-hidden="true"
      >
        ✦
      </span>
    </Link>
  );
}

/* ============================================================
   ANNOUNCEMENT TICKER COMPONENT
============================================================ */

export default function AnnouncementTicker() {
  const liveOffers = useLiveOffers();
  const location = useLocation();

  // Extract current language
  const language = location.pathname.split("/")[1] || "en";
  const targetPath = `/${language}/collections`;

  // Repeat offers list if needed to ensure adequate track length for smooth marquee
  const repeatedOffers = useMemo(() => {
    if (liveOffers.length === 0) return [];
    if (liveOffers.length === 1) {
      return [liveOffers[0], liveOffers[0], liveOffers[0]];
    }
    if (liveOffers.length === 2) {
      return [...liveOffers, ...liveOffers];
    }
    return liveOffers;
  }, [liveOffers]);

  if (liveOffers.length === 0) {
    return null;
  }

  return (
    <aside
      className="mc-announcement-bar"
      aria-label="Promotional announcements"
    >
      <div className="mc-ticker-wrapper">
        <div className="mc-ticker-track">
          {/* Primary loop group */}
          <div className="mc-ticker-group">
            {repeatedOffers.map((offer, index) => (
              <TickerItem
                key={`primary-${offer.id}-${index}`}
                offer={offer}
                targetPath={targetPath}
              />
            ))}
          </div>

          {/* Duplicate loop group for seamless continuous marquee */}
          <div className="mc-ticker-group" aria-hidden="true">
            {repeatedOffers.map((offer, index) => (
              <TickerItem
                key={`clone-${offer.id}-${index}`}
                offer={offer}
                targetPath={targetPath}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
