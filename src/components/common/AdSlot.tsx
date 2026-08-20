import React from 'react';

export type AdPlacement = 'horizontal' | 'rectangle' | 'sidebar' | 'inArticle';

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
  slotId?: string;
}

/**
 * Reusable Google AdSense Placement Component
 * 
 * Instructions to connect Google AdSense after approval:
 * 1. Add your AdSense script tag inside index.html <head>:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
 * 2. In this component, uncomment the <ins class="adsbygoogle"> block and pass your data-ad-client and data-ad-slot.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  placement,
  className = '',
  slotId = 'ai-nexus-ad'
}) => {
  const getDimensions = () => {
    switch (placement) {
      case 'horizontal':
        return 'w-full min-h-[90px] max-h-[120px] max-w-5xl mx-auto';
      case 'rectangle':
        return 'w-full max-w-[336px] min-h-[280px] mx-auto';
      case 'sidebar':
        return 'w-full min-h-[600px] max-w-[300px] mx-auto';
      case 'inArticle':
        return 'w-full min-h-[120px] my-6';
      default:
        return 'w-full min-h-[90px]';
    }
  };

  return (
    <div
      id={slotId}
      className={`relative my-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] backdrop-blur-md p-3 text-center flex flex-col items-center justify-center overflow-hidden ${getDimensions()} ${className}`}
      aria-label="Advertisement Area"
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-slate-500 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-md">
          Advertisement
        </span>
      </div>

      {/* 
        ========================================================================
        GOOGLE ADSENSE CODE INTEGRATION (Uncomment after receiving publisher ID)
        ========================================================================
        
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      */}

      <div className="text-xs text-slate-400/80 font-mono select-none">
        AdSense Placement Space ({placement})
      </div>
    </div>
  );
};
