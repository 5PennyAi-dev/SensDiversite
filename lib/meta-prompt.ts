import { MetaPromptParams } from "@/types/image-generation";

const TEMPLATE = `Tu es un **directeur artistique** spécialisé en **quote-cards** haut de gamme.

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

## DIRECTION ARTISTIQUE (selon {{STYLE_FAMILY}}) + INSPIRATION CITATION

### 1) minimal_abstrait
- Concepts → **formes** : lignes, points, réseaux, cercles, chemins, fragments.
- “Lien/connexion” → constellations, lignes reliant des points, nœuds minimalistes.
- “Action/trace” → trait d’encre/pinceau, ligne imparfaite, texture légère.

### 2) photo_cinematique
- Scène sobre inspirée des mots-objets/gestes : table, fenêtre, route, ciel, escalier, main hors champ **sans visage**.
- Ajouter un **overlay** discret pour la lisibilité, lumière douce, profondeur de champ légère.

### 3) typographie_poster
- La typo devient un élément graphique : contrastes de poids, blocs, alignements, respiration.
- Ajouter un motif minimal inspiré (filet, points, flèche, cadre incomplet, ligne traversante).
- Emphase sur 1–3 mots clés via taille/poids (sans modifier le texte).

### 4) illustration_lineart
- Illustration très simple en **line art** (1–2 traits), style éditorial.
- Objets symboliques issus des mots (ex : main, fil, pont, porte, chemin, constellation) sans surcharge.
- Fond uni ou papier léger, accent discret.

### 5) collage_editorial
- Collage premium : textures papier, découpe nette, formes géométriques, petites superpositions.
- 1 symbole principal issu de la citation (objet/forme) + 2–3 formes secondaires maximum.
- Palette limitée (2 couleurs + 1 accent), rendu “magazine / affiche”.

### 6) art_digital_onirique
- Rendu 3D soft, gradients subtils, matières vitreuses ou diaphanes, lumière douce.
- Formes abstraites organiques ou géométriques flottantes.
- Ambiance rêveuse, couleurs pastel ou vibrantes mais douces, moderne et technologique.

### 7) papier_decoupe_layer
- Imitation papier découpé (paper cut) avec profondeur et ombres portées réalistes.
- Composition en strates : premier plan, plan moyen, arrière-plan.
- Couleurs unies par plan, jeu de lumière pour le relief.

### 8) risographie_retro
- Texture granuleuse type impression Riso, couleurs vibrantes superposées, légers décalages.
- Style graphique "lo-fi" mais contrôlé, trames visibles.
- Palette limitée (souvent rose fluo / bleu / jaune), aspect "zine d'art".

### 9) encre_zen
- Style Sumi-e minimaliste, coup de pinceau calligraphique expressif unique.
- Beaucoup d'espace vide (Ma), noir et blanc quasi exclusif (ou 1 accent rouge sceau).
- Évoque la nature, le mouvement, le silence, très texturé (papier washi).

### 10) architecture_brutaliste
- Béton brut, formes massives, géométrie rigoureuse, jeux d'ombre et lumière tranchés.
- Typographie intégrée à l'architecture ou flottant devant.
- Palette minérale (gris, beige, noir) + 1 accent vif (orange ou bleu électrique).

---

## TYPOGRAPHIE (selon {{TYPO_STYLE}})
- **sans_serif_modern** : net, contemporain, très lisible
- **serif_editorial** : élégant, littéraire
- **script_brush** : gestuel, lisible (en accent)
- **condensed_bold** : impact “affiche”

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

  prompt = prompt.replace(/{{ASPECT_RATIO}}/g, params.aspectRatio || "16:9");
  prompt = prompt.replace("{{CITATION}}", params.citation);
  prompt = prompt.replace("{{TITRE}}", params.titre ? `**Titre :** ${params.titre}` : "");
  prompt = prompt.replace("{{AUTEUR_LINE}}", params.auteur ? `**Auteur :** — ${params.auteur}` : "");
  prompt = prompt.replace("{{STYLE_FAMILY}}", params.style_family || "minimal_abstrait");
  prompt = prompt.replace("{{TYPO_STYLE}}", params.typo_style || "sans_serif_modern");

  return prompt;
}
