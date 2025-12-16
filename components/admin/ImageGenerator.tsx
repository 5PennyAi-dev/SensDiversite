"use client";

import { useState, useEffect } from "react";
import { Loader2, Wand2, Image as ImageIcon, Save, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { MetaPromptParams, AspectRatio } from "@/types/image-generation";
import { constructMetaPrompt } from "@/lib/meta-prompt";
import { createAphorism, updateAphorism } from "@/lib/instant";
import { AphorismUpdate } from "@/types/aphorism";

const ASPECT_RATIO_OPTIONS = [
  { id: "16:9", name: "16:9 (Paysage)", value: "16:9" },
  { id: "1:1", name: "1:1 (Carré)", value: "1:1" },
  { id: "4:5", name: "4:5 (Portrait Court)", value: "4:5" },
  { id: "9:16", name: "9:16 (Story)", value: "9:16" },
];

const STYLE_FAMILY_OPTIONS = [
  { id: "minimal_abstrait", name: "Minimal Abstrait", value: "minimal_abstrait" },
  { id: "photo_cinematique", name: "Photo Cinématique", value: "photo_cinematique" },
  { id: "typographie_poster", name: "Typographie Poster", value: "typographie_poster" },
  { id: "illustration_lineart", name: "Illustration Line Art", value: "illustration_lineart" },
  { id: "collage_editorial", name: "Collage Éditorial", value: "collage_editorial" },
  { id: "art_digital_onirique", name: "Art Digital Onirique", value: "art_digital_onirique" },
  { id: "papier_decoupe_layer", name: "Papier Découpé (Layer)", value: "papier_decoupe_layer" },
  { id: "risographie_retro", name: "Risographie Rétro", value: "risographie_retro" },
  { id: "encre_zen", name: "Encre Zen (Sumi-e)", value: "encre_zen" },
  { id: "architecture_brutaliste", name: "Architecture Brutaliste", value: "architecture_brutaliste" },
];

const TYPO_STYLE_OPTIONS = [
  { id: "sans_serif_modern", name: "Sans Serif Modern", value: "sans_serif_modern" },
  { id: "serif_editorial", name: "Serif Editorial", value: "serif_editorial" },
  { id: "script_brush", name: "Script Brush", value: "script_brush" },
  { id: "condensed_bold", name: "Condensed Bold", value: "condensed_bold" },
];

export function ImageGenerator() {
  const searchParams = useSearchParams();

  const [params, setParams] = useState<MetaPromptParams>({
    citation: "",
    titre: "",
    auteur: "Dourliac",
    aspectRatio: "16:9",
    style_family: "minimal_abstrait",
    typo_style: "sans_serif_modern",
  });

  useEffect(() => {
    const citationQuery = searchParams.get("citation");
    const auteurQuery = searchParams.get("auteur");
    const titleQuery = searchParams.get("title");
    const idQuery = searchParams.get("id");

    if (citationQuery || auteurQuery || titleQuery) {
      setParams(prev => ({
        ...prev,
        citation: citationQuery || prev.citation,
        auteur: auteurQuery || prev.auteur,
        titre: titleQuery || prev.titre,
      }));
    }
    if (idQuery) {
      setAphorismId(idQuery);
    }
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aphorismId, setAphorismId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!params.citation || !params.auteur) {
      setError("Veuillez remplir la citation et l'auteur.");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setGeneratedImage(data.imageUrl);
      setSaveSuccess(false); // Reset save state on new generation
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedImage || !params.citation || !params.auteur) return;

    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      // 1. Convert Base64 to Blob
      const base64Response = await fetch(generatedImage);
      const blob = await base64Response.blob();
      const file = new File([blob], `generated-${Date.now()}.png`, { type: "image/png" });

      // 2. Upload Image
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Erreur lors de l'upload de l'image");
      }

      const { url } = await uploadRes.json();

      // 3. Create or Update Aphorism
      if (aphorismId) {
        await updateAphorism(aphorismId, { 
          imageUrl: url,
        } as AphorismUpdate);
      } else {
        await createAphorism({
          text: params.citation,
          tags: [], // No tags by default
          imageUrl: url,
          featured: false,
        });
      }

      setSaveSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement: " + (err instanceof Error ? err.message : "Inconnue"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Column */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-serif border-b border-border pb-2 mb-4 text-foreground">Texte</h3>
          
          <div>
            <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Titre (Optionnel)</label>
            <input
              type="text"
              value={params.titre || ""}
              onChange={(e) => setParams({ ...params, titre: e.target.value })}
              className="w-full p-3 border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              placeholder="Ex: La Nature..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Citation *</label>
            <textarea
              value={params.citation}
              onChange={(e) => setParams({ ...params, citation: e.target.value })}
              className="w-full p-3 border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans text-base min-h-[120px]"
              placeholder="Le texte de l'aphorisme..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Auteur *</label>
            <input
              type="text"
              value={params.auteur}
              onChange={(e) => setParams({ ...params, auteur: e.target.value })}
              className="w-full p-3 border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              placeholder="Ex: Marc Aurèle"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4 mt-8">
            <h3 className="text-xl font-serif text-foreground">Style & Rendu</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Format (Ratio)</label>
              <select
                value={params.aspectRatio}
                onChange={(e) => setParams({ ...params, aspectRatio: e.target.value as AspectRatio })}
                className="w-full p-3 border border-border rounded-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              >
                {ASPECT_RATIO_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Famille de Style</label>
              <select
                value={params.style_family}
                onChange={(e) => setParams({ ...params, style_family: e.target.value })}
                className="w-full p-3 border border-border rounded-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              >
                {STYLE_FAMILY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Style Typographique</label>
              <select
                value={params.typo_style}
                onChange={(e) => setParams({ ...params, typo_style: e.target.value })}
                className="w-full p-3 border border-border rounded-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              >
                {TYPO_STYLE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Génération en cours... (10-20s)
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Générer l'Image
            </>
          )}
        </button>

        {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-sm text-sm">
                {error}
            </div>
        )}
      </div>

      {/* Preview Column */}
      <div className="flex flex-col gap-4">
         <h3 className="text-lg font-serif border-b border-border pb-2">Aperçu</h3>
         
         <div className="aspect-video bg-muted/30 rounded-sm border border-border flex items-center justify-center relative overflow-hidden group">
            {generatedImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                    src={generatedImage} 
                    alt="Generated aphorism" 
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="text-center text-muted-foreground p-8">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>L'image générée apparaîtra ici</p>
                </div>
            )}
         </div>

         {generatedImage && (
             <button
               onClick={handleSave}
               disabled={saving || saveSuccess}
               className={`w-full py-3 px-4 rounded-sm flex items-center justify-center gap-2 transition-colors ${
                 saveSuccess 
                   ? "bg-green-600 text-white hover:bg-green-700" 
                   : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
               }`}
             >
               {saving ? (
                 <>
                   <Loader2 className="w-4 h-4 animate-spin" />
                   Enregistrement...
                 </>
               ) : saveSuccess ? (
                 <>
                   <Check className="w-4 h-4" />
                   Enregistré !
                 </>
               ) : (
                 <>
                   <Save className="w-4 h-4" />
                   Enregistrer l'image et l'aphorisme
                 </>
               )}
             </button>
         )}

         <div className="p-4 bg-card border border-border/50 rounded-sm text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap max-h-[300px]">
            <p className="font-bold mb-2">Debug Prompt:</p>
            {constructMetaPrompt(params)}
         </div>
      </div>
    </div>
  );
}
