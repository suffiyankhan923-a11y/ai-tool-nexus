import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateSEO } from '../lib/seo';

export const Terms: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Terms of Service — AI Nexus',
      description: 'Terms and conditions governing the use of the AI Nexus platform and services.'
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <Breadcrumbs items={[{ name: 'Terms of Service' }]} />

      <div className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6 text-slate-300 leading-relaxed text-sm">
        <h1 className="text-3xl font-extrabold text-white font-display">Terms of Service</h1>
        <p className="text-xs text-slate-500 font-mono">Effective Date: January 1, 2026</p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the AI Nexus website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Use License & Intellectual Property</h2>
          <p>
            Permission is granted to browse and search the AI tool listings and read editorial content for personal or internal business evaluation purposes. You may not scrape, systematically copy, or redistribute our curated database content without prior written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Directory Listings and Accuracy</h2>
          <p>
            While we strive to keep information accurate and up to date, AI product features, subscription pricing, and policies change frequently. AI Nexus makes no warranties regarding the accuracy, completeness, or reliability of third-party software information listed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Limitation of Liability</h2>
          <p>
            In no event shall AI Nexus or its operators be liable for any damages arising out of the use or inability to use the materials on AI Nexus or any third-party AI software linked through our directory.
          </p>
        </section>
      </div>
    </div>
  );
};
