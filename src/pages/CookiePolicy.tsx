import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateSEO } from '../lib/seo';

export const CookiePolicy: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Cookie Policy — AI Nexus',
      description: 'Information on how cookies and local storage are utilized on AI Nexus.'
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <Breadcrumbs items={[{ name: 'Cookie Policy' }]} />

      <div className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6 text-slate-300 leading-relaxed text-sm">
        <h1 className="text-3xl font-extrabold text-white font-display">Cookie Policy</h1>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work efficiently, as well as to provide information to site owners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. How We Use Cookies</h2>
          <p>AI Nexus uses cookies and browser local storage for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
            <li><strong className="text-slate-200">Essential & Functional:</strong> Storing your saved bookmarks locally in your browser so they persist between visits.</li>
            <li><strong className="text-slate-200">Analytics & Performance:</strong> Understanding visitor interaction to optimize directory navigation and content structure.</li>
            <li><strong className="text-slate-200">Advertising:</strong> Third-party advertising partners like Google AdSense use cookies to serve relevant advertisements.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Managing Your Cookie Preferences</h2>
          <p>
            Most web browsers allow you to control cookies through their browser settings. You can choose to block or delete cookies at any time.
          </p>
        </section>
      </div>
    </div>
  );
};
