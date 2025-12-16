"use client";

import { useState, useEffect } from "react";
import { Loader2, Wand2, Image as ImageIcon, Shuffle, Save, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { MetaPromptParams, AspectRatio } from "@/types/image-generation";
import { constructMetaPrompt } from "@/lib/meta-prompt";
import { createAphorism, updateAphorism } from "@/lib/instant";
import { AphorismUpdate } from "@/types/aphorism";

// Constants from parametres_metaPrompt.txt
const PALETTE_OPTIONS = [
  { id: "A", name: "Charbon / Ivoire / Ocre", value: "Charbon / Ivoire / Ocre (#111318, #F2EFEA, #B08D57)" },
  { id: "B", name: "Bleu ardoise / Gris brume / Cuivre", value: "Bleu ardoise / Gris brume / Cuivre (#1F2A35, #E7E5E1, #A66A3F)" },
  { id: "C", name: "Vert forêt / Sable / Olive", value: "Vert forêt / Sable / Olive (#16231E, #EFE7DB, #6F7D4E)" },
  { id: "D", name: "Aubergine / Beige rosé / Brique sourde", value: "Aubergine / Beige rosé / Brique sourde (#241A24, #F0E6E1, #8D4A3C)" },
  { id: "E", name: "Graphite / Blanc cassé / Bleu pétrole", value: "Graphite / Blanc cassé / Bleu pétrole (#2A2C2F, #F4F1EC, #2E5D63)" },
  { id: "F", name: "Brun encre / Lin / Bronze", value: "Brun encre / Lin / Bronze (#1E1A17, #EEE6D8, #8C6A3D)" },
];

const ASPECT_RATIO_OPTIONS = [
  { id: "16:9", name: "16:9 (Paysage)", value: "16:9" },
  { id: "1:1", name: "1:1 (Carré)", value: "1:1" },
  { id: "4:3", name: "4:3 (Photo Paysage)", value: "4:3" },
  { id: "3:4", name: "3:4 (Photo Portrait)", value: "3:4" },
  { id: "9:16", name: "9:16 (Story)", value: "9:16" },
];

const BACKGROUND_OPTIONS = [
  { id: "solid", name: "Uni", value: "Uni (fond uni basé sur la couleur principale)" },
  { id: "paper_light", name: "Papier fin", value: "Papier fin (texture très légère)" },
  { id: "paper_vignette", name: "Papier + vignette", value: "Papier + vignette (coins plus sombres)" },
  { id: "micro_grain", name: "Micro-grain", value: "Micro-grain (grain film très discret)" },
];

const MODE_OPTIONS = [
  { id: "halo_clarity", name: "Halo / clarté", value: "Halo / clarté (subtle_halo, partial_arc)" },
  { id: "diffusion_particles", name: "Diffusion / particules", value: "Diffusion / particules (sparse_particles)" },
  { id: "matter_blocks", name: "Matière / blocs", value: "Matière / blocs (3_to_6_rectangles)" },
  { id: "waves_emission", name: "Ondes / émission", value: "Ondes / émission (concentric_waves)" },
  { id: "eclipse", name: "Éclipse", value: "Éclipse (large_partial_disc)" },
  { id: "editorial_grid", name: "Grille éditoriale", value: "Grille éditoriale (fine_grid_lines)" },
  { id: "ascension", name: "Ascension", value: "Ascension (diagonal_rising_lines)" },
  { id: "strata_layers", name: "Strates", value: "Strates (horizontal_thin_bands)" },
];

const ACCENT_OPTIONS = [
  { id: "highlight_block", name: "Surlignage rectangulaire", value: "Surlignage rectangulaire" },
  { id: "thick_underline", name: "Underline épais", value: "Underline épais" },
  { id: "author_banner", name: "Bandeau auteur", value: "Bandeau auteur" },
  { id: "accent_dot_block", name: "Pastille / bloc discret", value: "Pastille / bloc discret" },
  { id: "corner_partial_circle", name: "Cercle partiel coin", value: "Cercle partiel coin" },
];

const QUOTES_DECOR_OPTIONS = [
  { id: "off", name: "OFF (Pas de guillemets décoratifs)", value: "OFF" },
  { id: "on_subtle", name: "ON-subtil (Opacité 5-10%)", value: "ON-subtil" },
];

export function ImageGenerator() {
  // Helper to pick a random value from options
  const getRandomValue = (options: { value: string }[]) => {
    return options[Math.floor(Math.random() * options.length)].value;
  };

  const searchParams = useSearchParams();

  const [params, setParams] = useState<MetaPromptParams>({
    citation: "",
    titre: "",
    auteur: "Dourliac",
    source_ou_contexte: "",
    palette: getRandomValue(PALETTE_OPTIONS),
    fond: getRandomValue(BACKGROUND_OPTIONS),
    mode: getRandomValue(MODE_OPTIONS),
    accent: getRandomValue(ACCENT_OPTIONS),
    highlight_text: "",
    quotes_decor: getRandomValue(QUOTES_DECOR_OPTIONS),
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
          title: params.titre?.trim() || undefined
        } as AphorismUpdate);
      } else {
        // Combining Source into Text if present
        const fullText = params.source_ou_contexte 
          ? `${params.citation}\n\n(${params.source_ou_contexte})`
          : params.citation;

        await createAphorism({
          text: fullText,
          title: params.titre?.trim() || undefined,
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

  const randomizeParams = () => {
    setParams(prev => ({
      ...prev,
      palette: getRandomValue(PALETTE_OPTIONS),
      fond: getRandomValue(BACKGROUND_OPTIONS),
      mode: getRandomValue(MODE_OPTIONS),
      accent: getRandomValue(ACCENT_OPTIONS),
      quotes_decor: getRandomValue(QUOTES_DECOR_OPTIONS),
    }));
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

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Source (Optionnel)</label>
              <input
                type="text"
                value={params.source_ou_contexte || ""}
                onChange={(e) => setParams({ ...params, source_ou_contexte: e.target.value })}
                className="w-full p-3 border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
                placeholder="Ex: Pensées, Livre IV"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <h3 className="text-xl font-serif text-foreground">Paramètres Visuels</h3>
            <button
              onClick={randomizeParams}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              title="Aléatoire"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Aléatoire</span>
            </button>
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
              <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Palette</label>
              <select
                value={params.palette}
                onChange={(e) => setParams({ ...params, palette: e.target.value })}
                className="w-full p-3 border border-border rounded-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              >
                {PALETTE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Fond</label>
              <select
                value={params.fond}
                onChange={(e) => setParams({ ...params, fond: e.target.value })}
                className="w-full p-3 border border-border rounded-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              >
                {BACKGROUND_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Mode Abstrait</label>
              <select
                value={params.mode}
                onChange={(e) => setParams({ ...params, mode: e.target.value })}
                className="w-full p-3 border border-border rounded-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              >
                {MODE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Accent Graphique</label>
              <select
                value={params.accent}
                onChange={(e) => setParams({ ...params, accent: e.target.value })}
                className="w-full p-3 border border-border rounded-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              >
                {ACCENT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Guillemets Décoratifs</label>
             <select
                value={params.quotes_decor}
                onChange={(e) => setParams({ ...params, quotes_decor: e.target.value })}
                className="w-full p-3 border border-border rounded-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              >
                {QUOTES_DECOR_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.value}>{opt.name}</option>
                ))}
              </select>
          </div>

          <div>
            <label className="block text-sm font-medium font-serif mb-1 text-foreground/90">Texte à mettre en évidence (3-6 mots max) (Optionnel)</label>
            <input
              type="text"
              value={params.highlight_text}
              onChange={(e) => setParams({ ...params, highlight_text: e.target.value })}
              className="w-full p-3 border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              placeholder="Extrait EXACT de la citation"
            />
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
