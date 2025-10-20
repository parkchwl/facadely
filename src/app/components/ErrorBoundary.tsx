'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6">
              ✦
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-8">
              We&apos;re sorry for the inconvenience. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-black transition-colors"
              >
                Go to Homepage
              </a>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-4 bg-red-900/20 border border-red-500 rounded-lg text-left">
                <p className="font-mono text-sm text-red-400">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
