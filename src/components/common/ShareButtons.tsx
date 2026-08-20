import React, { useState } from 'react';
import { Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mr-1">
        Share:
      </span>
      <button
        type="button"
        onClick={shareTwitter}
        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 flex items-center justify-center transition cursor-pointer"
        title="Share on X / Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={shareLinkedin}
        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 flex items-center justify-center transition cursor-pointer"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={shareFacebook}
        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 flex items-center justify-center transition cursor-pointer"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
          copied
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
        title="Copy URL link"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
};
