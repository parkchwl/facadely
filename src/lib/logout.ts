import { logout } from '@/lib/api/auth';

const LOGOUT_RETRY_DELAY_MS = 350;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function logoutWithRetry(maxRetryCount = 1): Promise<void> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= maxRetryCount) {
    try {
      await logout();
      return;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetryCount) {
        break;
      }
      await wait(LOGOUT_RETRY_DELAY_MS * (attempt + 1));
    }
    attempt += 1;
  }

  throw lastError;
}

export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    const message = error.message.trim();
    if (
      message.length === 0 ||
      message === 'Failed to fetch' ||
      message === 'NetworkError when attempting to fetch resource.'
    ) {
      return fallbackMessage;
    }
    return message;
  }
  return fallbackMessage;
}
