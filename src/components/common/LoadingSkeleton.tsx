import React from 'react';

export const ToolCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0c0d14]/80 p-5 shadow-xl animate-pulse flex flex-col justify-between h-[280px]">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10" />
            <div>
              <div className="w-28 h-4 rounded-md bg-white/10 mb-2" />
              <div className="w-16 h-3 rounded-md bg-white/5" />
            </div>
          </div>
          <div className="w-14 h-5 rounded-full bg-white/5" />
        </div>
        <div className="w-full h-3 rounded bg-white/5 mb-2" />
        <div className="w-4/5 h-3 rounded bg-white/5 mb-2" />
        <div className="w-2/3 h-3 rounded bg-white/5" />
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="w-20 h-4 rounded bg-white/5" />
        <div className="w-20 h-8 rounded-lg bg-white/10" />
      </div>
    </div>
  );
};

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0c0d14]/80 overflow-hidden shadow-xl animate-pulse flex flex-col h-[380px]">
      <div className="w-full h-48 bg-white/10" />
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="w-20 h-4 rounded bg-white/5 mb-3" />
          <div className="w-full h-5 rounded bg-white/10 mb-2" />
          <div className="w-3/4 h-5 rounded bg-white/10 mb-3" />
          <div className="w-full h-3 rounded bg-white/5 mb-1.5" />
          <div className="w-4/5 h-3 rounded bg-white/5" />
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
          <div className="w-8 h-8 rounded-full bg-white/10" />
          <div className="w-24 h-3 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0c0d14]/80 p-5 shadow-xl animate-pulse flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-white/10 shrink-0" />
      <div className="flex-1">
        <div className="w-28 h-4 rounded bg-white/10 mb-2" />
        <div className="w-16 h-3 rounded bg-white/5" />
      </div>
    </div>
  );
};
