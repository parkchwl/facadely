'use client';

import React from 'react';
import Link from 'next/link';
import PolicyPageHeader from '../components/PolicyPageHeader';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PolicyPageHeader />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-light text-black mb-3 tracking-tight">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-16 font-light">Last Updated: December 2024</p>

        <div className="prose prose-gray max-w-none">
          {/* Introduction */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">1. Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              Welcome to facadely. By accessing or using our website builder platform (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              facadely provides a no-code website building platform that allows users to create, customize, and publish professional websites without technical knowledge. These Terms apply to all users of the Service, including without limitation users who are browsers, builders, and contributors of content.
            </p>
          </section>

          {/* Account Terms */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">2. Account Terms</h2>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200">You must be at least 18 years old to use this Service, or the age of majority in your jurisdiction.</li>
              <li className="pl-6 border-l border-gray-200">You must provide accurate and complete information when creating your account.</li>
              <li className="pl-6 border-l border-gray-200">You are responsible for maintaining the security of your account and password.</li>
              <li className="pl-6 border-l border-gray-200">You are responsible for all activities that occur under your account.</li>
              <li className="pl-6 border-l border-gray-200">You may not use the Service for any illegal or unauthorized purpose.</li>
              <li className="pl-6 border-l border-gray-200">One person or legal entity may not maintain more than one free account.</li>
            </ul>
          </section>

          {/* Service and Usage */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">3. Service Usage and Limitations</h2>
            <h3 className="text-xl font-light text-black mt-8 mb-4">3.1 Acceptable Use</h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              You agree to use facadely only for lawful purposes. You are prohibited from:
            </p>
            <ul className="space-y-2 text-gray-600 font-light mb-6">
              <li className="pl-6 border-l border-gray-200">Publishing content that is illegal, harmful, threatening, abusive, or discriminatory</li>
              <li className="pl-6 border-l border-gray-200">Infringing on intellectual property rights of others</li>
              <li className="pl-6 border-l border-gray-200">Distributing malware, viruses, or harmful code</li>
              <li className="pl-6 border-l border-gray-200">Attempting to gain unauthorized access to the Service</li>
              <li className="pl-6 border-l border-gray-200">Using the Service to send spam or unsolicited communications</li>
              <li className="pl-6 border-l border-gray-200">Creating websites that promote illegal activities</li>
            </ul>

            <h3 className="text-xl font-light text-black mt-8 mb-4">3.2 Service Limits</h3>
            <p className="text-gray-600 leading-relaxed font-light">
              Your use of the Service is subject to the limitations of your chosen plan (Free, Pro, or Business). These limitations include but are not limited to: number of websites, storage capacity, bandwidth, and feature access. Exceeding these limits may result in service interruption or additional charges.
            </p>
          </section>

          {/* Payment Terms */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">4. Payment and Billing</h2>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200"><strong className="font-normal text-black">Subscription Plans:</strong> Paid plans (Pro and Business) are billed on a monthly or annual basis as selected by you.</li>
              <li className="pl-6 border-l border-gray-200"><strong className="font-normal text-black">Auto-Renewal:</strong> Subscriptions automatically renew unless cancelled before the renewal date.</li>
              <li className="pl-6 border-l border-gray-200"><strong className="font-normal text-black">Cancellation:</strong> You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.</li>
              <li className="pl-6 border-l border-gray-200"><strong className="font-normal text-black">Refunds:</strong> We offer a 14-day money-back guarantee for first-time annual subscriptions. Monthly subscriptions are non-refundable.</li>
              <li className="pl-6 border-l border-gray-200"><strong className="font-normal text-black">Price Changes:</strong> We reserve the right to modify pricing with 30 days notice to existing subscribers.</li>
              <li className="pl-6 border-l border-gray-200"><strong className="font-normal text-black">Taxes:</strong> Prices do not include applicable taxes, which will be added as required by local law.</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">5. Intellectual Property Rights</h2>
            <h3 className="text-xl font-light text-black mt-8 mb-4">5.1 Your Content</h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              You retain all rights to the content you create and publish using facadely. By using our Service, you grant us a limited license to host, store, and display your content as necessary to provide the Service.
            </p>

            <h3 className="text-xl font-light text-black mt-8 mb-4">5.2 facadely Content</h3>
            <p className="text-gray-600 leading-relaxed font-light">
              All templates, designs, features, and functionality provided by facadely remain our intellectual property. You receive a license to use these elements only as part of creating websites through our Service.
            </p>
          </section>

          {/* Data and Privacy */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">6. Data and Privacy</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              Your use of the Service is also governed by our Privacy Policy. We collect and use your data as described in our Privacy Policy. By using facadely, you consent to such collection and use.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Service Availability */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">7. Service Availability and Support</h2>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200">We strive for 99.9% uptime but do not guarantee uninterrupted service.</li>
              <li className="pl-6 border-l border-gray-200">We may perform scheduled maintenance with advance notice when possible.</li>
              <li className="pl-6 border-l border-gray-200">Support levels vary by plan: Community (Free), Priority (Pro), and Dedicated (Business).</li>
              <li className="pl-6 border-l border-gray-200">We reserve the right to modify or discontinue features with reasonable notice.</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, FACADELY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              In no event shall our total liability to you for all damages exceed the amount you paid to Facadely in the 12 months prior to the claim, or $100, whichever is greater.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">9. Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination:
            </p>
            <ul className="space-y-2 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200">Your right to use the Service will immediately cease</li>
              <li className="pl-6 border-l border-gray-200">You will have 30 days to export your content</li>
              <li className="pl-6 border-l border-gray-200">Your published websites will be taken offline</li>
              <li className="pl-6 border-l border-gray-200">No refunds will be provided for remaining subscription time (except as required by law)</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">10. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed font-light">
              We reserve the right to modify these Terms at any time. We will provide notice of material changes by email or through the Service at least 30 days before they take effect. Your continued use of the Service after changes constitute acceptance of the modified Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">11. Governing Law and Disputes</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              These Terms shall be governed by and construed in accordance with the laws of the Republic of Korea, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in Seoul, South Korea, except where prohibited by law.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">12. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed font-light mb-6">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="border border-gray-200 rounded-none p-8">
              <p className="text-gray-600 font-light mb-2"><span className="text-black">Email:</span> legal@facadely.com</p>
              <p className="text-gray-600 font-light"><span className="text-black">Address:</span> Facadely Corp., Seoul, South Korea</p>
            </div>
          </section>

          {/* Severability */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">13. Severability and Waiver</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the Terms will otherwise remain in full force and effect.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          {/* Entire Agreement */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">14. Entire Agreement</h2>
            <p className="text-gray-600 leading-relaxed font-light">
              These Terms, together with our Privacy Policy and any other legal notices published by us on the Service, constitute the entire agreement between you and Facadely concerning the Service.
            </p>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 pt-12 border-t border-gray-100">
          <p className="text-center text-gray-400 mb-8 font-light">
            By using Facadely, you acknowledge that you have read and understood these Terms of Service.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 bg-black text-white font-light rounded-none hover:bg-gray-900 transition-colors duration-300"
            >
              Create Account
            </Link>
            <Link
              href="/privacy"
              className="px-8 py-3 border border-black text-black font-light rounded-none hover:bg-gray-50 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
