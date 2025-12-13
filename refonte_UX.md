# Plan d’implémentation détaillé — Refonte UI “Carnet d’auteur” (portfolio d’aphorismes)

## But
Transformer le look “noir et blanc” actuel en une esthétique **carnet d’auteur** :
- fond papier chaud, texte encre
- accent bordeaux discret
- typographie éditoriale pour les aphorismes
- thèmes présentés comme un index (cartes)
- aphorismes présentés comme des “pages” (cards)
- sans refactor massif : **changer le style + la structure de rendu**, pas la logique métier.

---

## Principes à respecter
1) **Minimal changes** : ne pas réécrire la data layer ni les routes.
2) **Composition** : créer 2–3 petits composants UI réutilisables (PaperCard, TagPill, Separator).
3) **Cohérence** : mêmes styles pour Home + pages filtrées.
4) **Lisibilité** : largeur max + interligne + contraste + focus visible.
5) **Progressive enhancement** : texture papier et animations légères, optionnelles.

---

## Livrables attendus
- Un **design system minimal** via CSS variables + classes utilitaires
- Home modernisée : hero + thèmes en tuiles + liste d’aphorismes en cards
- Pages “thème/filtre” cohérentes (mêmes cards, même header filtrage)
- États UI : hover, focus, selected tag/theme

---

## 1) Ajouter les tokens “Carnet d’auteur” (global)

### Modif 1.1 — CSS variables (palette)
**Fichier** : `styles/globals.css` (ou équivalent global)
**Action** : ajouter dans `:root` :

- `--paper: #F6F1EA;`
- `--paper-2: #FBF7F1;`
- `--ink: #1E1B18;`
- `--muted: #6C625A;`
- `--border: #E3DBD1;`
- `--accent: #6E1F2B;`
- `--accent-soft: #A04A55;`

### Modif 1.2 — Base de page
**Fichier** : `app/layout.tsx` + `globals.css`
**Actions** :
- appliquer au `body` :
  - `background: var(--paper)`
  - `color: var(--ink)`
- définir des styles typographiques de base :
  - `line-height` global ~ `1.5`
  - couleurs secondaires `var(--muted)`
- définir une classe utilitaire `.container-reading` ou utiliser Tailwind (`max-w-3xl` / `max-w-2xl`) pour la lecture

### Modif 1.3 — Texture papier (optionnelle)
**Fichier** : `globals.css`
**Action** :
- ajouter une pseudo-texture légère (via `background-image` avec un motif ou un svg/gradient subtil)
- opacité très faible (3–6%)
- activation via classe sur `body` (ex: `paper-texture`) pour pouvoir la désactiver facilement si besoin

---

## 2) Typographies (éditorial + UI)

### Modif 2.1 — Charger 2 polices
**Fichier** : `app/layout.tsx` (si Next.js) ou config globale
**Action** :
- Serif : `EB Garamond` (ou `Cormorant Garamond`)
- Sans : `Inter` (ou `Source Sans 3`)
- définir 2 variables CSS :
  - `--font-serif`
  - `--font-sans`

### Modif 2.2 — Appliquer aux zones
**Actions** :
- UI (nav, boutons, tags, labels) => `font-sans`
- Aphorismes, grands titres => `font-serif`
- Ajuster :
  - Aphorismes : `font-size` généreux + `line-height: 1.55`
  - Tags : `letter-spacing: 0.06em` + `text-transform: uppercase` (ou petites caps si dispo)

---

## 3) Créer 3 composants UI réutilisables

> IMPORTANT : Ces composants doivent être “styling-only” (pas de logique métier).

### Modif 3.1 — `PaperCard`
**Créer** : `components/ui/PaperCard.tsx`
**Spéc** :
- wrapper `<div>` avec :
  - fond `var(--paper-2)`
  - bordure 1px `var(--border)`
  - radius 16px–24px
  - padding 20–28px (desktop), 16–20px (mobile)
- hover :
  - légère ombre
  - translation Y -1px max
- props : `children`, `className`

### Modif 3.2 — `TagPill`
**Créer** : `components/ui/TagPill.tsx`
**Spéc** :
- rendu d’un tag (#MORALITÉ, etc.)
- style :
  - petite taille (12–13px)
  - uppercase + tracking léger
  - couleur par défaut `var(--muted)`
  - état actif : `color: var(--accent)` + underline fin
- props : `active?: boolean`, `onClick?`, `href?`, `children`

### Modif 3.3 — `SectionSeparator`
**Créer** : `components/ui/SectionSeparator.tsx`
**Spéc** :
- ligne fine `var(--border)` + petit point/losange centré
- utilisée entre “Explorer par thème” et “Collection”, etc.

---

## 4) Refonte Home (structure + styles)

### Modif 4.1 — Hero “préface”
**Fichier** : `app/page.tsx` (Home)
**Actions** :
- sous le titre principal, ajouter une phrase courte (1 ligne)
- style :
  - titre serif
  - sous-titre en muted, max-width, alignement centré
- réduire le “vide” vertical excessif : resserrer `padding-top/bottom`

### Modif 4.2 — Bloc “En vedette”
**Fichier** : `app/page.tsx`
**Actions** :
- ajouter une section “En vedette” juste sous le hero
- afficher 1 aphorisme (si un concept existe déjà : le premier, ou le plus récent, ou un champ `featured`)
- rendu dans `PaperCard` :
  - texte aphorisme (serif)
  - tags via `TagPill`
  - CTA discret : “Lire” (accent au hover)

### Modif 4.3 — Section thèmes “index cards”
**Fichier** : composant existant des thèmes (ex: `components/tags/TagCloud.tsx` ou équivalent)
**Actions** :
- remplacer l’affichage texte par une grille de tuiles :
  - desktop : 2x2 ou 1x4
  - mobile : 1 colonne
- contenu tuile :
  - nom du thème
  - compteur d’aphorismes (si dispo, sinon omit)
  - micro-description optionnelle (ex: “Fragments intimes”, “Éthique”, etc.)
- état sélectionné :
  - bordure accent ou underline accent
  - conserver l’accessibilité (aria-current / aria-selected)

---

## 5) Refonte liste d’aphorismes (cards “pages”)

### Modif 5.1 — Layout et lisibilité
**Fichier** : composant listant les aphorismes (Home + pages filtrées)
**Actions** :
- rendre chaque aphorisme dans un `PaperCard`
- limiter la largeur du texte (max-w)
- augmenter l’interligne
- ajouter une métadonnée discrète si possible :
  - “Fragment 024” ou date (format court)

### Modif 5.2 — Actions au hover (sans surcharge)
**Actions** :
- hover : afficher 2 actions alignées à droite ou sous le texte :
  - “Lire” (lien vers détail si existe)
  - “Copier” (si facile, sinon omit)
- garder invisible sur mobile (ou toujours visible mais discret)

---

## 6) Pages filtrées / thème : cohérence

### Modif 6.1 — Bandeau “Filtré par”
**Fichier** : page de thème (ex: `app/theme/[slug]/page.tsx` ou similaire)
**Actions** :
- ajouter en haut un petit bandeau :
  - `Filtré par : <Thème>` (accent sur le thème)
  - bouton “Réinitialiser” (retour vers Home / tous)
- réutiliser `TagPill` pour le thème actif

### Modif 6.2 — Réutiliser les mêmes cards
**Action** :
- s’assurer que la page thème utilise la même `PaperCard` et le même style de liste d’aphorismes que la Home

---

## 7) Navigation + Search (petites améliorations “carnet”)

### Modif 7.1 — Champ de recherche
**Fichier** : composant header/nav
**Actions** :
- style input :
  - fond `paper-2`
  - bordure `border`
  - focus ring accent
- placeholder plus “auteur” :
  - “Rechercher un mot, une idée, un thème…”

### Modif 7.2 — Liens (hover “édition”)
**Fichier** : `globals.css` ou classes
**Actions** :
- liens : underline qui apparaît au hover (au lieu de changement brutal)
- couleur lien = ink, hover = accent

---

## 8) Accessibilité et responsive

### Modif 8.1 — Focus visible
**Action** :
- tous les éléments interactifs (tags, liens, boutons, search) ont un focus clair (outline/ring accent)

### Modif 8.2 — Contraste
**Action** :
- vérifier que `muted` reste lisible sur `paper`
- éviter gris trop clair pour les tags

### Modif 8.3 — Breakpoints
**Action** :
- vérifier 375/768/1024 :
  - thèmes en colonne sur mobile
  - cards avec padding adapté
  - tailles typo réduites légèrement sur mobile

---

## 9) Validation & non-régression

### Modif 9.1 — Tests manuels
- Home : hero + vedette + thèmes + aphorismes
- Page thème : bandeau + liste
- Search : focus + saisie
- Hover/focus : cohérents

### Modif 9.2 — Build
- lancer scripts existants (lint/type-check/build) selon package.json

---

## Ordre d’exécution recommandé (phases)
### Phase A (impact immédiat, faible risque)
1) Tokens CSS + fond papier + couleurs
2) Typo
3) PaperCard + TagPill + Separator
4) Restyle home (sans changer la data)

### Phase B (structure + UX)
5) Thèmes en tuiles
6) Aphorismes en cards + hover actions
7) Pages thème cohérentes + bandeau

### Phase C (polish)
8) Texture papier optionnelle
9) Micro-interactions (underline, transitions)
10) A11y + responsive final pass

---

## Critères de réussite (Definition of Done)
- Le fond n’est plus blanc pur : “papier” visible mais discret
- Les tags et états actifs utilisent l’accent bordeaux (sans envahir)
- Les thèmes sont des tuiles “index” (lisibles et cliquables)
- Chaque aphorisme ressemble à une “page” (card) avec bonne lisibilité
- Focus visible partout + rendu propre sur mobile
