import { MetaPromptParams } from "@/types/image-generation";

const STYLE_DESCRIPTIONS: Record<string, string> = {
  "minimal_abstrait": `- Concepts → **formes** : lignes, points, réseaux, cercles, chemins, fragments.
- “Lien/connexion” → constellations, lignes reliant des points, nœuds minimalistes.
- “Action/trace” → trait d’encre/pinceau, ligne imparfaite, texture légère.`,
  "photo_cinematique": `- Scène sobre inspirée des mots-objets/gestes : table, fenêtre, route, ciel, escalier, main hors champ **sans visage**.
- Ajouter un **overlay** discret pour la lisibilité, lumière douce, profondeur de champ légère.`,
  "typographie_poster": `- La typo devient un élément graphique : contrastes de poids, blocs, alignements, respiration.
- Ajouter un motif minimal inspiré (filet, points, flèche, cadre incomplet, ligne traversante).
- Emphase sur 1–3 mots clés via taille/poids (sans modifier le texte).`,
  "illustration_lineart": `- Illustration très simple en **line art** (1–2 traits), style éditorial.
- Objets symboliques issus des mots (ex : main, fil, pont, porte, chemin, constellation) sans surcharge.
- Fond uni ou papier léger, accent discret.`,
  "noir_blanc_argentique": `- Photographie Noir & Blanc style argentique, grain visible, contrastes profonds (Hasselblad).
- Jeux de lumière et d'ombre (chiaroscuro) sur des objets simples ou textures.
- Ambiance intemporelle, dramatique, mélancolique ou contemplative.`,
  "bauhaus_suisse": `- Style Design Suisse / Bauhaus : grille stricte, formes géométriques pures (cercle, triangle, carré).
- Palette couleurs primaires (rouge, bleu, jaune) + noir/beige, mais dominée par l'espace négatif.
- Typographie et formes interagissent, composition asymétrique équilibrée.`,
  "aquarelle_lavis": `- Aquarelle minimaliste contemporaine, tache (lavis) unique ou fluide diffus.
- Couleurs douces et organiques, fusionnant avec le papier blanc texturé (grain papier visible).
- Évoque l'émotion, le rêve, la fluidité, sans être figuratif détaillé.`,
  "papier_decoupe_layer": `- Imitation papier découpé (paper cut) avec profondeur et ombres portées réalistes.
- Composition en strates : premier plan, plan moyen, arrière-plan.
- Couleurs unies par plan, jeu de lumière pour le relief.`,
  "risographie_retro": `- Texture granuleuse type impression Riso, couleurs vibrantes superposées, légers décalages.
- Style graphique "lo-fi" mais contrôlé, trames visibles.
- Palette limitée (souvent rose fluo / bleu / jaune), aspect "zine d'art".`,
  "encre_zen": `- Style Sumi-e minimaliste, coup de pinceau calligraphique expressif unique.
- Beaucoup d'espace vide (Ma), noir et blanc quasi exclusif (ou 1 accent rouge sceau).
- Évoque la nature, le mouvement, le silence, très texturé (papier washi).`,
  "brutalisme_prestige": `- Esthétique : Luxe brut et architectural. Contrastes de matériaux (béton poli, marbre veiné, acier brossé).
- Composition : Typographie massive et imposante, mise en page asymétrique radicale, angles saillants.
- Rendu : Textures minérales haute définition, éclairage froid de galerie d'art, sentiment de puissance et de stabilité.`,
  "degrade_ethere": `- Esthétique : Style "Aura" ou "Gradient" contemporain. Transitions de couleurs fluides et immatérielles.
- Lumière : Émanations lumineuses douces, absence de lignes dures, flou gaussien artistique.
- Mood : Méditatif, spirituel et psychologique. Évoque la clarté mentale, l'introspection et la sérénité.`,
  "botanique_vintage": `- Esthétique : Planches naturalistes du XIXe siècle. Illustration scientifique de flore ou de faune fine et détaillée.
- Support : Papier jauni, textures de parchemin, annotations discrètes en bordure.
- Technique : Gravure à l'eau-forte ou lithographie, couleurs sépia ou tons terreux désaturés. Évoque la sagesse ancienne et le temps long.`,
  "morphisme_de_verre": `- Esthétique : "Glassmorphism" haut de gamme. Panneaux de verre dépoli (frosted glass) flottant dans un espace 3D.
- Effets : Réfraction de la lumière, flou d'arrière-plan (background blur), reflets irisés subtils sur les arêtes.
- Rendu : Très moderne, technologique et pur. Parfait pour des aphorismes sur le futur, la clarté ou l'innovation.`,
  "gravure_classique": `- Esthétique : Style "Woodcut" ou gravure sur bois traditionnelle. Travail intense sur les hachures et les contre-tailles.
- Tracé : Noir et blanc radical, lignes de force marquées créant du volume par la répétition du trait.
- Mood : Historique, philosophique et artisanal. Donne une autorité immédiate et solennelle au texte.`,
  "minimaliste_illustratif": `- Esthétique : Illustration conceptuelle type "Graphic Pun". Un symbole central unique et intelligent qui fusionne un objet concret avec l'idée abstraite de la citation.
- Palette : Bichromie raffinée. Noir d'encre pur sur fond monochrome texturé (blanc cassé, papier vintage, gris silex ou bleu ardoise très désaturé).
- Composition : Symétrie axiale rigoureuse. L'illustration est isolée sur le tiers supérieur, le texte est centré en bas. Espace négatif omniprésent (respiration massive) pour créer un impact visuel immédiat.`,
  "flat_design_ludique": `- Esthétique : Design plat (Flat Vector) moderne et chaleureux. Utilisation d'illustrations figuratives simples, d'icônes stylisées et de personnages minimalistes qui racontent une histoire visuelle immédiate.
- Palette : Couleurs "Pop" vibrantes et saturées. Chaque carte utilise une couleur dominante forte pour son cadre extérieur (Rouge corail, Sarcelle, Ambre, Brun chocolat) contrastant avec un fond central clair (crème ou blanc).
- Composition : Structure "Boîte dans la boîte" avec une bordure colorée épaisse. La typographie est dynamique et variée : elle mélange plusieurs polices (Script, Slab, Sans-serif) au sein de la même citation pour mettre en emphase certains mots, souvent intégrée autour ou à l'intérieur de l'objet illustré.`
};

const TYPO_DESCRIPTIONS: Record<string, string> = {
  "sans_serif_modern": `- **sans_serif_modern** : Minimaliste, géométrique, haute lisibilité (ex: Inter, Helvetica).`,
  "serif_editorial": `- **serif_editorial** : Élégant, littéraire, traditionnel, sérieux (ex: Garamond, Caslon).`,
  "slab_serif_strong": `- **slab_serif_strong** : Épais, mécanique, impact fort, confiant (ex: Rockwell).`,
  "script_elegant": `- **script_elegant** : Fluide, sophistiqué, calligraphique, féminin (ex: scripts anglais).`,
  "condensed_bold": `- **condensed_bold** : Étroit, impact maximal, style affiche/titre (ex: Impact, Bebas).`,
  "monospace_typewriter": `- **monospace_typewriter** : Rétro, brut, esthétique "code" ou "manuscrit" (ex: Courier).`,
  "handwritten_organic": `- **handwritten_organic** : Humain, imparfait, texturé, personnel (ex: écriture main).`,
  "display_retro_70s": `- **display_retro_70s** : Courbes, chaleureux, vintage, expressif (ex: Cooper Black).`,
  "geometric_light": `- **geometric_light** : Fin, aérien, futuriste, précis (ex: Futura Light).`,
  "blackletter_gothic": `- **blackletter_gothic** : Historique, dense, complexe, autoritaire (ex: Fraktur).`,
  "libre_choix": `- **libre_choix** : Choisir la typographie la MIEUX ADAPTÉE au sujet et à l'émotion de la citation.`
};


const TEMPLATE = `Tu es un **directeur artistique et Typographe Senior** spécialisé en **quote-cards** haut de gamme.

**Objectif :** générer une quote-card au format **{{ASPECT_RATIO}}** où le texte et l'image fusionnent avec élégance. La priorité absolue est la lisibilité parfaite et la fidélité textuelle.

### TEXTE (à afficher tel quel, sans aucune modification)
{{TITRE}}
**Citation :** « {{CITATION}} »
{{AUTEUR_LINE}}

*[Note : Si un TITRE est fourni, choisir l'une des 2 options suivantes pour l'intégrer :]*
*1. **Style Magazine (Coin)** : Le placer en petit, majuscules, dans le **coin supérieur gauche** (comme une rubrique).*
*2. **Style Intégré** : L'insérer DANS les guillemets, en **GRAS** suivi d'un tiret long.*
   *(Exemple : « **TITRE** — La citation... »)*

### PARAMÈTRES
- **Format :** {{ASPECT_RATIO}}
- **Famille de style :** {{STYLE_FAMILY}}
- **Style typographique :** {{TYPO_STYLE}}

---

## ÉTAPE CRÉATIVE : EXTRAIRE DES “ANCRES VISUELLES” DE LA CITATION
À partir de la citation, déduire 3 éléments :

1) **Mots-concepts dominants** (2–4) : notions abstraites (ex : lien, temps, liberté, vérité, action, silence).  
2) **Mots-objets** (0–4) : noms communs concrets si présents (ex : main, ligne, points, pierre, mer, fenêtre).  
3) **Verbes/gestes** (1–3) : actions suggérées (ex : tracer, relier, marcher, construire, tomber).

Ensuite, choisir **une métaphore visuelle** :
- Si objets/gestes concrets → **scène simple** ou **objet symbolique**.
- Si très abstrait → visuel **métaphorique** (formes/motifs/typo expressive) basé sur les concepts.
- Éviter le littéral kitsch : rester sobre et élégant.

---

## DIRECTION ARTISTIQUE : {{STYLE_FAMILY}}
{{SELECTED_STYLE_DESCRIPTION}}

---

## TYPOGRAPHIE : {{TYPO_STYLE}}
{{SELECTED_TYPO_DESCRIPTION}}

---

## RÈGLES D'OR DE COMPOSITION (Standard Premium)
- **Espace Négatif :** Laisse respirer la composition. Le visuel ne doit jamais étouffer le texte. Utilise la règle des tiers pour placer la citation.
- **Profondeur & Lumière :** Utilise une faible profondeur de champ (bokeh) ou des jeux d'ombres pour créer du relief sans complexité inutile.
- **Hiérarchie Visuelle :** 1. La Citation (Point focal)
    2. Le Titre (Ancrage)
    3. L'Auteur (Signature discrète)
- **Contraste :** Assure un ratio de contraste élevé entre le texte et l'arrière-plan. Si l'image est complexe, utilise un "overlay" (voile) subtil et dégradé.

---

## FILTRE D'EXCLUSION (Négatif Prompt)
- **Zéro défaut textuel :** Pas de fautes d'orthographe, pas de mots fusionnés, pas de texte fantôme en arrière-plan.
- **Sobriété :** Pas de couleurs néons, pas d'effets 3D "cheap", pas d'illustrations de stock-photo génériques.
- **Sujets :** Aucun visage humain reconnaissable, aucune célébrité, aucun élément figuratif kitsch.

**Rendu attendu :** Une œuvre visuelle digne d'une revue d'art ou d'une campagne de marque de luxe, prête pour une publication immédiate.`;





const TEMPLATE_ORIGINAL = `Tu es un **directeur artistique et Typographe Senior** spécialisé en **quote-cards** haut de gamme.

**Objectif :** générer une quote-card au format **{{ASPECT_RATIO}}** qui affiche la citation **exactement** et propose un visuel premium **inspiré du texte**.

### TEXTE (à afficher tel quel, sans aucune modification)
{{TITRE}}
**Citation :** « {{CITATION}} »
{{AUTEUR_LINE}}

*[Note : Si un TITRE est fourni, choisir l'une des 2 options suivantes pour l'intégrer :]*
*1. **Style Magazine (Coin)** : Le placer en petit, majuscules, dans le **coin supérieur gauche** (comme une rubrique).*
*2. **Style Intégré** : L'insérer DANS les guillemets, en **GRAS** suivi d'un tiret long.*
   *(Exemple : « **TITRE** — La citation... »)*

### PARAMÈTRES
- **Format :** {{ASPECT_RATIO}}
- **Famille de style :** {{STYLE_FAMILY}}
- **Style typographique :** {{TYPO_STYLE}}

---

## ÉTAPE CRÉATIVE : EXTRAIRE DES “ANCRES VISUELLES” DE LA CITATION
À partir de la citation, déduire 3 éléments :

1) **Mots-concepts dominants** (2–4) : notions abstraites (ex : lien, temps, liberté, vérité, action, silence).  
2) **Mots-objets** (0–4) : noms communs concrets si présents (ex : main, ligne, points, pierre, mer, fenêtre).  
3) **Verbes/gestes** (1–3) : actions suggérées (ex : tracer, relier, marcher, construire, tomber).

Ensuite, choisir **une métaphore visuelle** :
- Si objets/gestes concrets → **scène simple** ou **objet symbolique**.
- Si très abstrait → visuel **métaphorique** (formes/motifs/typo expressive) basé sur les concepts.
- Éviter le littéral kitsch : rester sobre et élégant.

---

## DIRECTION ARTISTIQUE : {{STYLE_FAMILY}}
{{SELECTED_STYLE_DESCRIPTION}}

---

## TYPOGRAPHIE : {{TYPO_STYLE}}
{{SELECTED_TYPO_DESCRIPTION}}

---

## RÈGLES DE COMPOSITION (lisibilité premium)
- Citation parfaitement lisible, hiérarchie claire, marges généreuses (8–10%).
- **Signature auteur** : Discrète, plus petite, située en bas ou décalée (ex: "— Auteur").
- Contraste fort, overlay si nécessaire.
- Ajuster taille + interlignage si long.
- Arrière-plan calme derrière le texte.

---

## CONTRAINTES / NÉGATIF
- Aucun logo, watermark, signature, URL.
- Aucun visage détaillé, aucun portrait, aucune célébrité.
- Pas de glow agressif, pas de surcharge décorative.
- Aucun texte ajouté, aucune reformulation : afficher **exactement** la citation et l'auteur.

**Rendu final :** image premium, cohérente avec le sens, très lisible, prête à publier.`;

export function constructMetaPrompt(params: MetaPromptParams): string {
  let prompt = TEMPLATE;
  const styleFamily = params.style_family || "minimal_abstrait";
  const typoStyle = params.typo_style && params.typo_style.trim() ? params.typo_style : "libre_choix";

  // Add Scene Template if scene is provided
  if (params.scene && params.scene.trim()) {
      prompt += `
---
## INSTRUCTION SPÉCIFIQUE (SCÈNE / ÉLÉMENT VISUEL)
L'utilisateur DÉSIRE EXPLICITEMENT voir représenté :
"{{SCENE}}"

> **IMPORTANT :** Cette instruction est **prioritaire** sur les déductions automatiques.
> Adapte la composition et le style ({{STYLE_FAMILY}}) pour intégrer cette description de manière harmonieuse et esthétique.
`;
      prompt = prompt.replace("{{SCENE}}", params.scene.trim());
  }

  // Replace Basic Params
  prompt = prompt.replace(/{{ASPECT_RATIO}}/g, params.aspectRatio || "16:9");
  prompt = prompt.replace("{{CITATION}}", params.citation);
  prompt = prompt.replace("{{TITRE}}", params.titre ? `**Titre :** ${params.titre}` : "");
  prompt = prompt.replace("{{AUTEUR_LINE}}", params.auteur ? `**Auteur :** — ${params.auteur}` : "");
  prompt = prompt.replace(/{{STYLE_FAMILY}}/g, styleFamily);
  prompt = prompt.replace(/{{TYPO_STYLE}}/g, typoStyle);

  // Inject Dynamic Descriptions
  prompt = prompt.replace("{{SELECTED_STYLE_DESCRIPTION}}", STYLE_DESCRIPTIONS[styleFamily] || STYLE_DESCRIPTIONS["minimal_abstrait"]);
  prompt = prompt.replace("{{SELECTED_TYPO_DESCRIPTION}}", TYPO_DESCRIPTIONS[typoStyle] || TYPO_DESCRIPTIONS["libre_choix"]);

  return prompt;
}
