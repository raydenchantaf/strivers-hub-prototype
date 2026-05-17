"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  const sections = [
    {
      title: "1. Information We Collect",
      body: "We collect information you provide directly to us when you register for an account, complete assessments, or sign up for programs. This may include your name, email address, contact number, and responses to assessment questions.",
    },
    {
      title: "2. How We Use Your Information",
      body: "We use the information we collect to operate and improve the Strivers' Hub platform, personalise your experience, communicate with you about programs and opportunities, and generate anonymised insights to support the Mastercard Strive Malaysia initiative.",
    },
    {
      title: "3. Sharing of Information",
      body: "We do not sell or rent your personal information to third parties. We may share your information with The Asia Foundation, Mastercard Center for Inclusive Growth, and programme partners solely for the purposes of delivering and improving the services described on this platform.",
    },
    {
      title: "4. Data Retention",
      body: "We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law. You may request deletion of your data at any time by contacting us.",
    },
    {
      title: "5. Security",
      body: "We take reasonable technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse. However, no method of transmission over the internet is completely secure.",
    },
    {
      title: "6. Your Rights",
      body: "You have the right to access, correct, or request deletion of your personal information. To exercise these rights, please contact us at the email address below.",
    },
    {
      title: "7. Cookies",
      body: "This platform may use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences.",
    },
    {
      title: "8. Changes to This Policy",
      body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated effective date.",
    },
    {
      title: "9. Contact Us",
      body: "If you have any questions about this Privacy Policy, please contact us at: privacy@strivershub.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark section-padding py-14">
        <div className="container-max text-center">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">
            Legal
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-sm">
            Effective date: 1 January 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="container-max section-padding py-14 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            This Privacy Policy describes how Strivers' Hub, operated by The Asia Foundation under the Mastercard Strive Malaysia initiative, collects, uses, and protects your personal information when you use this platform.
          </p>

          <div className="flex flex-col gap-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-base font-extrabold text-gray-900 mb-2">{s.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              This is a placeholder privacy policy page. Please replace this content with your organisation's official privacy policy before going live.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
