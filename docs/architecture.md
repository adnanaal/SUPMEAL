# Architecture Technique SUPMEAL

## 1. Architecture Globale

### 1.1 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Web                           │
│                    (Next.js + React)                        │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Hooks   │  │  Utils   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              │
┌─────────────────────────────────────────────────────────────┐
│                      API REST Server                         │
│                   (Node.js + Express)                        │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Routes   │  │Controllers│  │ Services │  │ Middleware│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ PostgreSQL
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Base de Données                         │
│                        PostgreSQL                            │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │Cookbooks │  │ Recipes  │  │ Messages │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Stack Technique

**Frontend**
- Framework : Next.js 14 (App Router)
- Language : TypeScript
- UI : React + Tailwind CSS + shadcn/ui
- State Management : React Context + Zustand
- HTTP Client : Axios
- Forms : React Hook Form + Zod
- Icons : Lucide React

**Backend**
- Runtime : Node.js 20+
- Framework : Express.js
- Language : TypeScript
- ORM : Prisma
- Authentication : JWT + Passport.js
- OAuth2 : Passport Google/Microsoft/GitHub
- Validation : Zod
- File Upload : Multer
- API Documentation : Swagger/OpenAPI

**Base de Données**
- SGBD : PostgreSQL 15+
- Extensions : pg_trgm (recherche texte), uuid-ossp

**Infrastructure**
- Conteneurisation : Docker + docker-compose
- Reverse Proxy : Nginx (optionnel)
- Environment Variables : .env files

## 2. Architecture Backend

### 2.1 Structure des dossiers

```
backend/
├── src/
│   ├── config/           # Configuration (database, jwt, etc.)
│   ├── controllers/      # Logique des contrôleurs
│   ├── middleware/       # Middleware (auth, validation, etc.)
│   ├── models/           # Modèles Prisma
│   ├── routes/           # Définition des routes API
│   ├── services/         # Logique métier
│   ├── types/            # Types TypeScript
│   ├── utils/            # Utilitaires
│   └── app.ts            # Point d'entrée Express
├── prisma/
│   ├── schema.prisma     # Schéma de la base de données
│   └── migrations/       # Migrations
├── tests/                # Tests
├── package.json
└── tsconfig.json
```

### 2.2 Architecture en couches

**Couche Routes** : Définition des endpoints REST
- `/api/auth/*` - Authentification
- `/api/users/*` - Gestion utilisateurs
- `/api/cookbooks/*` - Cookbooks partagés
- `/api/recipes/*` - Recettes
- `/api/messages/*` - Messagerie
- `/api/comments/*` - Commentaires
- `/api/import-export/*` - Import/Export

**Couche Controllers** : Gestion des requêtes/réponses HTTP
- Validation des données
- Appel aux services
- Gestion des erreurs

**Couche Services** : Logique métier
- Opérations complexes
- Calculs
- Intégration avec l'ORM

**Couche Models** : Accès aux données (Prisma)

### 2.3 Middleware

- **Authentication** : Vérification JWT
- **Authorization** : Vérification permissions
- **Validation** : Validation des données avec Zod
- **Error Handling** : Gestion centralisée des erreurs
- **Rate Limiting** : Limitation des requêtes
- **Logging** : Journalisation des requêtes

## 3. Architecture Frontend

### 3.1 Structure des dossiers

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Routes authentification
│   │   ├── (dashboard)/  # Routes dashboard
│   │   ├── api/          # API routes (optionnel)
│   │   └── layout.tsx    # Layout principal
│   ├── components/       # Composants React
│   │   ├── ui/           # Composants shadcn/ui
│   │   ├── auth/         # Composants auth
│   │   ├── cookbook/     # Composants cookbook
│   │   ├── recipe/       # Composants recipe
│   │   └── shared/       # Composants partagés
│   ├── lib/              # Utilitaires
│   │   ├── api.ts        # Client API
│   │   ├── auth.ts       # Gestion auth
│   │   └── utils.ts      # Fonctions utilitaires
│   ├── hooks/            # Custom hooks
│   ├── stores/           # Zustand stores
│   ├── types/            # Types TypeScript
│   └── styles/           # Styles globaux
├── public/               # Assets statiques
├── package.json
└── tsconfig.json
```

### 3.2 Architecture des composants

**Pages** : Conteneurs de niveau route
- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/dashboard` - Dashboard principal
- `/cookbooks` - Liste des cookbooks
- `/cookbooks/[id]` - Détail cookbook
- `/recipes` - Liste des recettes
- `/recipes/[id]` - Détail recette
- `/recipes/new` - Création recette
- `/settings` - Paramètres utilisateur

**Composants** : Éléments UI réutilisables
- Boutons, inputs, cards, modals
- Formulaires
- Listes, tables
- Navigation

**Hooks** : Logique réutilisable
- `useAuth` - Gestion authentification
- `useCookbooks` - Gestion cookbooks
- `useRecipes` - Gestion recettes
- `useMessages` - Gestion messagerie

## 4. Schéma de la Base de Données

### 4.1 Diagramme Entité-Association

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │  Cookbook   │       │   Recipe    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ id (PK)     │◄──────│ id (PK)     │
│ email       │       │ name        │       │ title       │
│ password    │       │ description │       │ description │
│ name        │       │ created_by  │       │ ingredients │
│ avatar      │       │ created_at  │       │ steps       │
│ preferences │       └─────────────┘       │ prep_time   │
│ created_at  │              │              │ cook_time   │
└─────────────┘              │              │ portions    │
       │                     │              │ image       │
       │                     │              │ source      │
       │                     │              │ cookbook_id │
       │                     │              │ created_by  │
       │                     │              │ created_at  │
       │                     │              └─────────────┘
       │                     │                     │
       │                     │                     │
       │                     │              ┌─────────────┐
       │                     │              │  Tag        │
       │                     │              ├─────────────┤
       │                     │              │ id (PK)     │
       │                     │              │ name        │
       │                     │              └─────────────┘
       │                     │                     │
       │                     │                     │
       │                     │              ┌─────────────┐
       │                     │              │Recipe_Tag   │
       │                     │              ├─────────────┤
       │                     │              │ recipe_id   │
       │                     │              │ tag_id      │
       │                     │              └─────────────┘
       │                     │
       │                     │
       │              ┌─────────────┐
       │              │Cookbook_User│
       │              ├─────────────┤
       │              │ cookbook_id │
       │              │ user_id     │
       │              │ role        │
       │              └─────────────┘
       │
       │
┌─────────────┐
│  Message    │
├─────────────┤
│ id (PK)     │
│ content     │
│ cookbook_id │
│ user_id     │
│ created_at  │
└─────────────┘

┌─────────────┐
│  Comment    │
├─────────────┤
│ id (PK)     │
│ content     │
│ recipe_id   │
│ user_id     │
│ created_at  │
└─────────────┘
```

### 4.2 Tables Principales

**User**
- id: UUID (PK)
- email: VARCHAR(255) UNIQUE
- password: VARCHAR(255) (hashé)
- name: VARCHAR(255)
- avatar: VARCHAR(500) (URL)
- preferences: JSONB (régime, allergies, etc.)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

**Cookbook**
- id: UUID (PK)
- name: VARCHAR(255)
- description: TEXT
- created_by: UUID (FK → User)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

**Cookbook_User (Relation)**
- cookbook_id: UUID (FK → Cookbook)
- user_id: UUID (FK → User)
- role: ENUM (CREATOR, EDITOR, READER, COMMENTATOR)
- PK: (cookbook_id, user_id)

**Recipe**
- id: UUID (PK)
- title: VARCHAR(255)
- description: TEXT
- ingredients: JSONB (liste structurée)
- steps: JSONB (liste d'étapes)
- prep_time: INTEGER (minutes)
- cook_time: INTEGER (minutes)
- portions: INTEGER
- image: VARCHAR(500) (URL)
- source: VARCHAR(500)
- is_favorite: BOOLEAN (par utilisateur)
- cookbook_id: UUID (FK → Cookbook, nullable)
- created_by: UUID (FK → User)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

**Tag**
- id: UUID (PK)
- name: VARCHAR(100) UNIQUE

**Recipe_Tag (Relation)**
- recipe_id: UUID (FK → Recipe)
- tag_id: UUID (FK → Tag)
- PK: (recipe_id, tag_id)

**Message**
- id: UUID (PK)
- content: TEXT
- cookbook_id: UUID (FK → Cookbook)
- user_id: UUID (FK → User)
- created_at: TIMESTAMP

**Comment**
- id: UUID (PK)
- content: TEXT
- recipe_id: UUID (FK → Recipe)
- user_id: UUID (FK → User)
- created_at: TIMESTAMP

**Recipe_Favorite (Relation pour favoris par utilisateur)**
- recipe_id: UUID (FK → Recipe)
- user_id: UUID (FK → User)
- PK: (recipe_id, user_id)

**Recipe_Planning (Relation pour planification)**
- recipe_id: UUID (FK → Recipe)
- user_id: UUID (FK → User)
- planned_date: DATE
- PK: (recipe_id, user_id, planned_date)

## 5. API REST Design

### 5.1 Conventions

- Base URL : `/api`
- Format de réponse : JSON
- Codes HTTP standards : 200, 201, 400, 401, 403, 404, 500
- Pagination : `?page=1&limit=20`
- Tri : `?sort=field&order=asc`
- Filtres : `?filter[field]=value`

### 5.2 Endpoints Principaux

**Authentification**
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Rafraîchir token
- `GET /api/auth/google` - OAuth Google
- `GET /api/auth/microsoft` - OAuth Microsoft
- `GET /api/auth/github` - OAuth GitHub

**Utilisateurs**
- `GET /api/users/me` - Profil utilisateur
- `PUT /api/users/me` - Modifier profil
- `PUT /api/users/me/password` - Modifier mot de passe
- `PUT /api/users/me/preferences` - Modifier préférences

**Cookbooks**
- `GET /api/cookbooks` - Liste cookbooks
- `POST /api/cookbooks` - Créer cookbook
- `GET /api/cookbooks/:id` - Détail cookbook
- `PUT /api/cookbooks/:id` - Modifier cookbook
- `DELETE /api/cookbooks/:id` - Supprimer cookbook
- `POST /api/cookbooks/:id/members` - Inviter membre
- `PUT /api/cookbooks/:id/members/:userId` - Modifier rôle
- `DELETE /api/cookbooks/:id/members/:userId` - Retirer membre

**Recettes**
- `GET /api/recipes` - Liste recettes (avec filtres)
- `POST /api/recipes` - Créer recette
- `GET /api/recipes/:id` - Détail recette
- `PUT /api/recipes/:id` - Modifier recette
- `DELETE /api/recipes/:id` - Supprimer recette
- `POST /api/recipes/:id/favorite` - Ajouter favori
- `DELETE /api/recipes/:id/favorite` - Retirer favori
- `POST /api/recipes/:id/plan` - Planifier recette
- `DELETE /api/recipes/:id/plan` - Annuler planification

**Tags**
- `GET /api/tags` - Liste tags
- `POST /api/tags` - Créer tag

**Messages**
- `GET /api/cookbooks/:id/messages` - Messages cookbook
- `POST /api/cookbooks/:id/messages` - Envoyer message

**Commentaires**
- `GET /api/recipes/:id/comments` - Commentaires recette
- `POST /api/recipes/:id/comments` - Ajouter commentaire

**Import/Export**
- `GET /api/export` - Exporter données
- `POST /api/import` - Importer données

## 6. Sécurité

### 6.1 Authentification
- JWT (Access token + Refresh token)
- Access token : 15 minutes
- Refresh token : 7 jours
- Stockage : HttpOnly cookies

### 6.2 Autorisation
- RBAC (Role-Based Access Control)
- Rôles : CREATOR, EDITOR, READER, COMMENTATOR
- Vérification permissions par ressource

### 6.3 Validation
- Validation côté serveur avec Zod
- Sanitization des entrées
- Protection contre injection SQL (Prisma)

### 6.4 Autres
- Rate limiting
- CORS configuré
- HTTPS en production
- Secrets via environment variables

## 7. Performance

### 7.1 Base de données
- Index sur champs fréquemment recherchés
- Recherche plein texte avec pg_trgm
- Connection pooling

### 7.2 API
- Pagination systématique
- Caching avec Redis (optionnel)
- Compression gzip

### 7.3 Frontend
- Code splitting avec Next.js
- Lazy loading des images
- Optimisation des assets
