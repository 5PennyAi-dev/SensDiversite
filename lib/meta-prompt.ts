import { MetaPromptParams } from "@/types/image-generation";

const TEMPLATE = `Créer une quote card minimaliste et abstraite au format {{ASPECT_RATIO}} (aucun visage, aucune silhouette, aucun portrait, aucune statue).

TEXTE (exact, sans modification)
{{TITRE}}
« {{CITATION}} »
{{AUTEUR}}
{{SOURCE_OU_CONTEXTE}}

RÈGLES VISUELLES
- Style éditorial moderne, beaucoup d’espace négatif, très lisible.
- Couleurs non éclatantes : faible saturation, pas de néons, pas de glow intense.
- Palette limitée : 2 couleurs + 1 accent maximum.
- Fond : uni ou papier/grain très léger, sans décor complexe.

CHOIX CRÉATIFS
- Palette : {{PALETTE}}
- Fond : {{FOND}}
- Mode abstrait : {{MODE}}
- Accent graphique : {{ACCENT}}
- {{HIGHLIGHT_TEXT}}
- Guillemets décoratifs : {{QUOTES_DECOR}}

ABSTRACTION INSPIRÉE DU TEXTE (subtile, non littérale)
- Générer 1 à 3 formes abstraites maximum selon {{MODE}} (formes simples, géométriques, secondaires par rapport au texte).

MISE EN PAGE / TYPO
- Citation très grande, sans-serif moderne, bold, alignée à gauche.
- Mettre en évidence {{HIGHLIGHT_TEXT}} via {{ACCENT}}.
- Auteur petit, discret, en bas à droite.
- FORMAT AUTEUR : Afficher UNIQUEMENT le nom "{{AUTEUR}}", optionnellement précédé d'un tiret (ex: "- {{AUTEUR}}"). NE PAS écrire "Auteur :" ou "Author :".
- TITRE (si présent) : L'intégrer de façon élégante (ex: plus petit, Serif Italic ou Sans-Serif Spaced, en haut ou en bas), style distinct mais harmonieux.

INTERDITS
- Personnages, visages, statues, silhouettes, scènes réalistes, objets détaillés, logos, watermark, emojis, style cartoon.

SORTIE
- Rendu premium, net, haute résolution, composition sobre et équilibrée, marges de sécurité larges.`;

export function constructMetaPrompt(params: MetaPromptParams): string {
  let prompt = TEMPLATE;

  prompt = prompt.replace("{{ASPECT_RATIO}}", params.aspectRatio || "16:9");
  prompt = prompt.replace(
    "{{TITRE}}", 
    params.titre ? `TITRE (Optionnel) : "${params.titre}"` : ""
  );

  prompt = prompt.replace("{{CITATION}}", params.citation);
  prompt = prompt.replace("{{AUTEUR}}", params.auteur);
  prompt = prompt.replace(
    "{{SOURCE_OU_CONTEXTE}}",
    params.source_ou_contexte || "(sans source)"
  );
  prompt = prompt.replace("{{PALETTE}}", params.palette);
  prompt = prompt.replace("{{FOND}}", params.fond);
  prompt = prompt.replace("{{MODE}}", params.mode);
  prompt = prompt.replace("{{ACCENT}}", params.accent);
  prompt = prompt.replace(
    "{{HIGHLIGHT_TEXT}}", 
    params.highlight_text ? `Mots mis en évidence : ${params.highlight_text} (3–6 mots maximum, extrait EXACT de la citation)` : "Mots mis en évidence : AUCUN"
  );
  prompt = prompt.replace("{{QUOTES_DECOR}}", params.quotes_decor);
  
  if (!params.highlight_text) {
      // If no highlight text, remove the instruction to highlight it
      prompt = prompt.replace("- Mettre en évidence {{HIGHLIGHT_TEXT}} via {{ACCENT}}.", "");
      // Clean up the placeholder if it was used elsewhere (though the line above handles the main usage definition)
  } else {
      // Ensure the placeholder in the instructions is also replaced if it exists there
      prompt = prompt.replace("{{HIGHLIGHT_TEXT}}", params.highlight_text);
  }

  // Fallback cleanup if any placeholders remain (though type safety should prevent this)
  return prompt;
}
