import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, HelpCircle, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { submitContactMessage } from '../lib/services/interactionService';
import { ContactMessage } from '../types';
import { updateSEO } from '../lib/seo';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    updateSEO({
      title: 'Contact Us — AI Nexus Support & Inquiries',
      description: 'Get in touch with the AI Nexus team for editorial inquiries, tool listing updates, advertising partnerships, or general feedback.'
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const res = await submitContactMessage(formData);
    setFeedback(res.message);

    if (res.success) {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <Breadcrumbs items={[{ name: 'Contact' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left column: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              We'd Love to Hear From You
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Have a suggestion, partnership inquiry, or need assistance with a directory listing? Send us a message and we'll get back to you within 24-48 hours.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#0c0d14]/80 backdrop-blur-xl border border-white/10 shadow-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Editorial & Submissions</div>
                <div className="text-xs text-slate-400 font-mono">editorial@ainexus.directory</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0d14]/80 backdrop-blur-xl border border-white/10 shadow-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Advertising & Sponsorships</div>
                <div className="text-xs text-slate-400 font-mono">partnerships@ainexus.directory</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0d14]/80 backdrop-blur-xl border border-white/10 shadow-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Average Response Time</div>
                <div className="text-xs text-slate-400">Under 24 hours on business days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-7">
          <div className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Send a Direct Message</h2>

            {status === 'success' ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 text-emerald-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="font-bold text-base text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-emerald-300/80">{feedback}</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                {status === 'error' && (
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-300 text-xs font-medium border border-rose-500/30">
                    {feedback}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-400 mb-1">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-500 outline-hidden transition text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-400 mb-1">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-500 outline-hidden transition text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-400 mb-1">
                    Subject <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Tool Listing Update / Question"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-500 outline-hidden transition text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-400 mb-1">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist you?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-500 outline-hidden transition text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === 'loading' ? 'Sending message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
