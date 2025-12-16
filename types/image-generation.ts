export type AspectRatio = "16:9" | "1:1" | "9:16" | "4:3" | "3:4";

export interface MetaPromptParams {
  citation: string;
  titre?: string;
  auteur: string;
  source_ou_contexte?: string;
  aspectRatio: AspectRatio;
  palette: string;
  fond: string;
  mode: string;
  accent: string;
  highlight_text: string;
  quotes_decor: string;
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
