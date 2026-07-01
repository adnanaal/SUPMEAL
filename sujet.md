1 - Contexte du projet
Afin de diversifier son offre de services numériques et de fournir des outils performants à ses employés et potentiels clients, la société "SUPMEAL Pro" vous mandate personnellement pour développer leur propre outil de gestion de recettes et de planification de repas nommé "SUPMEAL". Cet outil se veut une alternative complète et intuitive aux solutions existantes (Mealie, Tandoor Recipes, Paprika, etc.), souvent limitées ou payantes.

Vous devrez concevoir la charte graphique du projet, ainsi que l’application web.


2 - Description du projet
2.1 - Généralités
Le but principal de cette application est de permettre aux utilisateurs (employés ou clients de l'entreprise) de créer, importer, organiser et planifier des recettes de cuisine.

Chaque utilisateur possédera son propre compte et pourra gérer ses recettes personnelles. De plus, il aura la possibilité de créer des livres de recettes partagés (cookbooks), permettant à plusieurs membres de consulter, ajouter et organiser des recettes communes, ainsi que de planifier des repas ensemble.

Chaque membre d'un cookbook pourra ajouter des recettes, les catégoriser, générer des listes de courses, et éventuellement commenter des recettes, avec des permissions définies pour chaque action.


2.2 - Fonctionnalités de l'application à implémenter
2.2.1 - Connexion
Un utilisateur pourra se connecter à l'application via un compte créé spécifiquement ou en utilisant un service d’OAuth2 (Google, Microsoft, GitHub, etc.).

2.2.2 - Création et gestion d'un cookbook partagé
Tout utilisateur peut créer un cookbook et inviter d'autres membres à le rejoindre. Une page dédiée à ce cookbook sera alors créée. Elle comportera l’ensemble des recettes agrégées au sein du groupe, avec les différentes permissions visibles par utilisateur (créateur, éditeur, lecteur, commentateur).

Chaque cookbook doit avoir une barre de recherche qui lui est propre, permettant de rechercher les recettes en fonction de leur titre, ingrédients, tags, ou contenu.

2.2.3 - Gestion d'une recette
Tout utilisateur peut ajouter une recette (au sein d’un compte personnel ou d’un cookbook partagé). Chaque recette sera constituée des éléments suivants :

Titre : Nom de la recette.
Ingrédients : Liste structurée des ingrédients avec quantités.
Étapes : Instructions de préparation détaillées.
Temps de préparation : Temps total estimé.
Temps de cuisson : Durée de cuisson.
Portions : Nombre de personnes.
Catégories / Tags : Type de cuisine, régime, difficulté, etc.
Image : Photo de la recette (optionnel).
Source : Origine de la recette (URL ou création utilisateur).
Favoris : Possibilité de marquer une recette comme favorite.
Planification : Possibilité d'ajouter la recette à un planning de repas.
2.2.4 - Catégorisation et filtrage des recettes
Cet onglet permettra à l’utilisateur de visualiser et filtrer les recettes en fonctions de différents critères qui devront explicitement être précisés :

Filtrage par cookbook.
Filtrage par catégories / tags.
Filtrage par ingrédients.
Filtrage par temps de préparation/cuisson.
Filtrage par favoris.
Recherche plein texte au sein de toutes les recettes.
2.2.5 - Paramètres utilisateurs
Une gestion d’utilisateur standard est à prévoir : Changement de mot de passe, ajout d’OAuth2 (Google, Microsoft, GitHub, etc.), etc. En supplément, l’utilisateur pourra définir des préférences culinaires (ex: régime alimentaire, allergies, type de cuisine préféré, nombre de portions par défaut).

2.2.6 - Export
Afin d’anticiper la migration ou le partage de données, si un utilisateur le souhaite et malgré un avertissement, il devra pouvoir exporter l’ensemble de ses recettes et cookbooks dans un format interprétable (JSON, CSV ou format compatible Mealie).

L’ensemble des données comprises dans ce fichier seront en brut et donc lisibles.

2.2.7 - Import
Un utilisateur devra pouvoir importer, via un fichier interprétable (JSON, CSV ou format compatible Mealie), des listes de recettes et cookbooks. Il sera automatiquement attribué comme créateur de ces derniers.

2.2.8 - Messagerie instantanée et commentaires
Une zone de messagerie instantanée interne à un cookbook partagé devra permettre d'effectuer des discussions de groupe. De plus, il devra être possible de commenter spécifiquement chaque recette au sein de ces cookbooks partagés. Les différents membres pourront ainsi échanger des conseils de cuisine, modifications et suggestions.



2.3 - Déploiement
2.3.1 - Architecture
Votre application doit comporter trois briques distinctes :

un serveur, devant être une API REST ou GraphQL et devant implémenter l'ensemble des fonctionnalités précédemment énoncées,
un client web devant uniquement interagir avec le serveur,
une base de données (choix libre).
Aucune logique ne doit avoir lieu sur le client qui ne sert que d'interface et redirige les différentes requêtes vers le serveur.

2.3.2 - Containérisation
Le projet doit comporter un fichier docker-compose.yml à la racine du projet permettant de déployer au moins 3 services Docker distincts, respectivement pour le serveur, le client web et la base de données.

L'application doit pouvoir être lancée intégralement via docker compose et être fonctionnelle.



3 - Le rendu
Il se fera sous la forme d'une archive au format "zip" contenant le code source, les fichiers annexes (images, etc.), la documentation technique et le manuel utilisateur.

Un lien vers un dépôt Git du projet, contenant l'ensemble du projet devra être fourni. Le dépôt devra être privé durant la réalisation du projet et devra être passé en public dès le rendu sur Moodle.

Un dépôt vide, ou avec un historique de commits insuffisant ou non représentatif du travail effectué pourra entraîner une pénalité sur la note finale, voire l'ajournement du projet.

La documentation technique est à destination de professionnels du domaine et contiendra au moins les éléments suivants :

Informations et éléments à renseigner nécessaires au fonctionnement de l'application,
Guide de déploiement de l'application,
Justification du choix des langages et des librairies,
Diagrammes UML,
Schéma de la base de données,
Le manuel utilisateur explique comment se servir de la solution et présente les différentes fonctionnalités.

Aucun secret (clé d'API, mot de passe, etc.) ne doit être présent dans le rendu. Un secret présent en clair entraînera un malus de points sur la notation en fonction de la criticité de ce dernier.

Tout rendu effectué en retard ne pourra pas être pris en compte.

Ce projet est noté sur 500 points avec possibilité d'obtenir 50 points en bonus :

Documentations : 50 points
Documentation technique : 30 points
Manuel utilisateur : 20 points
Qualité de l’interface utilisateur : 10 points
Qualité de l'expérience utilisateur : 10 points
Déploiement : 50 points
Architecture et abstraction : 20 points
Containérisation : 30 points
Fonctionnalités : 190 points
Inscription et connexion : 30 points
Fonctionnalités générales : 160 points
Création d’un cookbook : 10 points
Gestion des recettes : 60 points
Titre : 5 points
Ingrédients : 10 points
Étapes : 10 points
Temps de cuisson et préparation : 10 points
Catégories / tags : 10 points
Image : 5 points
Favoris et planification : 10 points
Filtrage et recherche : 40 points
Messagerie et commentaires : 20 points
Export : 15 points
Import : 15 points
Qualité du code : 190 points
Structures de données adaptées
Optimisation des recherches (ingrédients, recettes)
Lisibilité et maintenance du code
Absence de duplication
Abstraction et modularité
Bonus : jusqu’à 50 points
Application de niveau professionnel (UX/UI avancée, performance, architecture robuste)
Déploiement public en production
Fonctionnalités avancées (ex: génération automatique de listes de courses, planification de menus hebdomadaires, suggestions intelligentes de recettes)
Malus : jusqu’à l’ajournement du projet
Secrets exposés dans le code source
Mots de passe non hashés