"use client";

import React from "react";
import styles from "./page.module.css";
import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import {
  ArrowLeft,
  Play,
  Search,
  Target,
  Folder,
  DollarSign,
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  FileCheck,
} from "lucide-react";
import * as motion from "framer-motion/client";

export default function Page() {
  return (
    <>
      <SiteCustomizationRuntime />
      <div data-edit-id="t7-main" className={styles.container}>
        <nav data-edit-id="t7-nav" className={styles.nav}>
        <div data-edit-id="t7-brand" className={styles.navLeft}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
            <span data-edit-id="t7-brand-text">OnePro</span>
          </div>
        </div>
        <div data-edit-id="t7-nav-menu" className={styles.navCenter}>
          <a data-edit-id="t7-nav-link-features" href="#" className={styles.navLink}>Features</a>
          <a data-edit-id="t7-nav-link-pricing" href="#" className={styles.navLink}>Pricing</a>
          <a data-edit-id="t7-nav-link-blog" href="#" className={styles.navLink}>Blog</a>
          <a data-edit-id="t7-nav-link-contact" href="#" className={styles.navLink}>Contact Us</a>
        </div>
        <div data-edit-id="t7-nav-actions" className={styles.navRight}>
          <button data-edit-id="t7-nav-cta" className={styles.ctaButtonDark}>Try OnePro free</button>
        </div>
      </nav>

      <main data-edit-id="t7-hero" className={styles.main}>
        <motion.div
          data-edit-id="t7-hero-copy-group"
          className={styles.hero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 data-edit-id="t7-title" className={styles.title}>
            Grow your business
            <br />
            from 0 to 1
          </h1>
          <p data-edit-id="t7-subtitle" className={styles.subtitle}>
            One tool for managing clients, projects, and payments in one single place.
            <br />
            From first contract to final invoice, grow like a pro.
          </p>
          <div data-edit-id="t7-cta-group" className={styles.buttonGroup}>
            <button data-edit-id="t7-cta-primary" className={styles.primaryButton}>Try OnePro for free</button>
            <button data-edit-id="t7-cta-secondary" className={styles.secondaryButton}>See features</button>
          </div>
        </motion.div>

        <motion.div
          data-edit-id="t7-dashboard-container"
          className={styles.dashboardContainer}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div data-edit-id="t7-dashboard" className={styles.dashboard}>
            <aside data-edit-id="t7-sidebar" className={styles.sidebar}>
              <div data-edit-id="t7-sidebar-header" className={styles.sidebarHeader}>
                <div data-edit-id="t7-sidebar-brand" className={styles.logo}>
                  <div className={styles.logoIcon}></div>
                  <span data-edit-id="t7-sidebar-brand-text">OnePro</span>
                </div>
                <button data-edit-id="t7-sidebar-collapse" className={styles.iconButton}><ArrowLeft size={16} /></button>
              </div>
              <nav data-edit-id="t7-sidebar-nav" className={styles.sidebarNav}>
                <a data-edit-id="t7-sidebar-link-home" href="#" className={`${styles.sidebarLink} ${styles.activeLink}`}>
                  <LayoutDashboard size={18} />
                  Home
                </a>
                <a data-edit-id="t7-sidebar-link-clients" href="#" className={styles.sidebarLink}>
                  <Users size={18} />
                  Clients
                </a>
                <a data-edit-id="t7-sidebar-link-projects" href="#" className={styles.sidebarLink}>
                  <Folder size={18} />
                  Projects
                </a>
                <a data-edit-id="t7-sidebar-link-time" href="#" className={styles.sidebarLink}>
                  <Clock size={18} />
                  Time tracking
                </a>
              </nav>
            </aside>

            <div data-edit-id="t7-dashboard-main" className={styles.dashboardMain}>
              <header data-edit-id="t7-dashboard-header" className={styles.dashboardHeader}>
                <div data-edit-id="t7-greeting" className={styles.greeting}>
                  <h2 data-edit-id="t7-greeting-title">Hello, James</h2>
                  <p data-edit-id="t7-greeting-copy">What are you working on?</p>
                </div>
                <div data-edit-id="t7-header-controls" className={styles.headerControls}>
                  <div data-edit-id="t7-search-bar" className={styles.searchBar}>
                    <Search size={16} />
                    <input type="text" placeholder="Search" />
                  </div>
                  <div data-edit-id="t7-header-icons" className={styles.headerIcons}>
                    <button data-edit-id="t7-control-target" className={styles.iconButton}><Target size={18} /></button>
                    <button data-edit-id="t7-control-folder" className={styles.iconButton}><Folder size={18} /></button>
                    <button data-edit-id="t7-control-billing" className={styles.iconButton}><DollarSign size={18} /></button>
                  </div>
                  <div data-edit-id="t7-timer" className={styles.timerWidget}>
                    <span data-edit-id="t7-time-value" className={styles.time}>0:00:00</span>
                    <button data-edit-id="t7-time-play" className={styles.playButton}><Play size={16} fill="currentColor" /></button>
                  </div>
                </div>
              </header>

              <div data-edit-id="t7-stats-grid" className={styles.statsGrid}>
                <div data-edit-id="t7-stat-card-1" className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <div className={styles.statIconWrapper}><Briefcase size={16} /></div>
                    <span data-edit-id="t7-stat-title-1" className={styles.statTitle}>Total projects</span>
                  </div>
                  <div className={styles.statBody}>
                    <span data-edit-id="t7-stat-value-1" className={styles.statValue}>455</span>
                    <span data-edit-id="t7-stat-badge-1" className={`${styles.statBadge} ${styles.badgePositive}`}>+16.4%</span>
                  </div>
                </div>

                <div data-edit-id="t7-stat-card-2" className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <div className={styles.statIconWrapper}><FileCheck size={16} /></div>
                    <span data-edit-id="t7-stat-title-2" className={styles.statTitle}>Active projects</span>
                  </div>
                  <div className={styles.statBody}>
                    <span data-edit-id="t7-stat-value-2" className={styles.statValue}>55</span>
                    <span data-edit-id="t7-stat-badge-2" className={`${styles.statBadge} ${styles.badgeNegative}`}>-4.8%</span>
                  </div>
                </div>

                <div data-edit-id="t7-stat-card-3" className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <div className={styles.statIconWrapper}><FileCheck size={16} /></div>
                    <span data-edit-id="t7-stat-title-3" className={styles.statTitle}>Completed projects</span>
                  </div>
                  <div className={styles.statBody}>
                    <span data-edit-id="t7-stat-value-3" className={styles.statValue}>400</span>
                    <span data-edit-id="t7-stat-badge-3" className={`${styles.statBadge} ${styles.badgePositive}`}>+12.8%</span>
                  </div>
                </div>

                <div data-edit-id="t7-stat-card-4" className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <div className={styles.statIconWrapper}><Clock size={16} /></div>
                    <span data-edit-id="t7-stat-title-4" className={styles.statTitle}>Total hours worked</span>
                  </div>
                  <div className={styles.statBody}>
                    <span data-edit-id="t7-stat-value-4" className={styles.statValue}>600hrs</span>
                    <span data-edit-id="t7-stat-badge-4" className={`${styles.statBadge} ${styles.badgeNegative}`}>-1.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </main>
      </div>
    </>
  );
}
