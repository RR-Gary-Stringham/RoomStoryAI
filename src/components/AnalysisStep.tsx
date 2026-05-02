import React from 'react';
import { RoomInventoryItem } from '../types';
import { CheckCircle2, AlertCircle, ArrowRight, Info, Sliders } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface Props {
  inventory: RoomInventoryItem[];
  heroImage: string;
  onNext: () => void;
}

export const AnalysisStep: React.FC<Props> = ({ inventory, heroImage, onNext }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif">Room Inventory</h2>
          <p className="text-brand-ink/60">AI-detected features and design details from your hero image.</p>
        </div>
        <button
          onClick={onNext}
          className="bg-brand-accent text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-brand-accent/90 transition-all shadow-lg shadow-brand-accent/20"
        >
          Propose Shot Plan <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl relative">
            <img src={heroImage} className="w-full h-full object-cover" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded">Source Reference</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-6 h-full">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <h3 className="font-medium flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-accent" /> Detected Elements
              </h3>
              <span className="text-[10px] font-mono text-brand-ink/40 uppercase tracking-widest">{inventory.length} Items</span>
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {inventory.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{item.label}</p>
                    {item.description && <p className="text-[11px] text-brand-ink/40 italic">{item.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded",
                      item.confidence === 'High' ? "text-emerald-600 bg-emerald-50" :
                      item.confidence === 'Med' ? "text-amber-600 bg-amber-50" :
                      "text-rose-600 bg-rose-50"
                    )}>
                      {item.confidence}
                    </span>
                    {item.confidence === 'High' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 border-t border-black/5">
              <div className="flex items-center gap-3 p-3 bg-brand-accent/5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
                  <Sliders className="w-4 h-4 text-brand-accent" />
                </div>
                <p className="text-[11px] text-brand-ink/60 leading-relaxed">
                  The AI is focusing on <strong>textures</strong> and <strong>amenities</strong> to maximize conversion signals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
