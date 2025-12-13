# Plan d'implémentation - Refonte UI/UX

## Phase A : Fondations & Style (Impact immédiat)
- [x] **1. Tokens & Global Styles**
    - [x] Définir les variables CSS (couleurs papier, encre, accent) dans `app/globals.css`.
    - [x] Appliquer les styles de base au `body` (`layout.tsx` / `globals.css`).
- [x] **2. Typographie**
    - [x] Configurer les polices (Serif: Garamond, Sans: Inter) dans `app/layout.tsx`.
    - [x] Appliquer les familles de polices aux variables CSS.
- [x] **3. Composants UI de base**
    - [x] Créer `components/ui/PaperCard.tsx`.
    - [x] Créer `components/ui/TagPill.tsx`.
    - [x] Créer `components/ui/SectionSeparator.tsx`.

## Phase B : Structure & Pages
- [x] **4. Refonte Home (Page d'accueil)**
    - [x] Modifier `components/common/HeroSection.tsx` (Préface, sous-titre).
    - [x] Ajouter la section "En vedette" dans `app/page.tsx`.
    - [x] Mettre à jour la grille de thèmes dans `components/tags/TagCloud.tsx` (ou nouveau composant).
- [x] **5. Liste des Aphorismes**
    - [x] Mettre à jour `components/aphorism/AphorismList.tsx` pour utiliser `PaperCard`.
    - [x] Styliser les cartes d'aphorismes (typo, espacement, actions au hover).
- [x] **6. Pages Thèmes**
    - [x] Mettre à jour `app/theme/[slug]/page.tsx` avec le bandeau "Filtré par".
    - [x] S'assurer de la réutilisation des composants (`PaperCard`, `TagPill`).

## Phase C : Polish & Détails
- [x] **7. Navigation & Recherche**
    - [x] Styliser la barre de recherche dans `components/common/NavBar.tsx`.
    - [x] Améliorer les interactions des liens (hover).
- [x] **8. Accessibilité & Responsive**
    - [x] Vérifier et ajuster les contrastes et les focus states.
    - [x] Vérifier le rendu sur mobile et tablette.
- [ ] **9. Texture Papier (Optionnel)**
    - [ ] Ajouter la texture légère via CSS.
