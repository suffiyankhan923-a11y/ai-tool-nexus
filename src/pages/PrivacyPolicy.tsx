import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateSEO } from '../lib/seo';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Privacy Policy — AI Nexus',
      description: 'Privacy policy for AI Nexus detailing our data practices, cookie usage, Google AdSense compliance, and user rights.'
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <Breadcrumbs items={[{ name: 'Privacy Policy' }]} />

      <div className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6 text-slate-300 leading-relaxed text-sm">
        <h1 className="text-3xl font-extrabold text-white font-display">Privacy Policy</h1>
        <p className="text-xs text-slate-500 font-mono">Last updated: January 1, 2026</p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Introduction</h2>
          <p>
            Welcome to AI Nexus ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website (the "Site").
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
            <li><strong className="text-slate-200">Personal Data:</strong> Voluntarily provided details such as your name and email address when subscribing to our newsletter, submitting an AI tool proposal, or contacting us.</li>
            <li><strong className="text-slate-200">Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and referring website addresses.</li>
            <li><strong className="text-slate-200">Local Storage:</strong> We use client-side local storage to store user preferences such as your saved tool bookmarks.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Google AdSense & Third-Party Advertising</h2>
          <p>
            We may display advertisements served by Google AdSense and other advertising networks. Google uses cookies to serve ads based on a user's prior visits to our website or other websites on the Internet.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting Google Ads Settings (<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">www.google.com/settings/ads</a>).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Third-Party Links & Services</h2>
          <p>
            The Site contains links to third-party AI software websites, products, and services. We are not responsible for the content, privacy policies, or practices of any third-party websites. We encourage you to review the privacy policies of any third-party services you visit.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@ainexus.directory" className="text-blue-400 font-semibold font-mono">privacy@ainexus.directory</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
