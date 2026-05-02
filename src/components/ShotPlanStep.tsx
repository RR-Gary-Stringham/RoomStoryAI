import React from 'react';
import { ShotPlanItem } from '../types';
import { Camera, Check, X, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface Props {
  plan: ShotPlanItem[];
  onToggle: (id: string) => void;
  onUpdateInstructions: (id: string, text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ShotPlanStep: React.FC<Props> = ({ plan, onToggle, onUpdateInstructions, onGenerate, isGenerating }) => {
  const includedCount = plan.filter(s => s.included).length;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif">Proposed Shot Plan</h2>
          <p className="text-brand-ink/60">A curated selection of details to expand your room story.</p>
        </div>
        <button
          disabled={includedCount === 0 || isGenerating}
          onClick={onGenerate}
          className={cn(
            "px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg",
            includedCount === 0 || isGenerating
              ? "bg-black/5 text-black/20 cursor-not-allowed"
              : "bg-brand-accent text-white hover:bg-brand-accent/90 shadow-brand-accent/20"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Generating {includedCount} Shots...
            </>
          ) : (
            <>
              Generate Images ({includedCount}) <Sparkles className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plan.map((shot, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={shot.id}
            className={cn(
              "group relative glass-panel rounded-2xl overflow-hidden transition-all flex flex-col",
              !shot.included && "opacity-50 grayscale"
            )}
          >
            <div className="p-6 flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                      shot.purpose === 'Clarity' ? "bg-blue-50 text-blue-600" :
                      shot.purpose === 'Luxury' ? "bg-purple-50 text-purple-600" :
                      shot.purpose === 'Amenity' ? "bg-orange-50 text-orange-600" :
                      shot.purpose === 'Texture' ? "bg-emerald-50 text-emerald-600" :
                      "bg-rose-50 text-rose-600"
                    )}>
                      {shot.purpose}
                    </span>
                    <span className="text-[10px] font-mono text-brand-ink/30">CONF: {shot.confidence}</span>
                  </div>
                  <h3 className="text-xl font-serif">{shot.name}</h3>
                </div>
                <button
                  onClick={() => onToggle(shot.id)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    shot.included ? "bg-brand-accent text-white" : "bg-black/5 text-black/40"
                  )}
                >
                  {shot.included ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-sm text-brand-ink/60 leading-relaxed">
                {shot.description}
              </p>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">AI Instructions</label>
                <textarea
                  value={shot.instructions}
                  onChange={(e) => onUpdateInstructions(shot.id, e.target.value)}
                  className="w-full bg-black/5 border-none rounded-lg p-3 text-xs focus:ring-1 focus:ring-brand-accent/20 min-h-[80px] resize-none"
                />
              </div>
            </div>
            
            <div className="h-1 bg-black/5">
              {shot.included && <motion.div layoutId={`bar-${shot.id}`} className="h-full bg-brand-accent" />}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
