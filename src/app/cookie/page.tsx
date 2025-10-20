'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PolicyPageHeader from '../components/PolicyPageHeader';

export default function CookiePage() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const handleSavePreferences = () => {
    const preferences = {
      essential: true,
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
    };
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Cookie preferences saved successfully!');
  };

  const handleAcceptAll = () => {
    setAnalyticsEnabled(true);
    setMarketingEnabled(true);
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('All cookies accepted!');
  };

  return (
    <div className="min-h-screen bg-white">
      <PolicyPageHeader />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-light text-black mb-3 tracking-tight">Cookie Policy</h1>
        <p className="text-sm text-gray-400 mb-16 font-light">Last Updated: December 2024</p>

        {/* Cookie Preference Panel */}
        <div className="border border-gray-200 rounded-none p-8 mb-16">
          <h2 className="text-2xl font-light text-black mb-6 tracking-tight">Manage Cookie Preferences</h2>

          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className="flex items-start justify-between pb-6 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="text-xl font-light text-black mb-2">Essential Cookies</h3>
                <p className="text-sm text-gray-600 font-light">
                  Required for the website to function properly. These cannot be disabled.
                </p>
              </div>
              <div className="ml-6">
                <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1 font-light">Always On</p>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between pb-6 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="text-xl font-light text-black mb-2">Analytics Cookies</h3>
                <p className="text-sm text-gray-600 font-light">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <div className="ml-6">
                <button
                  onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${
                    analyticsEnabled ? 'bg-black justify-end' : 'bg-gray-300 justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </button>
                <p className="text-xs text-gray-400 mt-1 font-light">{analyticsEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-light text-black mb-2">Marketing Cookies</h3>
                <p className="text-sm text-gray-600 font-light">
                  Used to track visitors across websites for relevant advertisements.
                </p>
              </div>
              <div className="ml-6">
                <button
                  onClick={() => setMarketingEnabled(!marketingEnabled)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${
                    marketingEnabled ? 'bg-black justify-end' : 'bg-gray-300 justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </button>
                <p className="text-xs text-gray-400 mt-1 font-light">{marketingEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSavePreferences}
              className="flex-1 px-6 py-3 bg-black text-white font-light rounded-none hover:bg-gray-900 transition-colors duration-300"
            >
              Save Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-6 py-3 border border-black text-black font-light rounded-none hover:bg-gray-50 transition-colors duration-300"
            >
              Accept All
            </button>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          {/* What Are Cookies */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">1. What Are Cookies?</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              Cookies are small text files that are placed on your device when you visit a website. They help us recognize your device and store information about your preferences or past actions on our website.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of our website.
            </p>
          </section>

          {/* Types of Cookies */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">2. Types of Cookies We Use</h2>

            <h3 className="text-xl font-light text-black mt-8 mb-4">Essential Cookies</h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              These cookies are necessary for the website to function and cannot be switched off.
            </p>
            <ul className="space-y-2 text-gray-600 font-light mb-8">
              <li className="pl-6 border-l border-gray-200"><span className="text-black">session_id:</span> Maintains your login session</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">csrf_token:</span> Security token to prevent attacks</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">cookie_consent:</span> Stores your cookie preferences</li>
            </ul>

            <h3 className="text-xl font-light text-black mt-8 mb-4">Preference Cookies</h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              These cookies enable the website to remember your preferences.
            </p>
            <ul className="space-y-2 text-gray-600 font-light mb-8">
              <li className="pl-6 border-l border-gray-200"><span className="text-black">language:</span> Remembers your language preference</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">theme:</span> Stores your theme preference</li>
            </ul>

            <h3 className="text-xl font-light text-black mt-8 mb-4">Analytics Cookies</h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              These cookies allow us to count visits and understand which pages are most popular.
            </p>
            <ul className="space-y-2 text-gray-600 font-light mb-8">
              <li className="pl-6 border-l border-gray-200"><span className="text-black">_ga:</span> Google Analytics user identification</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">_gid:</span> Google Analytics session tracking</li>
            </ul>

            <h3 className="text-xl font-light text-black mt-8 mb-4">Marketing Cookies</h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              These cookies are used to track visitors across websites for relevant advertisements.
            </p>
            <ul className="space-y-2 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200"><span className="text-black">_fbp:</span> Facebook Pixel for ad targeting</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">IDE:</span> Google DoubleClick ad serving</li>
            </ul>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">3. Third-Party Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              We may use third-party cookies to report usage statistics and deliver advertisements:
            </p>
            <ul className="space-y-2 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200">Google Analytics: To analyze website traffic</li>
              <li className="pl-6 border-l border-gray-200">Google Ads: To deliver relevant advertisements</li>
              <li className="pl-6 border-l border-gray-200">Facebook Pixel: To measure and optimize ad campaigns</li>
            </ul>
          </section>

          {/* How to Control Cookies */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">4. How to Control Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              You have the right to decide whether to accept or reject cookies:
            </p>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200">Use the cookie preference panel at the top of this page</li>
              <li className="pl-6 border-l border-gray-200">Modify your browser settings to accept or refuse cookies</li>
              <li className="pl-6 border-l border-gray-200">Use industry opt-out tools for advertising cookies</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-6 font-light">
              Note: Disabling certain cookies may limit functionality of our website.
            </p>
          </section>

          {/* Cookie Duration */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">5. Cookie Duration</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              Cookies can be either session or persistent cookies:
            </p>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Session Cookies:</span> Deleted when you close your browser</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Persistent Cookies:</span> Remain on your device for a set period</li>
            </ul>
          </section>

          {/* Updates */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">6. Updates to This Cookie Policy</h2>
            <p className="text-gray-600 leading-relaxed font-light">
              We may update this Cookie Policy from time to time. We will notify you of any material changes by updating the &quot;Last Updated&quot; date and displaying a prominent notice on our website.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">7. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed font-light mb-6">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="border border-gray-200 rounded-none p-8">
              <p className="text-gray-600 font-light mb-2"><span className="text-black">Email:</span> privacy@facadely.com</p>
              <p className="text-gray-600 font-light"><span className="text-black">Address:</span> Facadely Corp., Seoul, South Korea</p>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 pt-12 border-t border-gray-100">
          <p className="text-center text-gray-400 mb-8 font-light">
            We respect your privacy and are committed to being transparent about our cookie usage.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/privacy"
              className="px-8 py-3 bg-black text-white font-light rounded-none hover:bg-gray-900 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="px-8 py-3 border border-black text-black font-light rounded-none hover:bg-gray-50 transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
