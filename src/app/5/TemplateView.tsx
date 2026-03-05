"use client";

import styles from "./page.module.css";
import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";

function TickerIcon({ type }: { type: string }) {
  switch (type) {
    case "chart":
      return (
        <svg className={styles.tickerIcon} viewBox="0 0 24 24">
          <polyline points="3 17 9 11 13 15 21 7" />
          <polyline points="14 7 21 7 21 14" />
        </svg>
      );
    case "shield":
      return (
        <svg className={styles.tickerIcon} viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "zap":
      return (
        <svg className={styles.tickerIcon} viewBox="0 0 24 24">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "database":
      return (
        <svg className={styles.tickerIcon} viewBox="0 0 24 24">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case "sliders":
      return (
        <svg className={styles.tickerIcon} viewBox="0 0 24 24">
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      );
    default:
      return null;
  }
}

export default function PageFive() {
  const tickerItems = [
    { label: "PREDICTIVE ANALYTICS", icon: "chart" },
    { label: "ETHICAL COMPLIANCE", icon: "shield" },
    { label: "PROCESS AUTOMATION", icon: "zap" },
    { label: "DATA GOVERNANCE", icon: "database" },
    { label: "LLM FINE-TUNING", icon: "sliders" },
  ];

  return (
    <>
      <SiteCustomizationRuntime />
      <div data-edit-id="t5-main" className={styles.page}>
        <div data-edit-id="t5-background" className={styles.backgroundWrapper}>
          <div className={styles.backgroundGrid} />
          <div className={styles.floorGlow} />
          <div className={styles.particles} />
          <div className={styles.beamOverlay} />
        </div>

        <header data-edit-id="t5-nav" className={styles.nav}>
          <div data-edit-id="t5-brand" className={styles.navLeft}>
            <svg className={styles.logoIcon} viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <rect x="7" y="7" width="10" height="10" />
              <line x1="12" y1="3" x2="12" y2="7" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="3" y1="12" x2="7" y2="12" />
              <line x1="17" y1="12" x2="21" y2="12" />
            </svg>
            <span data-edit-id="t5-brand-text">NEXUS AI</span>
          </div>
          <div data-edit-id="t5-nav-menu" className={styles.navCenter}>
            <a data-edit-id="t5-nav-link-services" href="#">Services</a>
            <a data-edit-id="t5-nav-link-cases" href="#">Case Studies</a>
            <a data-edit-id="t5-nav-link-careers" href="#">Careers</a>
          </div>
          <div data-edit-id="t5-nav-actions" className={styles.navRight}>
            <a data-edit-id="t5-nav-login" href="#">Client Login</a>
            <button data-edit-id="t5-nav-audit" className={styles.btnOutline}>AUDIT REQUEST</button>
          </div>
        </header>

        <main data-edit-id="t5-hero" className={styles.main}>
          <div data-edit-id="t5-content-left" className={styles.contentLeft}>
            <div data-edit-id="t5-tag" className={styles.tag}>
              <div className={styles.tagDot} />
              ADVISORY FIRM
            </div>

            <h1 data-edit-id="t5-title" className={styles.title}>
              Deploy Strategic <br />
              <span data-edit-id="t5-title-emphasis" className={styles.titleItalic}>Artificial Intelligence.</span>
            </h1>

            <p data-edit-id="t5-description" className={styles.description}>
              We bridge the gap between emerging models and enterprise value. Architecting custom neural infrastructure for the Fortune 500.
            </p>

            <div data-edit-id="t5-cta-group" className={styles.ctaGroup}>
              <button data-edit-id="t5-cta-primary" className={styles.btnPrimary}>
                Book Consultation
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button data-edit-id="t5-cta-secondary" className={styles.btnSecondary}>
                View Framework
              </button>
            </div>
          </div>

          <div data-edit-id="t5-content-right" className={styles.contentRight}>
            <div data-edit-id="t5-stat-card-1" className={styles.statItem}>
              <div data-edit-id="t5-stat-label-1" className={styles.statLabel}>EFFICIENCY GAIN</div>
              <div>
                <span data-edit-id="t5-stat-value-1" className={styles.statValue}>40</span>
                <span data-edit-id="t5-stat-unit-1" className={styles.statUnit}>%</span>
              </div>
            </div>

            <div data-edit-id="t5-stat-card-2" className={styles.statItem}>
              <div data-edit-id="t5-stat-label-2" className={styles.statLabel}>IMPLEMENTATION</div>
              <div>
                <span data-edit-id="t5-stat-value-2" className={styles.statValue}>6</span>
                <span data-edit-id="t5-stat-unit-2" className={styles.statSub}>WEEKS</span>
              </div>
            </div>
          </div>
        </main>

        <div data-edit-id="t5-ticker" className={styles.tickerContainer}>
          <div data-edit-id="t5-ticker-track" className={styles.tickerTrack}>
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
              <div key={index} className={styles.tickerItem}>
                <TickerIcon type={item.icon} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
