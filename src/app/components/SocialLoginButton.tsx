'use client';

import React from 'react';

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

interface SocialLoginButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function SocialLoginButton({ onClick, label, disabled = false, fullWidth = true }: SocialLoginButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? 'w-full' : 'w-auto'} flex items-center gap-4
        py-4 px-6
        border border-gray-300 hover:border-gray-400
        bg-white hover:bg-gray-50 text-gray-700
        transition-all duration-200 font-medium rounded-lg
        hover:shadow-md active:transform active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none
      `}
    >
      <div className="w-5 h-5 flex-shrink-0">
        <GoogleIcon className="w-full h-full" />
      </div>
      <span className="flex-1 text-center">{label ?? 'Continue with Google'}</span>
    </button>
  );
}
