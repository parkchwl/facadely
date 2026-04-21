"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Globe,
  Grid2X2,
  MoonStar,
  PencilLine,
  Plus,
  Sparkles,
  SunMedium,
  Trash2,
} from "lucide-react";
import { markAuthSessionHint, recordAuthSessionProbe } from "@/lib/auth-session-hint";

export type DashboardSiteCard = {
  id: string;
  name: string;
  siteHref: string;
  editorHref: string;
  publicHref: string | null;
  status: "DRAFT" | "PUBLISHED";
  variant: "portfolio" | "velocity" | "dashboard" | "generic";
  metaLabel: string;
};

type DashboardWorkspaceClientProps = {
  accountName: string;
  userInitials: string;
  homeHref: string;
  dashboardHref: string;
  templatesHref: string;
  siteCards: DashboardSiteCard[];
};

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "facadely-dashboard-theme";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  } catch {
    return "dark";
  }
}

function PreviewThumb({
  variant,
  isDark,
}: {
  variant: DashboardSiteCard["variant"];
  isDark: boolean;
}) {
  if (variant === "portfolio") {
    return (
      <div
        className={`flex h-full w-full flex-col overflow-hidden rounded-[3px] border shadow-[0_1px_2px_rgba(0,0,0,0.06)] ${
          isDark ? "border-[#2b2b31] bg-[#f7f7f5]" : "border-[#efefef] bg-white"
        }`}
      >
        <div className={`flex h-4 items-center gap-3 border-b px-2 ${isDark ? "border-[#ebebeb]" : "border-[#f4f4f4]"}`}>
          <div className="h-[2px] w-6 bg-[#2b2b2b]" />
          <div className="ml-auto flex gap-2 text-[3px] font-bold text-[#b6b6b6]">
            <span>HOME</span>
            <span>ABOUT</span>
            <span>STYLE</span>
          </div>
        </div>
        <div className="px-4 pt-5 text-[4px] leading-[1.5] text-[#8f8f8f]">
          Jane Lo
          <br />
          Product Designer
        </div>
        <div className="px-4 pt-3">
          <h3 className="font-serif text-[11px] leading-[1.2] text-[#222]">
            Hey there! I&apos;m a creative
            <br />
            and web designer based in sunny
            <br />
            San Francisco, CA.
          </h3>
        </div>
        <div className="mt-auto flex h-11 items-end gap-1 px-4 pb-0">
          <div className="h-full w-1/2 bg-[#1b1b1b]" />
          <div className="h-full w-1/4 bg-[#3b3b3b]" />
        </div>
      </div>
    );
  }

  if (variant === "velocity") {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[3px] border border-[#232329] bg-[#09090b]">
        <div className="absolute -left-8 top-[-18px] h-20 w-20 rounded-full bg-indigo-500/20 blur-2xl" />
        <div className="absolute -right-10 top-10 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 flex h-5 items-center justify-between border-b border-white/5 bg-black/60 px-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-[4px] bg-gradient-to-br from-indigo-500 to-violet-600" />
            <span className="text-[5px] font-bold tracking-tight text-white">Velocity</span>
          </div>
          <div className="flex gap-2 text-[4px] font-medium text-zinc-500">
            <span>Features</span>
            <span>Pricing</span>
            <span>Company</span>
          </div>
        </div>
        <div className="absolute inset-0 flex justify-between px-3 pb-4 pt-8">
          <div>
            <p className="text-[10px] font-bold leading-[1.05] tracking-tight text-white">
              The velocity of
              <br />
              limitless creation.
            </p>
            <div className="mt-2 h-2 w-14 rounded-full bg-white" />
            <div className="mt-1 h-2 w-11 rounded-full bg-zinc-800" />
          </div>
          <div className="mt-2 h-16 w-[72px] rounded-lg border border-white/10 bg-zinc-950/80 shadow-2xl">
            <div className="flex h-4 items-center gap-1 border-b border-white/5 px-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
              <div className="ml-auto h-1.5 w-8 rounded-full bg-zinc-800" />
            </div>
            <div className="space-y-1.5 px-2 py-2">
              <div className="h-1.5 w-10 rounded-full bg-zinc-800" />
              <div className="h-1.5 w-8 rounded-full bg-zinc-800" />
              <div className="h-1.5 w-12 rounded-full bg-indigo-500/70" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[3px] border border-[#2a2a31] bg-[linear-gradient(180deg,_#eceef2_0%,_#ffffff_48%,_#f2f4f8_100%)]">
        <div className="flex h-5 items-center gap-1 border-b border-[#e4e4e6] bg-white px-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#d8d8d8]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#d8d8d8]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#d8d8d8]" />
        </div>
        <div className="grid h-[calc(100%-20px)] grid-cols-[52px_1fr]">
          <div className="border-r border-[#ececec] bg-white/80" />
          <div className="p-3">
            <div className="h-4 w-16 rounded-full bg-white shadow-sm" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="h-14 rounded-md bg-white shadow-sm" />
              <div className="h-14 rounded-md bg-white shadow-sm" />
              <div className="h-14 rounded-md bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[3px] border ${
        isDark
          ? "border-[#2a2a31] bg-[linear-gradient(135deg,_#0f0f12_0%,_#2f2f36_55%,_#51515b_100%)]"
          : "border-[#e4e4e4] bg-[linear-gradient(135deg,_#111827_0%,_#334155_55%,_#64748b_100%)]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_transparent_34%)]" />
      <div className="absolute bottom-4 left-4 right-4">
        <div className="h-2 w-12 rounded-full bg-white/90" />
        <div className="mt-2 h-2 w-20 rounded-full bg-white/60" />
      </div>
    </div>
  );
}

export default function DashboardWorkspaceClient({
  accountName,
  userInitials,
  homeHref,
  dashboardHref,
  templatesHref,
  siteCards,
}: DashboardWorkspaceClientProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [cards, setCards] = useState<DashboardSiteCard[]>(siteCards);
  const [pendingSiteId, setPendingSiteId] = useState<string | null>(null);

  useEffect(() => {
    setCards(siteCards);
  }, [siteCards]);

  useEffect(() => {
    markAuthSessionHint();
    recordAuthSessionProbe(true);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
    }
  }, [theme]);

  const isDark = theme === "dark";

  const shellClassName = isDark
    ? "min-h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_22%),linear-gradient(180deg,_#050505_0%,_#0b0b0d_100%)] text-[14px] text-[#e5e7eb]"
    : "min-h-[100dvh] overflow-hidden bg-white text-[14px] text-[#2a2a2a]";
  const headerClassName = isDark
    ? "flex h-[58px] items-center justify-between border-b border-[#1f1f22] bg-[#09090b]/95 px-5 backdrop-blur-xl"
    : "flex h-[58px] items-center justify-between border-b border-[#ececec] bg-white px-5";
  const brandClassName = isDark
    ? "flex items-center gap-2 text-[15px] font-semibold tracking-tight text-white"
    : "flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[#111]";
  const navClassName = isDark
    ? "hidden items-center gap-6 text-[13px] text-[#8b8b92] md:flex"
    : "hidden items-center gap-6 text-[13px] text-[#6b6b6b] md:flex";
  const navActiveClassName = isDark ? "font-semibold text-white" : "font-semibold text-[#1d1d1d]";
  const accountSummaryClassName = isDark
    ? "flex items-center gap-3 rounded-full border border-[#24242a] bg-[#111114] px-2 py-1.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
    : "flex items-center gap-3 rounded-full border border-[#e7e7e7] bg-white px-2 py-1.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.05)]";
  const accountInitialsClassName = isDark
    ? "flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-semibold uppercase text-black"
    : "flex h-7 w-7 items-center justify-center rounded-full bg-[#8f79d8] text-[11px] font-semibold uppercase text-white";
  const accountNameClassName = isDark
    ? "text-[12px] font-semibold leading-none text-[#f5f5f5]"
    : "text-[12px] font-semibold leading-none text-[#1f1f1f]";
  const accountMetaClassName = isDark
    ? "mt-1 text-[10px] leading-none text-[#8f8f96]"
    : "mt-1 text-[10px] leading-none text-[#8a8a8a]";
  const asideClassName = isDark
    ? "hidden w-[260px] flex-col border-r border-[#1f1f22] bg-[#09090b]/92 lg:flex"
    : "hidden w-[260px] flex-col border-r border-[#ececec] bg-white lg:flex";
  const activeSidebarItemClassName = isDark
    ? "mx-2 flex items-center gap-3 rounded-md border border-[#2d2d34] bg-[#18181b] px-3 py-2 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
    : "mx-2 flex items-center gap-3 rounded-md bg-[#f2f2f2] px-3 py-2 text-[13px] font-medium text-[#222]";
  const mainClassName = isDark ? "flex-1 overflow-y-auto bg-transparent" : "flex-1 overflow-y-auto bg-white";
  const pageTitleClassName = isDark
    ? "text-[30px] font-semibold tracking-tight text-white"
    : "text-[30px] font-semibold tracking-tight text-[#1b1b1b]";
  const workspaceBadgeClassName = isDark
    ? "rounded border border-[#2a2a31] bg-[#18181b] px-2.5 py-1 text-[12px] font-medium text-[#d4d4d8]"
    : "rounded bg-[#ebf2ff] px-2.5 py-1 text-[12px] font-medium text-[#3d6df6]";
  const primaryButtonClassName =
    "flex h-9 items-center gap-1.5 rounded-lg border border-purple-400/40 bg-purple-700/90 px-4 text-[13px] font-bold text-white shadow-[0_8px_24px_rgba(126,34,206,0.45)] transition-all hover:bg-purple-600";
  const cardClassName = isDark
    ? "group flex max-w-[340px] flex-col overflow-hidden rounded-[12px] border border-[#24242a] bg-[#111114] transition hover:border-[#3a3a42] hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
    : "group flex max-w-[340px] flex-col overflow-hidden rounded-[8px] border border-[#e5e5e5] bg-white transition-shadow hover:shadow-[0_3px_12px_rgba(0,0,0,0.08)]";
  const cardPreviewWrapClassName = isDark
    ? "block aspect-[1.32] border-b border-[#232329] bg-[#0c0c0f] p-4"
    : "block aspect-[1.32] border-b border-[#ededed] bg-white p-4";
  const cardTitleClassName = isDark
    ? "block truncate text-[14px] font-medium tracking-tight text-[#f5f5f5] transition-colors group-hover:text-white"
    : "block truncate text-[14px] font-medium tracking-tight text-[#212121] transition-colors group-hover:text-[#3467f3]";
  const cardSubtitleClassName = isDark
    ? "inline-flex items-center gap-1 text-[13px] text-[#8e8e96] transition hover:text-[#f5f5f5]"
    : "inline-flex items-center gap-1 text-[13px] text-[#7d7d7d] transition hover:text-[#2a2a2a]";
  const cardChipClassName = isDark
    ? "inline-flex items-center gap-1.5 rounded border border-[#2b2b31] bg-[#18181b] px-2 py-0.5 text-[11px] font-medium text-[#b4b4bc]"
    : "inline-flex items-center gap-1.5 rounded bg-[#f5f5f5] px-2 py-0.5 text-[11px] font-medium text-[#7a7a7a]";
  const statusChipClassName = (status: DashboardSiteCard["status"]) => {
    if (status === "PUBLISHED") {
      return isDark
        ? "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300"
        : "inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700";
    }

    return isDark
      ? "inline-flex items-center gap-1 rounded-full border border-[#34343d] bg-[#18181b] px-2 py-0.5 text-[11px] font-semibold text-[#b7b7c0]"
      : "inline-flex items-center gap-1 rounded-full border border-[#dfdfe4] bg-[#f5f5f7] px-2 py-0.5 text-[11px] font-semibold text-[#666673]";
  };
  const cardActionClassName = isDark
    ? "inline-flex h-8 items-center gap-1 rounded-md border border-[#2f2f36] bg-[#18181b] px-2.5 text-[12px] font-medium text-[#d4d4da] transition hover:border-[#4a4a56] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    : "inline-flex h-8 items-center gap-1 rounded-md border border-[#e5e5eb] bg-white px-2.5 text-[12px] font-medium text-[#4b4b57] transition hover:border-[#cfcfd6] hover:text-[#111] disabled:cursor-not-allowed disabled:opacity-50";
  const cardDangerActionClassName = isDark
    ? "inline-flex h-8 items-center gap-1 rounded-md border border-rose-500/20 bg-rose-500/10 px-2.5 text-[12px] font-medium text-rose-300 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-50"
    : "inline-flex h-8 items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2.5 text-[12px] font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50";
  const emptyStateClassName = isDark
    ? "col-span-full flex min-h-[360px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[#34343d] bg-[#111114] px-8 py-12 text-center"
    : "col-span-full flex min-h-[360px] flex-col items-center justify-center rounded-[14px] border border-dashed border-[#dcdcdc] bg-[#fafafa] px-8 py-12 text-center";
  const emptyStateTitleClassName = isDark
    ? "mt-5 text-[20px] font-semibold tracking-tight text-white"
    : "mt-5 text-[20px] font-semibold tracking-tight text-[#1f1f1f]";
  const emptyStateBodyClassName = isDark
    ? "mt-3 max-w-[420px] text-[14px] leading-6 text-[#9797a1]"
    : "mt-3 max-w-[420px] text-[14px] leading-6 text-[#6f6f75]";
  const emptyStateIconWrapClassName = isDark
    ? "flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2b2b31] bg-[#18181b] text-[#d8d8de]"
    : "flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e8e8eb] bg-white text-[#4a4a52]";
  const secondaryLinkClassName = isDark
    ? "mt-3 text-[13px] font-medium text-[#9898a1] transition hover:text-white"
    : "mt-3 text-[13px] font-medium text-[#70707a] transition hover:text-[#1f1f1f]";
  const toggleWrapClassName = isDark
    ? "flex items-center rounded-full border border-[#2a2a31] bg-[#111114] p-1"
    : "flex items-center rounded-full border border-[#dddddf] bg-white p-1 shadow-sm";
  const toggleButtonBaseClassName = "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition";
  const toggleActiveClassName = isDark
    ? "bg-white text-black"
    : "bg-[#111114] text-white";
  const toggleInactiveClassName = isDark
    ? "text-[#8f8f96] hover:text-white"
    : "text-[#7a7a7a] hover:text-[#111114]";

  const handleRename = async (site: DashboardSiteCard) => {
    const nextName = window.prompt("Rename site", site.name)?.trim();
    if (!nextName || nextName === site.name) {
      return;
    }

    setPendingSiteId(site.id);
    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nextName }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.site) {
        throw new Error(payload?.error ?? "Failed to rename site");
      }

      setCards((prev) => prev.map((card) => (card.id === site.id ? { ...card, name: payload.site.name } : card)));
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to rename site");
    } finally {
      setPendingSiteId(null);
    }
  };

  const handleDelete = async (site: DashboardSiteCard) => {
    const confirmed = window.confirm(`Delete \"${site.name}\"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setPendingSiteId(site.id);
    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to delete site");
      }

      setCards((prev) => prev.filter((card) => card.id !== site.id));
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete site");
    } finally {
      setPendingSiteId(null);
    }
  };

  return (
    <div className={shellClassName}>
      <header className={headerClassName}>
        <div className="flex items-center gap-7">
          <Link href={homeHref} className={brandClassName}>
            <span className="text-[17px]">✦</span>
            <span>facadely</span>
          </Link>

          <nav className={navClassName}>
            <Link href={dashboardHref} className={navActiveClassName}>
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className={toggleWrapClassName}>
            <button
              type="button"
              aria-pressed={theme === "light"}
              onClick={() => setTheme("light")}
              className={`${toggleButtonBaseClassName} ${
                theme === "light" ? toggleActiveClassName : toggleInactiveClassName
              }`}
            >
              <SunMedium className="h-3.5 w-3.5" />
              Light
            </button>
            <button
              type="button"
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
              className={`${toggleButtonBaseClassName} ${
                theme === "dark" ? toggleActiveClassName : toggleInactiveClassName
              }`}
            >
              <MoonStar className="h-3.5 w-3.5" />
              Dark
            </button>
          </div>

          <div className={accountSummaryClassName}>
            <span className={accountInitialsClassName}>{userInitials}</span>
            <div className="min-w-0 pr-2">
              <p className={accountNameClassName}>{accountName}</p>
              <p className={accountMetaClassName}>Workspace owner</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100dvh-58px)] overflow-hidden">
        <aside className={asideClassName}>
          <div className="overflow-y-auto py-3">
            <Link href={dashboardHref} className={activeSidebarItemClassName}>
              <Grid2X2 className="h-4 w-4" />
              All sites
            </Link>
          </div>
        </aside>

        <main className={mainClassName}>
          <div className="min-w-[920px] px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className={pageTitleClassName}>All sites</h1>
              <span className={workspaceBadgeClassName}>Starter Workspace</span>

              <div className="ml-auto flex flex-wrap items-center gap-2">
                <Link href={templatesHref} className={primaryButtonClassName}>
                  <Plus className="h-4 w-4" />
                  Explore templates
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-5 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map((site) => {
                const isPending = pendingSiteId === site.id;

                return (
                  <div key={site.id} className={cardClassName}>
                    <Link href={site.editorHref} className={cardPreviewWrapClassName}>
                      <PreviewThumb variant={site.variant} isDark={isDark} />
                    </Link>

                    <div className="p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={site.editorHref} className={cardTitleClassName}>
                            {site.name}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-3">
                            <Link href={site.siteHref} className={cardSubtitleClassName}>
                              <ExternalLink className="h-3.5 w-3.5" />
                              Preview site
                            </Link>
                            {site.publicHref ? (
                              <Link href={site.publicHref} className={cardSubtitleClassName}>
                                <Globe className="h-3.5 w-3.5" />
                                Live site
                              </Link>
                            ) : null}
                          </div>
                        </div>
                        <span className={statusChipClassName(site.status)}>
                          {site.status === "PUBLISHED" ? "Live" : "Draft"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className={cardChipClassName}>
                          <Sparkles className="h-3 w-3" />
                          {site.metaLabel}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={site.editorHref} className={cardActionClassName}>
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleRename(site)}
                          disabled={isPending}
                          className={cardActionClassName}
                        >
                          <PencilLine className="h-3.5 w-3.5" />
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(site)}
                          disabled={isPending}
                          className={cardDangerActionClassName}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {cards.length === 0 && (
                <div className={emptyStateClassName}>
                  <div className={emptyStateIconWrapClassName}>
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className={emptyStateTitleClassName}>No sites yet</h2>
                  <p className={emptyStateBodyClassName}>
                    Your dashboard should stay empty until you actually start working on a site.
                    Browse the template library to pick a starting point.
                  </p>
                  <Link href={templatesHref} className={`mt-6 ${primaryButtonClassName}`}>
                    <Plus className="h-4 w-4" />
                    Explore templates
                  </Link>
                  <Link href={templatesHref} className={secondaryLinkClassName}>
                    Open template library
                  </Link>
                </div>
              )}
            </div>

            <div className="pb-10" />
          </div>
        </main>
      </div>
    </div>
  );
}
