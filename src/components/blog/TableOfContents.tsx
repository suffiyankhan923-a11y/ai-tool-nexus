import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from markdown content
    const lines = content.split('\n');
    const items: TOCItem[] = [];

    lines.forEach(line => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const rawText = match[2].trim();
        const cleanText = rawText.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        const id = cleanText.toLowerCase().replace(/[^\w]+/g, '-');
        items.push({ id, text: cleanText, level });
      }
    });

    setHeadings(items);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sticky top-24 shadow-xl">
      <div className="flex items-center gap-2 mb-3 text-white font-bold text-sm">
        <List className="w-4 h-4 text-blue-400" />
        <span>Table of Contents</span>
      </div>

      <nav className="space-y-1.5 text-xs">
        {headings.map((item, idx) => (
          <a
            key={idx}
            href={`#${item.id}`}
            onClick={e => {
              e.preventDefault();
              setActiveId(item.id);
              const el = document.getElementById(item.id);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`block py-1 transition-colors leading-relaxed ${
              item.level === 3 ? 'pl-3.5 text-slate-400' : 'font-medium text-slate-300'
            } ${
              activeId === item.id
                ? 'text-blue-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
};
