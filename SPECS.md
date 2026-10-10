# 📋 Spécifications Fonctionnelles & Techniques — Gestion de Stock Imprimerie

## 🚀 1. Fonctionnalités Métiers

### 📦 Gestion des Produits

- **Fiche Produit Complète** : Création, modification, archivage et suppression (Soft Delete recommandé pour conserver l'historique).
- **Spécificités Imprimerie** : Prise en compte des attributs spécifiques (Grammage du papier, format A4/A3/Bobine, finition mat/brillant, types d'encres).
- **Catégorisation** : Classement strict par type (Papiers, Encres, Plaques, Consommables divers).

### 🔍 Suivi & Visibilité des Stocks

- **Consultation en Temps Réel** : Vue globale et filtrée des stocks disponibles.
- **Filtres Avancés** : Recherche instantanée par mot-clé, catégorie, ou état du stock.

### 🔄 Mouvements de Stock

- **Enregistrement des Flux** : Saisie obligatoire de chaque Entrée (livraison) et Sortie (production).
- **Gestion de la Gâche** : Motif spécifique pour déclarer le papier ou l'encre gaspillés lors du calage des machines (calcul précis des pertes).
- **Traçabilité** : Liaison systématique d'un mouvement à un utilisateur connecté et à une référence de commande client.

### 🚨 Alertes & Notifications

- **Seuils Critiques** : Définition d'un seuil minimal par produit.
- **Alertes Visuelles** : Notification instantanée à l'écran (badge UI dynamique) dès qu'un produit atteint ou passe sous son seuil de rupture.

### 📊 Reporting & Analyses

- **Tableaux de Bord** : Rapports de consommation automatiques (quotidiens, hebdomadaires, mensuels).
- **Indicateurs Clés (KPI)** : Valeur financière du stock, taux de gâche, produits les plus consommés.

### 👥 Gestion Multi-Utilisateurs

- **Contrôle d'Accès Propre (RBAC)** :
  - `ADMIN` : Accès total, gestion des utilisateurs, rapports financiers, modification des configurations et des seuils.
  - `GESTIONNAIRE` / `MAGASINIER` : Consultation, enregistrement des mouvements de stock, création de fiches produits.

---

## 🛠️ 2. Contraintes de Performance & UX

- **Fluidité & Réactivité** : Temps de réponse strictement inférieur à **2 secondes** par requête (Objectif de < 200ms sur l'API grâce au cache Next.js et à l'indexation PostgreSQL).
- **Interface Mobile-First (Responsive)** : Application 100% adaptée et utilisable sur les ordinateurs des bureaux, les tablettes de l'atelier et les smartphones des magasiniers en déplacement.
- **Indicateurs de Chargement** : Intégration systématique de composants `Skeleton` pour éviter les sauts d'écran pendant la récupération des données.

---

## 🛡️ 3. Sécurité Absolue & Protection Cyber (Anti-Hack)

Pour parer à toutes les menaces, l'application doit intégrer les barrières de sécurité suivantes dès sa conception :

- **Anti-Injection SQL (SQLi)** : Utilisation exclusive de requêtes paramétrées via l'ORM Prisma. Interdiction des requêtes brutes non nettoyées.
- **Anti-XSS (Cross-Site Scripting)** : Échappement automatique des données par Next.js (React) et stockage du jeton de session dans un cookie **HTTP-Only, Secure, et SameSite=Strict**.
- **Anti-CSRF (Cross-Site Request Forgery)** : Protection native de Next.js activée sur l'ensemble des requêtes de mutation (`POST`, `PUT`, `DELETE`).
- **Anti-Brute Force** : Mise en place d'un mécanisme de _Rate Limiting_ (limitation du nombre de requêtes) sur les routes d'authentification pour bloquer les attaques automatisées sur les mots de passe.
- **Anti-IDOR (Insecure Direct Object Reference)** : Validation systématique côté serveur des droits de l'utilisateur (`ADMIN` ou `GESTIONNAIRE`) avant d'autoriser l'affichage ou la modification d'une ressource, indépendamment de ce que demande le navigateur.
- **Validation Stricte des Entrées (Input Validation)** : Utilisation systématique de la bibliothèque **Zod** pour valider le type, la taille et le format de toutes les données entrantes dans l'API avant traitement. Le serveur doit rejeter immédiatement toute structure anormale.

---

## 🇪🇺 4. Conformité RGPD & Infrastructure

- **Chiffrement des Données** : Chiffrement obligatoire des flux via le protocole **SSL/TLS (HTTPS)** en production.
- **Protection des Mots de Passe** : Hachage irréversible des mots de passe en base de données avec l'algorithme **Argon2id** ou **BCrypt** à haut facteur de coût.
- **Sauvegarde Automatique** : Stratégie de sauvegarde quotidienne automatisée de la base de données PostgreSQL avec historique de rétention.
- **Rétention des Données Personnelles** : Seules les données minimales de connexion des employés sont stockées. L'historique des actions enregistre l'identifiant technique de l'utilisateur, évitant la duplication de données nominatives en texte clair dans les journaux d'audit.
