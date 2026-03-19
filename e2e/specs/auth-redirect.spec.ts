import { expect, test, type APIResponse, type BrowserContext, type APIRequestContext, type Page } from '@playwright/test';

const MOCK_API_BASE = 'http://127.0.0.1:18080/api/v1';
const APP_URL = 'http://127.0.0.1:3000';

function extractCookieValue(response: APIResponse, cookieName: string): string {
  const setCookieHeaders = response
    .headersArray()
    .filter((header) => header.name.toLowerCase() === 'set-cookie')
    .map((header) => header.value);

  for (const header of setCookieHeaders) {
    const match = header.match(new RegExp(`^${cookieName}=([^;]+)`));
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  throw new Error(`Missing cookie in response: ${cookieName}`);
}

async function seedPasswordSession(request: APIRequestContext, context: BrowserContext): Promise<void> {
  const response = await request.post(`${MOCK_API_BASE}/auth/login`, {
    data: {
      email: 'test-user@facadely.local',
      password: 'test-password-1234',
    },
  });
  expect(response.ok()).toBeTruthy();

  const accessToken = extractCookieValue(response, 'facadely_at');
  const refreshToken = extractCookieValue(response, 'facadely_rt');

  await context.addCookies([
    {
      name: 'facadely_at',
      value: accessToken,
      url: APP_URL,
    },
    {
      name: 'facadely_rt',
      value: refreshToken,
      url: APP_URL,
    },
  ]);
}

async function loginWithGoogle(page: Page): Promise<void> {
  await page.goto('/en/login?next=%2Fen%2Fdashboard');
  await page.getByRole('button', { name: 'Continue with Google' }).click();
  await expect(page).toHaveURL(/\/en\/dashboard$/);
}

test.beforeEach(async ({ request, context }) => {
  await request.post(`${MOCK_API_BASE}/test/reset`);
  await context.clearCookies();
});

test('password login session can access dashboard (direct login path)', async ({ page, request, context }) => {
  await seedPasswordSession(request, context);

  await page.goto('/en/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /Welcome back,/ })).toBeVisible();
});

test('invalid next value does not loop back to login', async ({ page, request, context }) => {
  await seedPasswordSession(request, context);

  await page.goto('/en/login?next=%2Fen%2Flogin');
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('google login honors next redirect', async ({ page }) => {
  await loginWithGoogle(page);
});

test('expired session redirects to login with next', async ({ page, request, context }) => {
  await seedPasswordSession(request, context);
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);

  await request.post(`${MOCK_API_BASE}/test/reset`);

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login\?next=/);
  await expect(page.url()).toContain(encodeURIComponent('/dashboard'));
});

test('logout invalidates session and protected route requires re-login', async ({ page, request, context }) => {
  await seedPasswordSession(request, context);
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);

  const cookies = await context.cookies(APP_URL);
  const cookieHeader = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
  const logoutResponse = await request.post(`${MOCK_API_BASE}/auth/logout`, {
    headers: {
      cookie: cookieHeader,
    },
  });
  expect(logoutResponse.ok()).toBeTruthy();
  await context.clearCookies();

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login\?next=/);
  await expect(page.url()).toContain(encodeURIComponent('/dashboard'));
});

test('logout network failure is shown to user', async ({ page, request, context }) => {
  await seedPasswordSession(request, context);
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.route(`${MOCK_API_BASE}/auth/logout`, (route) => route.abort());
  await page.getByTestId('dashboard-logout-button').click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByTestId('dashboard-logout-error')).toBeVisible();
});
