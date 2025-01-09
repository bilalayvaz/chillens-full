'use client';

import React from 'react';
import Navbar from '../components/Navbar';

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-2 md:p-12">
        <h1 className="text-3xl font-bold mb-4">Chillens Privacy Policy</h1>
        <p className="text-sm mb-2">Effective Date: 4th of January 2025</p>
        <p className="mb-4">
          This Privacy Policy ("Policy") explains how Chillens ("we," "our," or "us") collects, uses, and shares information in connection with our services (the "Services"), including through our website and any associated interfaces. By using our Services, you agree to the terms of this Privacy Policy. If you do not agree, you should not use the Services.
          <br />
          For any questions, please contact us at: chillens.lens@gmail.com
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">1. Information We Collect</h2>
        <h3 className="text-xl font-semibold mt-4 mb-2">A. Information You Provide</h3>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Correspondence and Content:</strong> This includes your name, contact information, and any content you include in messages you send us (e.g., feedback or support requests).</li>
          <li><strong>Optional Information:</strong> If you choose to provide unsolicited information, you are solely responsible for it.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">B. Information Collected Automatically</h3>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Wallet Address:</strong>
            <ul className="list-disc list-inside pl-5">
              <li>We collect your wallet address when you connect to our interface, such as for blocking addresses involved in prohibited conduct or analyzing usage patterns.</li>
            </ul>
          </li>
          <li><strong>Device Information:</strong>
            <ul className="list-disc list-inside pl-5">
              <li>Information about your device (e.g., operating system, browser type, screen size) helps us optimize your experience.</li>
            </ul>
          </li>
          <li><strong>Usage Information:</strong>
            <ul className="list-disc list-inside pl-5">
              <li>We collect data on how you interact with the Services, including accessed pages, clicked links, and actions taken. This helps us improve the user experience.</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">2. How We Use Information</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Provide and Manage the Services:</strong> Respond to requests, detect fraud, and ensure compliance with terms.</li>
          <li><strong>Improve the Services:</strong> Analyze user behavior and feedback to enhance the Services.</li>
          <li><strong>Security and Compliance:</strong> Protect the integrity of the interface and comply with legal requirements.</li>
          <li><strong>Consent-Based Purposes:</strong> Use information for purposes where you’ve given consent.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">3. Sharing Information</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Service Providers:</strong> Third-party partners for analytics, security, and support.</li>
          <li><strong>Professional Advisors:</strong> For compliance and audits.</li>
          <li><strong>Affiliates:</strong> Related entities for internal purposes.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">4. Cookies</h2>
        <p className="mb-4">We currently do not use cookies. If we introduce cookies in the future, this section will outline their purpose and how you can manage them.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">5. Security</h2>
        <p className="mb-4">We implement reasonable measures to safeguard your information. However, no transmission over the Internet is completely secure, and we cannot guarantee absolute security.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">6. Data Retention</h2>
        <p className="mb-4">We retain information only as long as necessary to fulfill the purpose for which it was collected or to comply with legal obligations.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">7. Your Rights</h2>
        <p className="mb-4">For blockchain-related data, please note that we cannot modify information stored on the blockchain.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">8. International Transfers</h2>
        <p className="mb-4">Information may be transferred and stored in jurisdictions outside your country. By using the Services, you consent to such transfers.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">9. Changes to this Privacy Policy</h2>
        <p className="mb-4">We may update this Policy periodically. Changes will take effect immediately upon posting.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">10. Contact Us</h2>
        <p className="mb-4">For questions or concerns about this Privacy Policy, email us at: chillens.lens@gmail.com</p>
      </main>
    </>
  );
}
