export type BrandStyle = 'Minimal' | 'Warm' | 'Bold' | 'Luxury' | 'Playful';

export interface RoomInventoryItem {
  label: string;
  confidence: 'High' | 'Med' | 'Low';
  description?: string;
}

export interface ShotPlanItem {
  id: string;
  name: string;
  purpose: 'Clarity' | 'Luxury' | 'Amenity' | 'Texture' | 'Experience';
  description: string;
  instructions: string;
  included: boolean;
  confidence: 'High' | 'Med' | 'Low';
  previewUrl?: string;
}

export interface GeneratedImage {
  id: string;
  shotId: string;
  url: string;
  caption: string;
  altText: string;
  isVerified: boolean;
  variations: string[];
}

export interface AppState {
  step: 'upload' | 'analysis' | 'plan' | 'results' | 'export';
  heroImage: string | null;
  roomType: string;
  brandStyle: BrandStyle;
  strictness: number;
  inventory: RoomInventoryItem[];
  shotPlan: ShotPlanItem[];
  results: GeneratedImage[];
}
