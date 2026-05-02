import { useState } from 'react';
import { AppState, BrandStyle, RoomInventoryItem, ShotPlanItem, GeneratedImage } from './types';
import { UploadStep } from './components/UploadStep';
import { AnalysisStep } from './components/AnalysisStep';
import { ShotPlanStep } from './components/ShotPlanStep';
import { ResultsStep } from './components/ResultsStep';
import { ExportStep } from './components/ExportStep';
import { analyzeRoomImage, generateShotImage, generateCaption } from './services/geminiService';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [state, setState] = useState<AppState>({
    step: 'upload',
    heroImage: null,
    roomType: 'Deluxe King',
    brandStyle: 'Luxury',
    strictness: 80,
    inventory: [],
    shotPlan: [],
    results: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState('');

  const handleUpload = async (file: File, roomType: string, style: BrandStyle, strictness: number) => {
    setIsLoading(true);
    setLoadingMessage('Reading image...');
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setLoadingMessage('Analyzing room features...');
      const { inventory, shotPlan } = await analyzeRoomImage(base64, roomType);
      
      setState(prev => ({
        ...prev,
        heroImage: base64,
        roomType,
        brandStyle: style,
        strictness,
        inventory,
        shotPlan,
        step: 'analysis'
      }));
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please try a smaller image or check your connection.");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const activeShots = state.shotPlan.filter(s => s.included);
      const generatedResults: GeneratedImage[] = [];

      for (const shot of activeShots) {
        if (!state.heroImage) continue;
        
        const imageUrl = await generateShotImage(
          state.heroImage, 
          shot, 
          state.brandStyle, 
          state.strictness
        );

        const { caption, altText } = await generateCaption(imageUrl, shot.name);

        generatedResults.push({
          id: `res-${shot.id}`,
          shotId: shot.id,
          url: imageUrl,
          caption,
          altText,
          isVerified: shot.confidence === 'High',
          variations: [imageUrl]
        });
      }

      setState(prev => ({
        ...prev,
        results: generatedResults,
        step: 'results'
      }));
      setIsLoading(false);
    } catch (error) {
      console.error("Generation failed:", error);
      setIsLoading(false);
    }
  };

  const toggleShot = (id: string) => {
    setState(prev => ({
      ...prev,
      shotPlan: prev.shotPlan.map(s => s.id === id ? { ...s, included: !s.included } : s)
    }));
  };

  const updateInstructions = (id: string, text: string) => {
    setState(prev => ({
      ...prev,
      shotPlan: prev.shotPlan.map(s => s.id === id ? { ...s, instructions: text } : s)
    }));
  };

  const handleVerify = (id: string) => {
    setState(prev => ({
      ...prev,
      results: prev.results.map(r => r.id === id ? { ...r, isVerified: true } : r)
    }));
  };

  return (
    <div className="min-h-screen bg-brand-bg selection:bg-brand-accent/20">
      {/* Navigation Header */}
      <nav className="border-b border-black/5 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-ink rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold">R</span>
            </div>
            <span className="font-serif font-bold text-lg tracking-tight">RoomStory</span>
          </div>
          
          <div className="flex items-center gap-8">
            {['upload', 'analysis', 'plan', 'results', 'export'].map((s, idx) => (
              <div 
                key={s} 
                className={cn(
                  "flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all",
                  state.step === s ? "text-brand-accent" : "text-brand-ink/20"
                )}
              >
                <span className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center",
                  state.step === s ? "border-brand-accent bg-brand-accent/10" : "border-black/10"
                )}>
                  {idx + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {state.step === 'upload' && (
              <UploadStep onUpload={handleUpload} isLoading={isLoading} loadingMessage={loadingMessage} />
            )}
            {state.step === 'analysis' && state.heroImage && (
              <AnalysisStep 
                inventory={state.inventory} 
                heroImage={state.heroImage} 
                onNext={() => setState(p => ({ ...p, step: 'plan' }))} 
              />
            )}
            {state.step === 'plan' && (
              <ShotPlanStep 
                plan={state.shotPlan} 
                onToggle={toggleShot}
                onUpdateInstructions={updateInstructions}
                onGenerate={handleGenerate}
                isGenerating={isLoading}
              />
            )}
            {state.step === 'results' && (
              <ResultsStep 
                results={state.results} 
                onExport={() => setState(p => ({ ...p, step: 'export' }))} 
                onVerify={handleVerify}
              />
            )}
            {state.step === 'export' && (
              <ExportStep 
                results={state.results} 
                roomType={state.roomType}
                onReset={() => setState({
                  step: 'upload',
                  heroImage: null,
                  roomType: 'Deluxe King',
                  brandStyle: 'Luxury',
                  strictness: 80,
                  inventory: [],
                  shotPlan: [],
                  results: []
                })} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-black/5 mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-brand-ink/40 uppercase tracking-widest font-medium">
            © 2026 RoomStory AI • Powered by Gemini
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-brand-ink/40 hover:text-brand-ink transition-colors uppercase tracking-widest font-medium">Privacy</a>
            <a href="#" className="text-xs text-brand-ink/40 hover:text-brand-ink transition-colors uppercase tracking-widest font-medium">Terms</a>
            <a href="#" className="text-xs text-brand-ink/40 hover:text-brand-ink transition-colors uppercase tracking-widest font-medium">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
