import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Sliders, ArrowRight, Loader2 } from 'lucide-react';
import { BrandStyle } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface Props {
  onUpload: (file: File, roomType: string, style: BrandStyle, strictness: number) => void;
  isLoading: boolean;
  loadingMessage?: string;
}

export const UploadStep: React.FC<Props> = ({ onUpload, isLoading, loadingMessage }) => {
  const [roomType, setRoomType] = useState('Deluxe King');
  const [style, setStyle] = useState<BrandStyle>('Luxury');
  const [strictness, setStrictness] = useState(80);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  } as any);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-serif tracking-tight">RoomStory AI</h1>
        <p className="text-brand-ink/60 max-w-xl mx-auto text-lg">
          Turn one hero room photo into a complete visual story.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div 
            {...getRootProps()} 
            className={cn(
              "aspect-[4/3] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group",
              isDragActive ? "border-brand-accent bg-brand-accent/5" : "border-black/10 hover:border-black/20",
              preview ? "border-none" : ""
            )}
          >
            <input {...getInputProps()} />
            {preview ? (
              <>
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-medium flex items-center gap-2">
                    <Upload className="w-5 h-5" /> Change Image
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 p-8">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-brand-ink/40" />
                </div>
                <div>
                  <p className="font-medium">Drop your hero image here</p>
                  <p className="text-sm text-brand-ink/40">Ideally 2000px+ JPG or PNG</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-ink/50">Room Type</label>
              <input 
                type="text" 
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all"
                placeholder="e.g. Deluxe King"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-brand-ink/50">Brand Style Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Minimal', 'Warm', 'Bold', 'Luxury', 'Playful'] as BrandStyle[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={cn(
                      "px-3 py-2 text-sm rounded-lg border transition-all",
                      style === s 
                        ? "bg-brand-ink text-white border-brand-ink" 
                        : "bg-white text-brand-ink/60 border-black/10 hover:border-black/20"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest font-semibold text-brand-ink/50">"Do Not Invent" Strictness</label>
                <span className="text-xs font-mono">{strictness}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={strictness}
                onChange={(e) => setStrictness(parseInt(e.target.value))}
                className="w-full accent-brand-accent"
              />
              <p className="text-[10px] text-brand-ink/40 italic">
                Higher strictness limits AI hallucination of amenities not visible in the source.
              </p>
            </div>
          </div>

          <button
            disabled={!file || isLoading}
            onClick={() => file && onUpload(file, roomType, style, strictness)}
            className={cn(
              "w-full py-4 rounded-xl font-medium flex flex-col items-center justify-center gap-1 transition-all",
              !file || isLoading
                ? "bg-black/5 text-black/20 cursor-not-allowed"
                : "bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg shadow-brand-accent/20"
            )}
          >
            {isLoading ? (
              <>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> 
                  <span>Processing...</span>
                </div>
                {loadingMessage && <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">{loadingMessage}</span>}
              </>
            ) : (
              <div className="flex items-center gap-2">
                Analyze Room <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
