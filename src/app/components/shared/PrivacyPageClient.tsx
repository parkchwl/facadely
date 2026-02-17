'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PrivacyPageClient() {
  const { lang } = useParams() as { lang: string };
  return (
    <div className="min-h-app-vh bg-white">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-light text-black mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-16 font-light">Last Updated: December 2024</p>

        <div className="prose prose-gray max-w-none">
          {/* Introduction */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">Introduction</h2>
            <p className="text-gray-600 leading-relaxed font-light">
              At facadely, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website building platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">1. Information We Collect</h2>

            <h3 className="text-xl font-light text-black mt-8 mb-4">1.1 Information You Provide</h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              We collect information that you voluntarily provide when using our Service:
            </p>
            <ul className="space-y-3 text-gray-600 font-light mb-6">
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Account Information:</span> Name, email address, and profile information</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Payment Information:</span> Billing details (processed securely through third-party providers)</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Website Content:</span> Text, images, videos, and other content you upload</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Communications:</span> Messages you send us through support channels</li>
            </ul>

            <h3 className="text-xl font-light text-black mt-8 mb-4">1.2 Information Automatically Collected</h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              When you use facadely, we automatically collect certain information:
            </p>
            <ul className="space-y-3 text-gray-600 font-light mb-6">
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Usage Data:</span> Pages visited, features used, time spent on platform</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Device Information:</span> IP address, browser type, operating system</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Cookies:</span> Session cookies, preference cookies, analytics cookies</li>
            </ul>

            <h3 className="text-xl font-light text-black mt-8 mb-4">1.3 Social Login Information</h3>
            <p className="text-gray-600 leading-relaxed font-light">
              If you sign up using social login (Google, Apple, Facebook), we receive basic profile information including your name, email address, and profile picture.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              We use the information we collect for the following purposes:
            </p>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200">Provide, maintain, and improve the website building platform</li>
              <li className="pl-6 border-l border-gray-200">Process your website creations and publish them online</li>
              <li className="pl-6 border-l border-gray-200">Manage your account and subscriptions</li>
              <li className="pl-6 border-l border-gray-200">Process payments and prevent fraud</li>
              <li className="pl-6 border-l border-gray-200">Send service updates, security alerts, and technical notices</li>
              <li className="pl-6 border-l border-gray-200">Respond to your support requests and inquiries</li>
              <li className="pl-6 border-l border-gray-200">Analyze usage patterns to improve features and user experience</li>
              <li className="pl-6 border-l border-gray-200">Comply with legal obligations and regulatory requirements</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">3. How We Share Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Service Providers:</span> Third-party vendors who perform services on our behalf (hosting, payment processing, email delivery, analytics)</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Business Transfers:</span> In connection with a merger, acquisition, or sale of assets</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Legal Requirements:</span> When required by law, subpoena, or government request</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">With Your Consent:</span> When you explicitly authorize us to share your information</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">4. Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              We implement robust security measures to protect your information:
            </p>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200">All data transmitted is encrypted using SSL/TLS protocols</li>
              <li className="pl-6 border-l border-gray-200">Strict access controls ensure only authorized personnel can access sensitive data</li>
              <li className="pl-6 border-l border-gray-200">Regular security assessments and penetration testing</li>
              <li className="pl-6 border-l border-gray-200">Your data is regularly backed up to prevent loss</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-6 font-light">
              While we use industry-standard security measures, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security, but we continuously work to improve our security practices.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              We use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings or our cookie preference tool.
            </p>
            <div className="border border-gray-200 rounded-none p-6">
              <p className="text-gray-600 font-light mb-2">
                For detailed information about our use of cookies, please see our{' '}
                <Link href={`/${lang}/cookie`} className="text-black underline hover:text-gray-600 transition-colors">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">6. Your Privacy Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Access and Portability:</span> Request a copy of your personal data</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Correction:</span> Update or correct inaccurate personal information</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Deletion:</span> Request deletion of your personal data</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Objection:</span> Object to or restrict certain processing activities</li>
              <li className="pl-6 border-l border-gray-200"><span className="text-black">Withdraw Consent:</span> Withdraw consent for marketing communications</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-6 font-light">
              To exercise your rights, contact us at <span className="text-black">privacy@facadely.com</span>. We will respond within 30 days.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">7. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              We retain your information for as long as necessary to provide our Service and comply with legal obligations:
            </p>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200">Active accounts: Data retained while your account is active</li>
              <li className="pl-6 border-l border-gray-200">Closed accounts: Account data deleted within 30 days of closure</li>
              <li className="pl-6 border-l border-gray-200">Legal requirements: Some data may be retained longer to comply with legal obligations</li>
            </ul>
          </section>

          {/* International Transfers */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">8. International Data Transfers</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              facadely is based in South Korea. If you access our Service from outside South Korea, your information may be transferred to, stored, and processed in South Korea or other countries where our service providers operate.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses approved by regulatory authorities.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">9. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed font-light">
              facadely is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child without parental consent, we will take steps to delete that information promptly.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              We may update this Privacy Policy periodically. We will notify you of material changes by:
            </p>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200">Posting the updated policy on this page with a new &quot;Last Updated&quot; date</li>
              <li className="pl-6 border-l border-gray-200">Sending an email notification to your registered email address</li>
              <li className="pl-6 border-l border-gray-200">Displaying a prominent notice on our Service</li>
            </ul>
          </section>

          {/* Regional Compliance */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">11. Regional Privacy Information</h2>

            <h3 className="text-xl font-light text-black mt-8 mb-4">For EU/EEA Users (GDPR)</h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              If you are located in the European Union or European Economic Area, you have additional rights under GDPR:
            </p>
            <ul className="space-y-2 text-gray-600 font-light mb-6">
              <li className="pl-6 border-l border-gray-200">Right to lodge a complaint with your local supervisory authority</li>
              <li className="pl-6 border-l border-gray-200">Right to object to automated decision-making and profiling</li>
              <li className="pl-6 border-l border-gray-200">Legal basis for processing: Consent, contractual necessity, legitimate interests</li>
            </ul>

            <h3 className="text-xl font-light text-black mt-8 mb-4">For California Users (CCPA)</h3>
            <p className="text-gray-600 leading-relaxed mb-4 font-light">
              California residents have specific rights under the California Consumer Privacy Act:
            </p>
            <ul className="space-y-2 text-gray-600 font-light">
              <li className="pl-6 border-l border-gray-200">Right to know what personal information is collected and how it&apos;s used</li>
              <li className="pl-6 border-l border-gray-200">Right to delete personal information (with certain exceptions)</li>
              <li className="pl-6 border-l border-gray-200">Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li className="pl-6 border-l border-gray-200">Right to non-discrimination for exercising CCPA rights</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mb-16">
            <h2 className="text-2xl font-light text-black mb-6 tracking-tight">12. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed font-light mb-6">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="border border-gray-200 rounded-none p-8">
              <p className="text-gray-600 font-light mb-2"><span className="text-black">General Inquiries:</span> privacy@facadely.com</p>
              <p className="text-gray-600 font-light mb-2"><span className="text-black">Data Protection Officer:</span> dpo@facadely.com</p>
              <p className="text-gray-600 font-light"><span className="text-black">Address:</span> facadely Corp., Seoul, South Korea</p>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 pt-12 border-t border-gray-100">
          <p className="text-center text-gray-400 mb-8 font-light">
            Your privacy is important to us. We&apos;re committed to protecting your data and being transparent about our practices.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={`/${lang}/login`}
              className="px-8 py-3 bg-black text-white font-light rounded-none hover:bg-gray-900 transition-colors duration-300"
            >
              Get Started
            </Link>
            <Link
              href={`/${lang}/terms`}
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
