import React from 'react';
import { Download, CheckCircle2, FileJson, FileImage, Archive, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import JSZip from 'jszip';

interface Props {
  onReset: () => void;
  results: any[];
  roomType: string;
}

export const ExportStep: React.FC<Props> = ({ onReset, results, roomType }) => {
  const handleDownload = async () => {
    const zip = new JSZip();
    const folder = zip.folder("room_story_package");
    
    // Add images
    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      const response = await fetch(res.url);
      const blob = await response.blob();
      folder?.file(`${roomType.toLowerCase().replace(/ /g, '_')}_shot_${i+1}.png`, blob);
    }

    // Add metadata
    const metadata = {
      roomType,
      generatedAt: new Date().toISOString(),
      shots: results.map(r => ({
        caption: r.caption,
        altText: r.altText
      }))
    };
    folder?.file("metadata.json", JSON.stringify(metadata, null, 2));

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `room_story_${roomType.toLowerCase().replace(/ /g, '_')}.zip`;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto py-24 px-6 text-center space-y-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20"
      >
        <CheckCircle2 className="w-12 h-12 text-white" />
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-5xl font-serif">Package Ready</h2>
        <p className="text-brand-ink/60 text-lg">Your curated room story has been generated and packaged for export.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <FileImage className="w-8 h-8 text-brand-accent mx-auto" />
          <p className="text-sm font-medium">{results.length} High-Res Images</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <FileJson className="w-8 h-8 text-brand-accent mx-auto" />
          <p className="text-sm font-medium">Metadata & Captions</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <Archive className="w-8 h-8 text-brand-accent mx-auto" />
          <p className="text-sm font-medium">Optimized ZIP Archive</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <button
          onClick={handleDownload}
          className="bg-brand-accent text-white px-12 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/20"
        >
          <Download className="w-5 h-5" /> Download ZIP Package
        </button>
        <button
          onClick={onReset}
          className="bg-white border border-black/10 text-brand-ink px-12 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black/5 transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Start New Room
        </button>
      </div>
    </div>
  );
};
