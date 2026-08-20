import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateSEO } from '../lib/seo';

export const Disclaimer: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Editorial & Affiliate Disclaimer — AI Nexus',
      description: 'Transparent disclosure regarding affiliate links, editorial standards, and third-party AI software representations.'
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <Breadcrumbs items={[{ name: 'Disclaimer' }]} />

      <div className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6 text-slate-300 leading-relaxed text-sm">
        <h1 className="text-3xl font-extrabold text-white font-display">Editorial & Affiliate Disclaimer</h1>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Affiliate Disclosure</h2>
          <p>
            AI Nexus is an independently owned resource. To support our operational, testing, and hosting costs, some of the links on this website may be affiliate links. If you click on an affiliate link and make a purchase or subscribe to an AI software service, we may receive a small commission at no additional cost to you.
          </p>
          <p>
            Our editorial ratings, reviews, and inclusions in our directory are based on genuine testing and merit. We do not accept payment to provide misleadingly positive reviews.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. AI Technology & Rapid Evolution Disclaimer</h2>
          <p>
            Artificial intelligence software evolves rapidly. Features, model versions, API token limits, data retention policies, and pricing structures frequently change without prior notice. Always verify critical terms directly on the official website of the respective AI software vendor before purchasing or entering sensitive corporate data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Not Financial or Legal Advice</h2>
          <p>
            The content provided on AI Nexus is for informational and educational purposes only and does not constitute financial, legal, cybersecurity, or enterprise consulting advice.
          </p>
        </section>
      </div>
    </div>
  );
};
