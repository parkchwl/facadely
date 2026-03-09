'use client';

import { useState } from 'react';
import { getErrorMessage, logoutWithRetry } from '@/lib/logout';

type DashboardLogoutButtonProps = {
  label: string;
  pendingLabel: string;
  redirectPath: string;
  errorLabel: string;
};

export default function DashboardLogoutButton({
  label,
  pendingLabel,
  redirectPath,
  errorLabel,
}: DashboardLogoutButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await logoutWithRetry();
      window.location.assign(redirectPath);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(getErrorMessage(error, errorLabel));
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        data-testid="dashboard-logout-button"
        onClick={handleLogout}
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? pendingLabel : label}
      </button>
      {errorMessage && (
        <p data-testid="dashboard-logout-error" className="text-xs font-medium text-rose-300">{errorMessage}</p>
      )}
    </div>
  );
}
