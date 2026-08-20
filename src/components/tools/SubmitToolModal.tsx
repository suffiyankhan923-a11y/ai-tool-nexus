import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { submitToolProposal, ToolSubmission } from '../../lib/services/interactionService';
import { Category } from '../../types';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export const SubmitToolModal: React.FC<SubmitToolModalProps> = ({ isOpen, onClose, categories }) => {
  const [formData, setFormData] = useState<ToolSubmission>({
    name: '',
    website_url: '',
    category: categories[0]?.name || 'AI Writing',
    pricing: 'Freemium',
    description: '',
    submitter_email: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await submitToolProposal(formData);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setFormData({
          name: '',
          website_url: '',
          category: categories[0]?.name || 'AI Writing',
          pricing: 'Freemium',
          description: '',
          submitter_email: ''
        });
      }, 2500);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0c0d14] p-6 sm:p-8 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto text-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-bold text-white">Submit an AI Tool</h3>
        </div>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Submit your product or a tool you love. Our editorial team reviews every listing before publishing to Supabase.
        </p>

        {successMsg ? (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center text-emerald-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="font-bold text-base mb-1 text-white">Submission Received!</h4>
            <p className="text-xs text-emerald-300/80">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-300 text-xs font-medium border border-rose-500/30">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-400 mb-1">
                Tool Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Acme AI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-500 outline-hidden transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-400 mb-1">
                Website URL <span className="text-rose-400">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.website_url}
                onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-500 outline-hidden transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 focus:border-blue-500 text-white outline-hidden text-sm cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name} className="bg-[#0e0f18]">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-400 mb-1">
                  Pricing Model
                </label>
                <select
                  value={formData.pricing}
                  onChange={e => setFormData({ ...formData, pricing: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 focus:border-blue-500 text-white outline-hidden text-sm cursor-pointer"
                >
                  <option value="Free" className="bg-[#0e0f18]">Free</option>
                  <option value="Freemium" className="bg-[#0e0f18]">Freemium</option>
                  <option value="Paid" className="bg-[#0e0f18]">Paid</option>
                  <option value="Free Trial" className="bg-[#0e0f18]">Free Trial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-400 mb-1">
                Short Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this AI tool do and why is it useful?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-500 outline-hidden transition resize-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-400 mb-1">
                Your Email (Optional, for notifications)
              </label>
              <input
                type="email"
                value={formData.submitter_email}
                onChange={e => setFormData({ ...formData, submitter_email: e.target.value })}
                placeholder="founder@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-500 outline-hidden transition text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting to neural pipeline...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit AI Tool to Directory</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
