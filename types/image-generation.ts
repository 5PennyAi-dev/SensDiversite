export type AspectRatio = "16:9" | "1:1" | "9:16" | "4:3" | "3:4";

export interface MetaPromptParams {
  citation: string;
  titre?: string;
  scene?: string; // New optional parameter
  auteur: string;
  aspectRatio: AspectRatio;
  style_family: string;
  typo_style: string;
}

export type PaletteOption = {
  id: string;
  name: string;
  base: string[];
  accent: string;
};

export type BackgroundOption = {
  id: string;
  name: string;
  description: string;
};

export type ModeOption = {
  id: string;
  name: string;
  shape_guidance: string[];
};

export type AccentOption = {
  id: string;
  name: string;
  applies_to: string;
};

export type QuotesDecorOption = {
  id: string;
  name: string;
  opacity_range: number[] | null;
};
