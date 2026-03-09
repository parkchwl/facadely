import http from 'node:http';
import { URL } from 'node:url';

const HOST = '127.0.0.1';
const PORT = 18080;
const FRONTEND_ORIGIN = 'http://127.0.0.1:3000';
const MAX_NEXT_PATH_LENGTH = 1024;

const users = new Map();
const sessions = new Map();
const audit = {
  totalEvents: 0,
  signupCount: 0,
  passwordLoginCount: 0,
  googleLoginCount: 0,
  refreshCount: 0,
  logoutCount: 0,
  lastSignupAt: null,
  lastPasswordLoginAt: null,
  lastGoogleLoginAt: null,
  lastRefreshAt: null,
  lastLogoutAt: null,
};

function nowIso() {
  return new Date().toISOString();
}

function resetState() {
  users.clear();
  sessions.clear();
  Object.assign(audit, {
    totalEvents: 0,
    signupCount: 0,
    passwordLoginCount: 0,
    googleLoginCount: 0,
    refreshCount: 0,
    logoutCount: 0,
    lastSignupAt: null,
    lastPasswordLoginAt: null,
    lastGoogleLoginAt: null,
    lastRefreshAt: null,
    lastLogoutAt: null,
  });
}

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) {
    return {};
  }

  const parsed = {};
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (!name) {
      continue;
    }
    const value = rest.join('=');
    try {
      parsed[name] = decodeURIComponent(value);
    } catch {
      parsed[name] = value;
    }
  }
  return parsed;
}

function sanitizeNextPath(rawValue) {
  if (!rawValue || typeof rawValue !== 'string') {
    return null;
  }

  const value = rawValue.trim();
  if (
    value.length === 0 ||
    value.length > MAX_NEXT_PATH_LENGTH ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\r') ||
    value.includes('\n') ||
    value.includes('\0')
  ) {
    return null;
  }

  let parsed;
  try {
    parsed = new URL(value, 'http://localhost');
  } catch {
    return null;
  }

  if (parsed.origin !== 'http://localhost') {
    return null;
  }

  const pathname = parsed.pathname;
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    /^\/(?:[a-zA-Z-]{2,10}\/)?login\/?$/.test(pathname)
  ) {
    return null;
  }

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    ...extraHeaders,
  });
  res.end(body);
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function issueSession(email) {
  const stamp = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  const accessToken = `at-${stamp}`;
  const refreshToken = `rt-${stamp}`;
  sessions.set(accessToken, email);
  sessions.set(refreshToken, email);
  return { accessToken, refreshToken };
}

function clearSessionByCookies(cookies) {
  const accessToken = cookies.facadely_at;
  const refreshToken = cookies.facadely_rt;
  if (accessToken) {
    sessions.delete(accessToken);
  }
  if (refreshToken) {
    sessions.delete(refreshToken);
  }
}

function findAuthenticatedEmail(cookies) {
  const accessToken = cookies.facadely_at;
  if (accessToken && sessions.has(accessToken)) {
    return sessions.get(accessToken);
  }

  const refreshToken = cookies.facadely_rt;
  if (refreshToken && sessions.has(refreshToken)) {
    return sessions.get(refreshToken);
  }

  return null;
}

function userPayload(email) {
  const existing = users.get(email) || { name: 'facadely corp', role: 'USER', termsAgreed: true };
  users.set(email, existing);
  return {
    id: `user-${email}`,
    email,
    name: existing.name,
    role: existing.role,
    termsAgreed: existing.termsAgreed,
  };
}

function authSetCookieHeaders(session) {
  return [
    `facadely_at=${encodeURIComponent(session.accessToken)}; Path=/; HttpOnly; SameSite=Lax`,
    `facadely_rt=${encodeURIComponent(session.refreshToken)}; Path=/; HttpOnly; SameSite=Lax`,
  ];
}

function clearAuthCookieHeaders() {
  return [
    'facadely_at=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
    'facadely_rt=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
    'JSESSIONID=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
  ];
}

const server = http.createServer(async (req, res) => {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const requestUrl = new URL(req.url || '/', `http://${HOST}:${PORT}`);
  const { pathname } = requestUrl;
  const cookies = parseCookies(req);

  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('ok');
    return;
  }

  if (pathname === '/api/v1/test/reset' && req.method === 'POST') {
    resetState();
    sendJson(res, 200, { message: 'reset' });
    return;
  }

  if (pathname === '/api/v1/auth/signup' && req.method === 'POST') {
    const body = await readBody(req).catch(() => null);
    if (!body?.email || !body?.password) {
      sendJson(res, 400, { message: 'Invalid request' });
      return;
    }

    users.set(body.email, {
      name: body.name || body.email,
      role: 'USER',
      termsAgreed: true,
    });

    const session = issueSession(body.email);
    const now = nowIso();
    audit.totalEvents += 1;
    audit.signupCount += 1;
    audit.lastSignupAt = now;

    sendJson(res, 200, userPayload(body.email), {
      'Set-Cookie': authSetCookieHeaders(session),
    });
    return;
  }

  if (pathname === '/api/v1/auth/login' && req.method === 'POST') {
    const body = await readBody(req).catch(() => null);
    if (!body?.email || !body?.password) {
      sendJson(res, 400, { message: 'Invalid credentials' });
      return;
    }

    if (!users.has(body.email)) {
      users.set(body.email, {
        name: body.email.split('@')[0],
        role: 'USER',
        termsAgreed: true,
      });
    }

    const session = issueSession(body.email);
    const now = nowIso();
    audit.totalEvents += 1;
    audit.passwordLoginCount += 1;
    audit.lastPasswordLoginAt = now;

    sendJson(res, 200, userPayload(body.email), {
      'Set-Cookie': authSetCookieHeaders(session),
    });
    return;
  }

  if (pathname === '/api/v1/auth/logout' && req.method === 'POST') {
    clearSessionByCookies(cookies);
    audit.totalEvents += 1;
    audit.logoutCount += 1;
    audit.lastLogoutAt = nowIso();

    sendJson(res, 200, { message: 'Signed out' }, {
      'Set-Cookie': clearAuthCookieHeaders(),
    });
    return;
  }

  if (pathname === '/api/v1/auth/me' && req.method === 'GET') {
    const email = findAuthenticatedEmail(cookies);
    if (!email) {
      sendJson(res, 401, { message: 'Unauthorized' });
      return;
    }
    sendJson(res, 200, userPayload(email));
    return;
  }

  if (pathname === '/api/v1/auth/audit-summary' && req.method === 'GET') {
    const email = findAuthenticatedEmail(cookies);
    if (!email) {
      sendJson(res, 401, { message: 'Unauthorized' });
      return;
    }

    sendJson(res, 200, {
      ...audit,
    });
    return;
  }

  if (pathname === '/api/v1/auth/oauth2/authorization/google' && req.method === 'GET') {
    const googleEmail = 'google-user@example.com';
    users.set(googleEmail, {
      name: 'Google User',
      role: 'USER',
      termsAgreed: true,
    });
    const session = issueSession(googleEmail);
    audit.totalEvents += 1;
    audit.googleLoginCount += 1;
    audit.lastGoogleLoginAt = nowIso();

    const safeNext = sanitizeNextPath(cookies.facadely_next || null);
    const redirectUrl = new URL('/en/login?oauth=success', FRONTEND_ORIGIN);
    if (safeNext) {
      redirectUrl.searchParams.set('next', safeNext);
    }

    res.writeHead(302, {
      Location: redirectUrl.toString(),
      'Set-Cookie': [
        ...authSetCookieHeaders(session),
        'facadely_lang=; Path=/; Max-Age=0; SameSite=Lax',
        'facadely_next=; Path=/; Max-Age=0; SameSite=Lax',
      ],
    });
    res.end();
    return;
  }

  sendJson(res, 404, { message: 'Not Found' });
});

server.listen(PORT, HOST, () => {
  console.log(`[mock-auth-server] running at http://${HOST}:${PORT}`);
});
