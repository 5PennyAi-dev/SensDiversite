# Plan d'optimisation - Page d'Accueil

## Objectifs
1.  **Réduire l'espace vide** : Diminuer le padding du Hero et l'espacement entre les sections pour faire remonter le contenu.
2.  **Mettre en avant les aphorismes** : Remplacer l'affichage statique par un **Carrousel** dynamique.

## Modifications proposées

### 1. HeroSection.tsx
- Réduire le padding vertical (`py-20` -> `py-8` ou `py-10`).
- Rapprocher le sous-titre du titre.

### 2. Nouveau composant : `components/home/HomeCarousel.tsx`
- **Fonctionnalité** :
    - Récupérer les aphorismes.
    - En sélectionner 5 aléatoires au chargement.
    - Afficher un aphorisme à la fois avec une transition douce (Framer Motion).
    - Auto-play (5-10 secondes) et navigation manuelle (flèches/dots).
- **Design** :
    - Utiliser `PaperCard`.
    - Typographie "En vedette" mais dynamique.

### 3. app/page.tsx
- Remplacer `FeaturedAphorism` par `HomeCarousel`.
- Ajuster les `SectionSeparator` et les marges pour densifier la page.

## Tâches
- [ ] Modifier `HeroSection.tsx` (Padding).
- [ ] Créer `HomeCarousel.tsx`.
- [ ] Intégrer dans `page.tsx`.
