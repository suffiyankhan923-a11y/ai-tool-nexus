import React, { useEffect } from 'react';
import { Sparkles, ShieldCheck, Zap, Users, Award, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { updateSEO } from '../lib/seo';

export const About: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'About AI Nexus — Mission & Editorial Standards',
      description: 'Learn about AI Nexus, our curation methodology, and our commitment to providing independent, rigorous reviews of artificial intelligence software.'
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <Breadcrumbs items={[{ name: 'About Us' }]} />

      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            Empowering Human Creativity in the Era of AI
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            AI Nexus was founded to cut through the marketing noise and bring transparency, empirical testing, and clear guidance to the rapidly evolving landscape of artificial intelligence tools.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Rigorous Curation</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every tool in our directory undergoes hands-on testing. We verify functionality, evaluate privacy policies, assess customer support, and benchmark actual output quality.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Editorial Independence</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our ratings and rankings cannot be purchased. While we may utilize transparent affiliate relationships to fund operations, our editorial evaluations remain strictly impartial.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Up-to-Date Intelligence</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              AI software moves at breakneck speeds. We continuously monitor changelogs, model updates, and pricing shifts to keep directory entries fresh and accurate.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Community Driven</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We welcome submissions, honest user reviews, and feedback from creators, developers, and founders building on the frontier of AI technology.
            </p>
          </div>
        </div>

        {/* Detailed Story */}
        <div className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl space-y-4 text-slate-300 leading-relaxed text-sm">
          <h2 className="text-xl font-bold text-white font-display">Why We Built AI Nexus</h2>
          <p>
            With hundreds of new AI tools launching every week, professionals are overwhelmed with fragmented information and deceptive marketing. Finding the right tool for an exact workflow—whether refactoring legacy codebases, generating cinematic b-roll, or synthesizing scientific research—should not take days of trial and error.
          </p>
          <p>
            AI Nexus provides a structured, searchable catalog complete with direct pricing comparisons, pros and cons, and real-world benchmark tutorials.
          </p>
        </div>
      </div>
    </div>
  );
};
