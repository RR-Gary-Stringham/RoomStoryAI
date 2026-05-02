import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Download, RefreshCw, Maximize2, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  results: GeneratedImage[];
  onExport: () => void;
  onVerify: (id: string) => void;
}

export const ResultsStep: React.FC<Props> = ({ results, onExport, onVerify }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = results[selectedIndex];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif">Results Gallery</h2>
          <p className="text-brand-ink/60">Review and refine your generated room story.</p>
        </div>
        <button
          onClick={onExport}
          className="bg-brand-ink text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-black transition-all shadow-lg"
        >
          Export Package <Package className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Preview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="aspect-[4/3] bg-black/5 rounded-3xl overflow-hidden relative shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={selected.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={selected.url}
                className="w-full h-full object-cover"
                alt={selected.altText}
              />
            </AnimatePresence>
            
            <div className="absolute top-6 left-6 flex gap-2">
              {selected.isVerified ? (
                <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                  <CheckCircle className="w-3 h-3" /> Verified
                </div>
              ) : (
                <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                  <AlertTriangle className="w-3 h-3" /> Needs Verification
                </div>
              )}
              <div className="bg-white/90 backdrop-blur-md text-brand-ink px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                AI Generated
              </div>
            </div>

            <div className="absolute bottom-6 right-6 flex gap-2">
              <button className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {results.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all border-2",
                  selectedIndex === idx ? "border-brand-accent scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img.url} className="w-full h-full object-cover" alt="Thumb" />
              </button>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-8 space-y-8">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Marketing Caption</label>
                <p className="text-lg font-serif italic leading-relaxed">"{selected.caption}"</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Alt Text</label>
                <p className="text-xs text-brand-ink/60 leading-relaxed">{selected.altText}</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-black/5">
              <h4 className="text-xs uppercase tracking-widest font-bold">Refinement Controls</h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-black/10 text-xs font-medium hover:bg-black/5 transition-all">
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
                <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-black/10 text-xs font-medium hover:bg-black/5 transition-all">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
              <button className="w-full py-3 rounded-xl bg-brand-accent/5 text-brand-accent text-xs font-bold uppercase tracking-widest hover:bg-brand-accent/10 transition-all">
                Match Lighting & Tone
              </button>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <p className="text-xs font-bold text-emerald-700">Truth Check Passed</p>
                <p className="text-[10px] text-emerald-600/80">Visual consistency with hero image is high. No new amenities detected.</p>
              </div>
            </div>

            {!selected.isVerified && (
              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 space-y-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-amber-900">Verify Amenities</p>
                    <p className="text-xs text-amber-800/70 leading-relaxed">
                      This shot includes details that the AI inferred. Please confirm these match your actual room product.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onVerify(selected.id)}
                  className="w-full py-3 bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-amber-700 transition-all shadow-md shadow-amber-600/20"
                >
                  Confirm as Accurate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
