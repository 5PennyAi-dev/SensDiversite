"use client";

import { ImageGenerator } from "@/components/admin/ImageGenerator";

export default function ImageGenerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Générateur d'Images</h1>
        <p className="text-muted-foreground mt-2">
          Créez des "quote cards" abstraites et minimalistes pour vos aphorismes via l'IA.
        </p>
      </div>

      <div className="bg-card p-8 rounded-sm border border-border/50 shadow-sm">
        <ImageGenerator />
      </div>
    </div>
  );
}
