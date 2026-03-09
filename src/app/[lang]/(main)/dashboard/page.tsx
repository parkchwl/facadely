import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLogoutButton from '@/app/components/DashboardLogoutButton';
import { getDictionary } from '@/lib/get-dictionary';
import { i18n, type Locale } from '@/i18n/config';
import { createLocalizedPath, createLoginPathWithNext } from '@/lib/auth-redirect';

const INTERNAL_API_BASE_URL = (
  process.env.INTERNAL_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:8080/api/v1'
).replace(/\/$/, '');

type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  termsAgreed: boolean;
};

type AuditSummary = {
  totalEvents: number;
  signupCount: number;
  passwordLoginCount: number;
  googleLoginCount: number;
  refreshCount: number;
  logoutCount: number;
  lastSignupAt: string | null;
  lastPasswordLoginAt: string | null;
  lastGoogleLoginAt: string | null;
  lastRefreshAt: string | null;
  lastLogoutAt: string | null;
};

function formatRole(role: AuthenticatedUser['role'], locale: ReturnType<typeof getRoleLabels>) {
  return role === 'ADMIN' ? locale.admin : locale.user;
}

function getRoleLabels(dictionary: Awaited<ReturnType<typeof getDictionary>>['dashboardPage']) {
  return {
    user: dictionary.roleUser,
    admin: dictionary.roleAdmin,
  };
}

function formatDateTime(value: string | null, locale: Locale, fallback: string): string {
  if (!value) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

async function fetchDashboardData(cookieHeader: string): Promise<{
  user: AuthenticatedUser;
  audit: AuditSummary | null;
}> {
  const meResponse = await fetch(`${INTERNAL_API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (!meResponse.ok) {
    throw new Error('UNAUTHORIZED');
  }

  const user = await meResponse.json() as AuthenticatedUser;

  const auditResponse = await fetch(`${INTERNAL_API_BASE_URL}/auth/audit-summary`, {
    method: 'GET',
    headers: {
      cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  const audit = auditResponse.ok
    ? await auditResponse.json() as AuditSummary
    : null;

  return { user, audit };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const resolvedLang = i18n.locales.includes(lang) ? lang : i18n.defaultLocale;
  const dictionary = await getDictionary(resolvedLang);
  const dashboard = dictionary.dashboardPage;
  const roleLabels = getRoleLabels(dashboard);
  const requestHeaders = await headers();
  const cookieHeader = requestHeaders.get('cookie') ?? '';
  const dashboardPath = createLocalizedPath(resolvedLang, '/dashboard');
  const loginPathWithNext = createLoginPathWithNext(resolvedLang, dashboardPath);
  const homePath = createLocalizedPath(resolvedLang, '/');
  const templatesPath = createLocalizedPath(resolvedLang, '/templates');
  const pricingPath = createLocalizedPath(resolvedLang, '/pricing');
  const termsPath = createLocalizedPath(resolvedLang, '/terms');

  if (!cookieHeader) {
    redirect(loginPathWithNext);
  }

  let user: AuthenticatedUser;
  let audit: AuditSummary | null;

  try {
    ({ user, audit } = await fetchDashboardData(cookieHeader));
  } catch {
    redirect(loginPathWithNext);
  }

  const title = dashboard.title.replace('{name}', user.name || user.email);
  const statusCopy = user.termsAgreed ? dashboard.statusTermsReady : dashboard.statusTermsPending;
  const activityCards = [
    { label: dashboard.totalEventsLabel, value: audit?.totalEvents ?? 0 },
    { label: dashboard.passwordLoginsLabel, value: audit?.passwordLoginCount ?? 0 },
    { label: dashboard.googleLoginsLabel, value: audit?.googleLoginCount ?? 0 },
    { label: dashboard.refreshesLabel, value: audit?.refreshCount ?? 0 },
    { label: dashboard.logoutsLabel, value: audit?.logoutCount ?? 0 },
  ];

  return (
    <main className="relative min-h-[calc(100vh-8rem)] overflow-hidden bg-[#f4efe6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(17,24,39,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(120,53,15,0.08),transparent_30%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 sm:px-8 lg:py-14">
        <section className="relative overflow-hidden rounded-[32px] bg-zinc-950 px-8 py-10 text-white shadow-[0_35px_120px_rgba(0,0,0,0.28)] sm:px-10 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_20%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                {dashboard.badge}
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                {dashboard.subtitle}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">{dashboard.termsLabel}</p>
                <p className="mt-3 text-lg font-semibold">
                  {user.termsAgreed ? dashboard.termsAccepted : dashboard.termsPending}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">{dashboard.roleLabel}</p>
                <p className="mt-3 text-lg font-semibold">{formatRole(user.role, roleLabels)}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] bg-white p-8 shadow-xl ring-1 ring-black/5">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{dashboard.profileTitle}</h2>
              <p className="text-sm leading-6 text-zinc-600">{dashboard.profileDescription}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-zinc-50 px-5 py-5 ring-1 ring-zinc-200/80">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{dashboard.emailLabel}</p>
                <p className="mt-3 break-all text-base font-semibold text-zinc-950">{user.email}</p>
              </div>
              <div className="rounded-3xl bg-zinc-50 px-5 py-5 ring-1 ring-zinc-200/80">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{dashboard.accountIdLabel}</p>
                <p className="mt-3 break-all text-sm font-medium text-zinc-950">{user.id}</p>
              </div>
              <div className="rounded-3xl bg-zinc-50 px-5 py-5 ring-1 ring-zinc-200/80">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{dashboard.roleLabel}</p>
                <p className="mt-3 text-base font-semibold text-zinc-950">{formatRole(user.role, roleLabels)}</p>
              </div>
              <div className="rounded-3xl bg-zinc-50 px-5 py-5 ring-1 ring-zinc-200/80">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{dashboard.termsLabel}</p>
                <p className="mt-3 text-base font-semibold text-zinc-950">
                  {user.termsAgreed ? dashboard.termsAccepted : dashboard.termsPending}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-8 shadow-xl ring-1 ring-black/5">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{dashboard.activityTitle}</h2>
              <p className="text-sm leading-6 text-zinc-600">{dashboard.activityDescription}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activityCards.map((item) => (
                <div key={item.label} className="rounded-3xl bg-[#f8f4ec] px-5 py-5 ring-1 ring-black/5">
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{item.label}</p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-dashed border-zinc-300 px-5 py-5">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                  {dashboard.lastPasswordLoginLabel}
                </p>
                <p className="mt-3 text-sm font-medium text-zinc-950">
                  {formatDateTime(audit?.lastPasswordLoginAt ?? null, resolvedLang, dashboard.neverLabel)}
                </p>
              </div>
              <div className="rounded-3xl border border-dashed border-zinc-300 px-5 py-5">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                  {dashboard.lastGoogleLoginLabel}
                </p>
                <p className="mt-3 text-sm font-medium text-zinc-950">
                  {formatDateTime(audit?.lastGoogleLoginAt ?? null, resolvedLang, dashboard.neverLabel)}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[28px] bg-[#111111] p-8 text-white shadow-xl">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">{dashboard.quickActionsTitle}</h2>
              <p className="text-sm leading-6 text-white/65">{dashboard.quickActionsSubtitle}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link
                href="/editor"
                className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 transition hover:bg-white hover:text-black"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">{dictionary.navigation.generate}</p>
                <p className="mt-3 text-lg font-semibold">{dictionary.navigation.generate}</p>
              </Link>
              <Link
                href={templatesPath}
                className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 transition hover:bg-white hover:text-black"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">{dictionary.navigation.templates}</p>
                <p className="mt-3 text-lg font-semibold">{dictionary.navigation.templates}</p>
              </Link>
              <Link
                href={pricingPath}
                className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 transition hover:bg-white hover:text-black"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">{dictionary.navigation.pricing}</p>
                <p className="mt-3 text-lg font-semibold">{dictionary.navigation.pricing}</p>
              </Link>
              <Link
                href={termsPath}
                className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 transition hover:bg-white hover:text-black"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">{dashboard.reviewTerms}</p>
                <p className="mt-3 text-lg font-semibold">{dashboard.reviewTerms}</p>
              </Link>
            </div>

            <div className="mt-8">
              <DashboardLogoutButton
                label={dashboard.logout}
                pendingLabel={dictionary.loginPage.loading}
                redirectPath={homePath}
                errorLabel={dictionary.accountMenu.logoutFailed}
              />
            </div>
          </section>

          <section className="rounded-[28px] bg-white/90 p-8 shadow-xl ring-1 ring-black/5 backdrop-blur">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{dashboard.statusTitle}</h2>
              <p className="text-sm leading-6 text-zinc-600">{dashboard.statusAuthenticated}</p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-5">
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">{dashboard.statusTitle}</p>
                <p className="mt-3 text-base font-semibold text-emerald-950">{dashboard.statusAuthenticated}</p>
              </div>
              <div className={`rounded-3xl px-5 py-5 ${user.termsAgreed ? 'border border-sky-200 bg-sky-50' : 'border border-amber-200 bg-amber-50'}`}>
                <p className={`text-xs uppercase tracking-[0.28em] ${user.termsAgreed ? 'text-sky-700' : 'text-amber-700'}`}>
                  {dashboard.termsLabel}
                </p>
                <p className={`mt-3 text-base font-semibold ${user.termsAgreed ? 'text-sky-950' : 'text-amber-950'}`}>
                  {statusCopy}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
