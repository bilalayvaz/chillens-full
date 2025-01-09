'use client';

import React from 'react';
import Navbar from '../components/Navbar';

export default function TermsOfUse() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-2 md:p-12">
        <h1 className="text-3xl font-bold mb-4">Chillens Terms of Use</h1>
        <p className="text-sm mb-2">Effective Date: 4th of January 2025</p>
        <p className="mb-4">
            Welcome to <strong>Chillens!</strong> These Terms of Use ("Terms") govern your access to and use of the Chillens website, interface, and related services (collectively, the "Services"). The Services are provided by <strong>Chillens</strong> ("we," "us," or "our").
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">
            By accessing or using our Services, including our websites (e.g., chillens.com) and applications, you agree to these Terms, our Privacy Policy, and any other referenced policies (collectively, the "Agreement"). If you do not agree, you must not use our Services.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">2. Use of Services</h2>
        <ul className="list-disc list-inside mb-4">
            <li><strong>Eligibility:</strong> You must be legally capable of entering into this Agreement. If you are not, you may not use our Services.</li>
            <li><strong>Updates:</strong> We reserve the right to update the Services and these Terms at any time. Continued use of the Services constitutes acceptance of the updated Terms.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">3. Services Overview</h2>
        <ul className="list-disc list-inside mb-4">
            <p>The Chillens platform allows users to engage with blockchain-based tools and applications. It operates in a decentralized manner, and transactions occur on permissionless public blockchains, such as Polygon.</p>
            <li><strong>Information Provided:</strong> Content available through Chillens is for informational purposes only. We strive for accuracy but cannot guarantee the timeliness or completeness of information provided.</li>
            <li><strong>User Responsibility:</strong> You retain full control of your cryptoassets when interacting with Chillens. You are solely responsible for securing your wallet and private keys.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">4. Assumption of Risk</h2>
        <ul className="list-disc list-inside mb-4">
            <li><strong>Blockchain Risks:</strong> Engaging with blockchain technology involves risks, including bugs, cyberattacks, and transaction failures. By using our Services, you assume these risks.</li>
            <li><strong>No Intermediary Role:</strong> Chillens is not a custodian, intermediary, or agent. Transactions occur directly between blockchain participants.</li>
            <li><strong>No Guarantee:</strong> We do not guarantee uninterrupted access or functionality of our Services and disclaim liability for any associated risks.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">5. Prohibited Conduct</h2>
        <ul className="list-disc list-inside mb-4">
        <p>You agree not to:</p>
            <li>Use the Services for illegal activities.</li>
            <li>Engage in fraud, hacking, or exploiting smart contracts.</li>
            <li>Upload malicious code or attempt to disrupt the Services.</li>
            <p>Violations of these Terms may result in restricted access or other actions deemed necessary.</p>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">6. Limitation of Liability</h2>
        <p className="mb-4">The Services are provided "as is" and "as available." Chillens disclaims all warranties, express or implied, including merchantability or fitness for a particular purpose. To the fullest extent permitted by law, we are not liable for any damages arising from the use of the Services.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">7. Taxes</h2>
        <p className="mb-4">You are responsible for any taxes or duties associated with your use of the Services.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">8. Ownership</h2>
        <ul className="list-disc list-inside mb-4">
            <li><strong>License:</strong> We grant you a limited, revocable license to use the Services, provided you comply with these Terms.</li>
            <li><strong>Intellectual Property:</strong> All rights, titles, and interests in the Services remain with Chillens.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">9. Arbitration</h2>
        <p className="mb-4">All disputes arising from these Terms shall be resolved through binding arbitration under the laws of the Cayman Islands. By agreeing to these Terms, you waive the right to a jury trial or to participate in a class action.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">10. Termination</h2>
        <p className="mb-4">We may terminate or suspend your access to the Services at our discretion if you violate these Terms or if we deem it necessary for security, compliance, or operational reasons.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">11. Governing Law</h2>
        <p className="mb-4">These Terms shall be governed by and construed in accordance with the laws of the Cayman Islands.</p>

        <h2 className="text-2xl font-bold mt-6 mb-2">12. Contact Us</h2>
        <p className="mb-4">For questions or support, contact us at: <strong>chillens.lens@gmail.com</strong></p>
        </main>
    </>
  );
}
