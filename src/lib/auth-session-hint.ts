const AUTH_HINT_KEY = "facadely_auth_hint";
const AUTH_PROBE_KEY = "facadely_auth_probe";

const DEFAULT_PROBE_COOLDOWN_MS = 10 * 60 * 1000;

type AuthProbeState = {
  checkedAt: number;
  authenticated: boolean;
};

function readProbeState(): AuthProbeState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_PROBE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<AuthProbeState>;
    if (typeof parsed.checkedAt !== "number" || typeof parsed.authenticated !== "boolean") {
      return null;
    }

    return {
      checkedAt: parsed.checkedAt,
      authenticated: parsed.authenticated,
    };
  } catch {
    return null;
  }
}

export function markAuthSessionHint(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(AUTH_HINT_KEY, "1");
  } catch {
    // no-op
  }
}

export function clearAuthSessionHint(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_HINT_KEY);
    window.localStorage.removeItem(AUTH_PROBE_KEY);
  } catch {
    // no-op
  }
}

export function hasAuthSessionHint(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(AUTH_HINT_KEY) === "1";
  } catch {
    return false;
  }
}

export function recordAuthSessionProbe(authenticated: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const payload: AuthProbeState = {
      checkedAt: Date.now(),
      authenticated,
    };
    window.localStorage.setItem(AUTH_PROBE_KEY, JSON.stringify(payload));
  } catch {
    // no-op
  }
}

export function shouldProbeAuthSession(cooldownMs: number = DEFAULT_PROBE_COOLDOWN_MS): boolean {
  if (!hasAuthSessionHint()) {
    return false;
  }

  const state = readProbeState();
  if (!state) {
    return true;
  }

  return Date.now() - state.checkedAt >= cooldownMs;
}
