# Aphorismes Philosophiques - PRD MVP

## 🎯 Vision (100 mots max)

Un site web artistique qui présente une collection évolutive d'aphorismes et réflexions philosophiques. Les visiteurs découvrent immédiatement des créations visuelles (texte sur image), explorent par thèmes via un nuage de tags proportionnel, et naviguent dans une galerie infinie. L'auteur (admin unique) peut enrichir facilement la collection. L'objectif : créer une expérience esthétique exceptionnelle qui met en valeur la profondeur des réflexions tout en facilitant la découverte thématique.

**Utilisateur cible :** Lecteurs intéressés par la philosophie, la réflexion profonde, et l'art visuel.

---

## 🎬 Objectif MVP

**Critère de succès mesurable :**
Un visiteur découvre immédiatement 3-5 aphorismes visuels en page d'accueil, explore la collection via un nuage de tags dynamique, filtre par thème avec lazy loading, accède à une galerie visuelle, et l'admin peut ajouter du contenu (texte, tags, images) en moins de 2 minutes via une interface dédiée.

---

## 👥 User Stories MVP

### 1. Découverte Immédiate - Hero Section
**En tant que** visiteur  
**Je veux** voir 3-5 aphorismes visuels mis en avant dès mon arrivée  
**Pour** être immédiatement inspiré et comprendre la nature du site  

**Critères d'acceptation :**
- Aphorismes affichés comme images avec texte superposé (via ImageKit)
- Sélection aléatoire ou featured (configurable par admin)
- Design épuré et artistique avec transitions fluides
- Responsive (mobile-first)

---

### 2. Navigation par Thèmes - Nuage de Tags
**En tant que** visiteur  
**Je veux** voir un nuage de tags où la taille de chaque tag reflète le nombre d'aphorismes associés  
**Pour** identifier rapidement les thèmes principaux et leur importance  

**Critères d'acceptation :**
- Tags cliquables avec taille proportionnelle (font-size dynamique)
- Affichage trié par popularité ou alphabétique (toggle)
- Animation au hover
- Compte d'aphorismes visible au hover

---

### 3. Exploration Thématique - Filtrage & Lazy Loading
**En tant que** visiteur  
**Je veux** cliquer sur un thème et voir les aphorismes associés avec chargement progressif  
**Pour** explorer un sujet spécifique sans surcharge cognitive  

**Critères d'acceptation :**
- Affichage initial de 10 aphorismes par thème
- Lazy loading automatique au scroll (10 supplémentaires)
- Indicateur de chargement élégant
- Option "Retour à tous les thèmes"

---

### 4. Galerie Visuelle - Vue Artistique
**En tant que** visiteur  
**Je veux** accéder à une galerie visuelle montrant tous les aphorismes avec images  
**Pour** découvrir les créations artistiques dans un format immersif  

**Critères d'acceptation :**
- Layout masonry/grid responsive
- Lightbox au clic (affichage plein écran + texte complet + tags)
- Filtrage par thème possible depuis la galerie
- Transitions et animations soignées

---

### 5. Recherche par Mots-Clés - Discovery
**En tant que** visiteur  
**Je veux** effectuer une recherche textuelle dans tous les aphorismes  
**Pour** trouver une réflexion spécifique ou explorer un concept  

**Critères d'acceptation :**
- Recherche dans le texte des aphorismes ET les tags
- Résultats instantanés (debounced search)
- Highlight des termes recherchés
- Affichage du nombre de résultats

---

### 6. Ajout de Contenu - Interface Admin
**En tant qu'** auteur (admin unique)  
**Je veux** ajouter/éditer/supprimer un aphorisme avec texte, tags multiples, et image optionnelle  
**Pour** enrichir la collection sans toucher au code  

**Critères d'acceptation :**
- Interface admin protégée (InstantDB Auth - email/password)
- Formulaire simple : texte (textarea), tags (multi-select ou input), upload image (ImageKit)
- Preview avant publication
- CRUD complet (Create, Read, Update, Delete)
- Liste des aphorismes existants avec actions rapides (edit/delete)

---

## 🛠️ Stack Technique

### Frontend
- **Framework :** Next.js 14+ (App Router)
- **Styling :** Tailwind CSS + CSS Modules (pour animations custom)
- **UI Components :** shadcn/ui (optionnel - pour formulaires admin propres)
- **Animations :** Framer Motion (pour transitions élégantes)
- **Icons :** Lucide React

### Backend & Data
- **Database :** InstantDB (realtime, schemaless)
- **Auth :** InstantDB Auth (admin unique - email/password)
- **API Routes :** Next.js API routes (si nécessaire pour logique serveur)

### Images & Assets
- **CDN Images :** ImageKit.io (via API - clé fournie par client)
- **Optimisation :** Next.js Image component avec ImageKit loader

### Hosting & Deployment
- **Platform :** Vercel
- **CI/CD :** Automatique via GitHub integration
- **Domain :** TBD (fourni par client ou subdomain Vercel)

### Environment Variables
```env
NEXT_PUBLIC_INSTANT_APP_ID=xxx
INSTANT_ADMIN_TOKEN=xxx
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=xxx
IMAGEKIT_PRIVATE_KEY=xxx
IMAGEKIT_URL_ENDPOINT=xxx
```

---

## 🏗️ Architecture de Base

### Structure InstantDB Schema
```javascript
// aphorismes collection
{
  id: uuid,
  text: string,
  tags: array<string>,
  imageUrl: string (ImageKit URL) | null,
  featured: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}

// admin collection (auto-managed by InstantDB Auth)
{
  id: uuid,
  email: string,
  // InstantDB handles password hashing
}
```

### Pages & Routes
```
/                          → Home (hero + nuage de tags)
/theme/[slug]              → Aphorismes filtrés par thème
/galerie                   → Vue galerie visuelle
/search?q=term             → Résultats de recherche
/admin                     → Dashboard admin (protégé)
/admin/nouveau             → Formulaire ajout aphorisme
/admin/edit/[id]           → Formulaire édition
/api/upload-image          → Proxy ImageKit upload (sécurisé)
```

### Flow Utilisateur Principal
```
Visiteur arrive → Hero (3-5 aphorismes featured)
                ↓
         Nuage de tags (proportionnel)
                ↓
    Clic sur tag → Affichage 10 aphorismes
                ↓
         Scroll → Lazy load 10 de plus
                ↓
    Option galerie → Grid view avec lightbox
                ↓
         Recherche → Filtrage instant
```

### Flow Admin
```
Admin login → Dashboard (liste aphorismes)
            ↓
    Nouveau → Formulaire (texte + tags + image upload)
            ↓
      ImageKit API → URL retournée
            ↓
    InstantDB write → Aphorisme créé
            ↓
      Redirection → Dashboard avec succès message
```

---

## ✅ Critères de Succès MVP

- [ ] Page d'accueil charge en <2s avec 3-5 aphorismes featured
- [ ] Nuage de tags affiche correctement les proportions (min 5 tags testés)
- [ ] Filtrage par thème affiche 10 aphorismes puis lazy load fonctionne
- [ ] Galerie affiche toutes les images en masonry responsive
- [ ] Recherche retourne résultats en <500ms
- [ ] Admin peut ajouter un aphorisme complet en <2 minutes
- [ ] Site 100% responsive (mobile, tablet, desktop)
- [ ] Design jugé "visuellement exceptionnel" par le client
- [ ] Déployé sur Vercel avec domain custom

---

## 🚨 Hors Scope MVP

**Ne PAS implémenter dans v1.0 :**
- Commentaires des visiteurs
- Système de "likes" ou favoris
- Partage social (Twitter, Facebook)
- Mode sombre (peut être ajouté en v1.1)
- Multi-langues (uniquement français pour MVP)
- Analytics avancées (Google Analytics suffit)
- Newsletter / abonnements
- Export PDF des aphorismes
- API publique pour développeurs tiers
- Système de versioning des aphorismes
- Modération de contenu (admin unique, pas nécessaire)

**Peut être ajouté post-MVP :**
- Collections / séries d'aphorismes liés
- Timeline chronologique des publications
- Aphorisme du jour (random featured)
- Stats admin (vues, recherches populaires)

---

## ⚠️ Risques Identifiés

### 1. Performance avec Nombreuses Images
**Risque :** Si collection dépasse 100+ images, le lazy loading et la galerie pourraient ralentir.  
**Mitigation :**
- Utiliser Next.js Image avec ImageKit loader (optimisation auto)
- Pagination stricte (10-20 items par page)
- Virtualisation pour la galerie si nécessaire (react-window)

### 2. Qualité Visuelle / Esthétique
**Risque :** Atteindre "visuellement exceptionnel" est subjectif et peut nécessiter itérations.  
**Mitigation :**
- Designer 2-3 variations de layout dès le début
- Utiliser Framer Motion pour animations premium
- S'inspirer de sites de référence (ex: Typewolf, Awwwards)
- Feedback client à mi-parcours (après 1 semaine)

### 3. ImageKit API Limits
**Risque :** Dépassement de quotas gratuits si beaucoup d'uploads.  
**Mitigation :**
- Vérifier limites du plan ImageKit choisi
- Compresser images avant upload (client-side)
- Implémenter gestion d'erreurs API claire

---

## 📋 Checklist Démarrage Claude Code

### Phase 1 : Setup Projet (Jour 1)
- [ ] Initialiser Next.js 14 avec TypeScript + Tailwind
- [ ] Configurer InstantDB (schema + auth)
- [ ] Setup ImageKit SDK + environnement variables
- [ ] Créer structure dossiers (`/components`, `/app`, `/lib`, `/types`)
- [ ] Installer dépendances (Framer Motion, Lucide, shadcn/ui si besoin)

### Phase 2 : Database & Auth (Jour 1-2)
- [ ] Définir schema InstantDB (aphorismes collection)
- [ ] Configurer InstantDB Auth (admin unique)
- [ ] Créer utils InstantDB (`/lib/instant.ts`)
- [ ] Tester CRUD basique dans console

### Phase 3 : Pages Core (Jour 2-4)
- [ ] Page Home (`/app/page.tsx`)
  - Hero section avec aphorismes featured
  - Nuage de tags dynamique
- [ ] Page Thème (`/app/theme/[slug]/page.tsx`)
  - Filtrage par tag
  - Lazy loading implementation
- [ ] Page Galerie (`/app/galerie/page.tsx`)
  - Masonry grid
  - Lightbox component
- [ ] Recherche (`/app/search/page.tsx` ou composant global)

### Phase 4 : Interface Admin (Jour 5-7)
- [ ] Page login (`/app/admin/login/page.tsx`)
- [ ] Dashboard admin (`/app/admin/page.tsx`)
  - Liste aphorismes avec CRUD actions
- [ ] Formulaire ajout/édition (`/app/admin/nouveau/page.tsx`)
  - Upload image vers ImageKit
  - Multi-tags input
  - Preview
- [ ] API route upload sécurisé (`/app/api/upload-image/route.ts`)

### Phase 5 : Design & Animations (Jour 7-10)
- [ ] Implémenter design system (couleurs, typographie)
- [ ] Ajouter animations Framer Motion (transitions pages, hover states)
- [ ] Responsive breakpoints (mobile, tablet, desktop)
- [ ] Accessibilité (ARIA labels, keyboard navigation)

### Phase 6 : Optimisations & Tests (Jour 11-12)
- [ ] Optimiser images (ImageKit loader + Next.js Image)
- [ ] Tester performance (Lighthouse score >90)
- [ ] Tester responsive sur vrais devices
- [ ] Tester flows admin complets

### Phase 7 : Déploiement (Jour 13-14)
- [ ] Configurer Vercel project
- [ ] Setup environnement variables production
- [ ] Premier déploiement
- [ ] Tests production
- [ ] Configuration domain custom (si fourni)
- [ ] Setup Google Analytics (optionnel)

---

## 🎨 Considérations Design (Priorité #1)

### Principes Esthétiques
- **Minimalisme élégant :** Beaucoup d'espace blanc, focus sur le contenu
- **Typographie premium :** Utiliser fonts serif pour aphorismes (ex: Crimson Text, Lora) et sans-serif pour UI (ex: Inter)
- **Palette épurée :** 2-3 couleurs max + nuances de gris
- **Micro-interactions :** Hover states subtils, transitions fluides (300-500ms)
- **Hiérarchie visuelle claire :** Les aphorismes sont les stars

### Références Inspiration
- Medium.com (lecture immersive)
- Typewolf.com (typographie exceptionnelle)
- Dribbble "Philosophy" ou "Quotes" (layouts créatifs)

### Composants Clés à Soigner
1. **Hero Aphorisme Card :** Grande taille, image background ou overlay texte
2. **Nuage de Tags :** Animation subtile, espacement harmonieux
3. **Lightbox Galerie :** Fade in/out élégant, fermeture intuitive
4. **Formulaire Admin :** Clean et pro (shadcn/ui recommandé)

---

## 📚 Resources Techniques

### Documentation Essentielle
- [Next.js App Router](https://nextjs.org/docs/app)
- [InstantDB Docs](https://instantdb.com/docs)
- [ImageKit SDK](https://github.com/imagekit-developer/imagekit-nodejs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Exemples de Code Clés

#### InstantDB Setup (`/lib/instant.ts`)
```typescript
import { init } from '@instantdb/react';

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;

export const db = init({ appId: APP_ID });

// Query hook example
export function useAphorismes() {
  return db.useQuery({ aphorismes: {} });
}
```

#### ImageKit Upload API Route (`/app/api/upload-image/route.ts`)
```typescript
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: Request) {
  // Handle file upload securely
  // Return ImageKit URL
}
```

---

## 🔄 Workflow de Développement Recommandé

### Avec Claude Code
1. **Feature par Feature :** Développer et tester chaque user story séparément
2. **Commits atomiques :** Un commit par fonctionnalité complétée
3. **Preview branches :** Utiliser Vercel preview deployments pour validation client

### Commandes Exemple pour Claude Code
```bash
# Démarrer le projet
"Setup Next.js 14 with TypeScript, Tailwind, and InstantDB integration"

# Développer une feature
"Implement User Story #2: Tag cloud with proportional sizing"

# Itérer sur le design
"Improve hero section aesthetics: add subtle animations and better typography"
```

---

## 📝 Notes Importantes

### Décisions Techniques en Suspens
- [ ] Choix font families définitives (à valider avec client après maquette)
- [ ] Palette couleurs exacte (proposer 2-3 options semaine 1)
- [ ] Logo/branding du site (fourni par client ou généré ?)

### Questions à Clarifier Pendant le Dev
- Featured aphorismes : sélection manuelle par admin ou random ?
- Ordre d'affichage par défaut : chronologique inverse ou aléatoire ?
- Limite de tags par aphorisme (recommandation : 3-5 max)

---

## ✨ Definition of Done

**Un aphorisme est considéré "Done" quand :**
- Texte affiché correctement (typo, césure)
- Image chargée via ImageKit avec optimisation
- Tags associés cliquables et fonctionnels
- Responsive sur mobile/desktop
- Accessible (alt text, ARIA)

**Le MVP est considéré "Done" quand :**
- Tous les critères de succès ✅ sont validés
- Client confirme que le design est "visuellement exceptionnel"
- Déployé en production avec 0 erreur console
- Admin peut gérer le contenu de manière autonome
- Performance Lighthouse >85 (mobile) et >90 (desktop)

---

**Document vivant** : Ce PRD sera mis à jour selon les décisions prises pendant le développement. Toute feature non-essentielle découverte en cours de route sera ajoutée à "Hors Scope MVP" pour v1.1.

---

**Version :** 1.0  
**Date :** 11 décembre 2024  
**Auteur :** Christian (Product Manager)  
**Prêt pour :** Claude Code / Développement immédiat  
**Timeline :** 1-2 semaines  
**Budget lignes :** 487 lignes ✅ (sous la limite 500)
