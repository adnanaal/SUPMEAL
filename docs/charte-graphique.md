# Charte Graphique SUPMEAL

## 1. Identité Visuelle

### 1.1 Couleurs

**Couleurs Principales**
- **Primaire** : `#FF6B35` (Orange chaud - évoque la cuisine, l'appétit)
- **Secondaire** : `#2E7D32` (Vert - fraîcheur, ingrédients naturels)
- **Tertiaire** : `#1565C0` (Bleu - confiance, technologie)

**Couleurs Neutres**
- **Fond principal** : `#FFFFFF` (Blanc)
- **Fond secondaire** : `#F5F5F5` (Gris très clair)
- **Texte principal** : `#212121` (Gris très foncé)
- **Texte secondaire** : `#757575` (Gris moyen)
- **Bordures** : `#E0E0E0` (Gris clair)

**Couleurs Fonctionnelles**
- **Succès** : `#4CAF50`
- **Erreur** : `#F44336`
- **Avertissement** : `#FF9800`
- **Info** : `#2196F3`

### 1.2 Typographie

**Police Principale** : Inter (Google Fonts)
- **Titres** : Inter Bold (700)
- **Sous-titres** : Inter SemiBold (600)
- **Corps de texte** : Inter Regular (400)
- **Texte petit** : Inter Medium (500)

**Tailles**
- **H1** : 32px (2rem)
- **H2** : 24px (1.5rem)
- **H3** : 20px (1.25rem)
- **Body** : 16px (1rem)
- **Small** : 14px (0.875rem)
- **XSmall** : 12px (0.75rem)

### 1.3 Espacement

**Échelle d'espacement** (en pixels)
- **xs** : 4px
- **sm** : 8px
- **md** : 16px
- **lg** : 24px
- **xl** : 32px
- **2xl** : 48px
- **3xl** : 64px

### 1.4 Arrondis

- **Petit** : 4px (boutons, badges)
- **Moyen** : 8px (cards, inputs)
- **Grand** : 16px (modals, containers)
- **Plein** : 50% (cercles, avatars)

### 1.5 Ombres

- **Subtle** : `0 1px 2px rgba(0, 0, 0, 0.05)`
- **Light** : `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Medium** : `0 4px 6px rgba(0, 0, 0, 0.1)`
- **Strong** : `0 10px 15px rgba(0, 0, 0, 0.1)`

## 2. Composants UI

### 2.1 Boutons

**Bouton Primaire**
- Fond : `#FF6B35`
- Texte : Blanc
- Hover : `#E55A2B`
- Arrondi : 8px
- Padding : 12px 24px

**Bouton Secondaire**
- Fond : Transparent
- Bordure : 2px solid `#FF6B35`
- Texte : `#FF6B35`
- Hover : Fond `#FF6B35`, Texte blanc

**Bouton Tertiaire**
- Fond : `#F5F5F5`
- Texte : `#212121`
- Hover : `#E0E0E0`

### 2.2 Cards

- Fond : Blanc
- Bordure : 1px solid `#E0E0E0`
- Arrondi : 12px
- Ombre : Light
- Padding : 24px

### 2.3 Inputs

- Fond : Blanc
- Bordure : 1px solid `#E0E0E0`
- Arrondi : 8px
- Padding : 12px 16px
- Focus : Bordure `#FF6B35`
- Error : Bordure `#F44336`

### 2.4 Navigation

**Barre latérale (Sidebar)**
- Fond : `#FFFFFF`
- Largeur : 280px
- Bordure droite : 1px solid `#E0E0E0`
- Élément actif : Fond `#FFF3E0`, Texte `#FF6B35`

**Barre supérieure (Header)**
- Fond : Blanc
- Hauteur : 64px
- Bordure inférieure : 1px solid `#E0E0E0`

## 3. Icônes

- **Library** : Lucide Icons
- **Style** : Stroke, 24px par défaut
- **Couleur** : Héritée du texte ou `#757575`

## 4. Mise en page

### 4.1 Structure de page

```
┌─────────────────────────────────────────┐
│ Header (64px)                            │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │ Main Content                 │
│ (280px)  │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

### 4.2 Grid System

- **Colonnes** : 12
- **Gouttière** : 24px
- **Container max** : 1200px

### 4.3 Responsive

- **Mobile** : < 768px (Sidebar cachée, menu hamburger)
- **Tablet** : 768px - 1024px (Sidebar réduite)
- **Desktop** : > 1024px (Layout complet)

## 5. États et Interactions

### 5.1 Hover
- Transition : 0.2s ease
- Opacité : 0.8 pour les liens
- Transform : translateY(-2px) pour les cards

### 5.2 Focus
- Outline : 2px solid `#FF6B35`
- Outline offset : 2px

### 5.3 Loading
- Spinner : Couleur `#FF6B35`
- Skeleton : Fond `#F5F5F5` avec animation

### 5.4 Disabled
- Opacité : 0.5
- Cursor : not-allowed
