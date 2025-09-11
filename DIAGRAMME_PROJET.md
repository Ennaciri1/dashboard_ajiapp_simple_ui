# Diagramme du Projet - Project Diagram

## 🏗️ Architecture Générale - Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Projet Simple UI                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   AppBar    │  │   Drawer    │  │ThemeToggle  │        │
│  │ (Barre sup) │  │ (Menu lat)  │  │(Basculement)│        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    Zone de Contenu Principal               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                Composants de Page                      ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     ││
│  │  │Dashboard│ │Features │ │Tourist  │ │Settings │     ││
│  │  │         │ │         │ │Spots    │ │         │     ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘     ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 📁 Structure des Fichiers - File Structure

```
src/
├── 📁 components/           # Composants spécifiques à l'application
│   ├── 📁 AppBar/          # Barre d'application supérieure
│   ├── 📁 Drawer/          # Menu latéral
│   └── 📁 ThemeToggle/     # Bouton de basculement de thème
│
├── 📁 contexts/            # Context API
│   └── 📄 ThemeContext.jsx # Gestion du thème
│
├── 📁 page/                # Pages de l'application
│   ├── 📁 dashboard/       # Tableau de bord
│   ├── 📁 features/        # Fonctionnalités
│   ├── 📁 Paramètres/      # Paramètres
│   ├── 📁 Profil/          # Profil utilisateur
│   └── 📁 services/        # Services
│       └── 📁 tourist-spots/ # Lieux touristiques
│
├── 📁 shared/              # Composants partagés
│   ├── 📁 components/      # Composants généraux
│   ├── 📁 utils/           # Fonctions utilitaires
│   ├── 📁 constants/       # Constantes
│   ├── 📁 hooks/           # Hooks partagés
│   ├── 📁 templates/       # Modèles de pages
│   └── 📁 styles/          # Styles partagés
│
├── 📁 styles/              # Styles généraux
│   └── 📄 global.css       # Styles globaux
│
├── 📄 App.jsx              # Composant principal
├── 📄 main.jsx             # Point d'entrée
└── 📄 router.jsx           # Gestion du routage
```

## 🔄 Flux de Données - Data Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───▶│   AppBar    │───▶│   Drawer    │
│ Interaction │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Router    │───▶│   Pages     │───▶│  Components │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  ThemeContext│   │  useTableState│   │  Shared     │
│             │    │             │    │  Components │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🎨 Système de Thèmes - Theme System

```
┌─────────────────────────────────────────────────────────────┐
│                    Système de Thèmes                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐                    ┌─────────────┐        │
│  │ Thème Clair │                    │ Thème Sombre│        │
│  │             │                    │             │        │
│  │ • Blanc     │                    │ • Gris Foncé│        │
│  │ • Bleu      │                    │ • Bleu Clair│        │
│  │ • Clair     │                    │ • Sombre    │        │
│  └─────────────┘                    └─────────────┘        │
│           │                                    │           │
│           └────────── ThemeToggle ─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Système de Tableaux - Table System

```
┌─────────────────────────────────────────────────────────────┐
│                    Système de Tableaux                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │SearchFilters│  │  DataTable  │  │ContextMenu  │        │
│  │             │  │             │  │             │        │
│  │ • Recherche │  │ • Lignes    │  │ • Modifier  │        │
│  │ • Filtres   │  │ • Colonnes  │  │ • Supprimer │        │
│  │ • Bouton +  │  │ • Sélection │  │ • Voir      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Utilisation des Composants - Component Usage

### 1. PageTemplate (Modèle de Page)
```jsx
┌─────────────────────────────────────────────────────────────┐
│                    PageTemplate                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Titre     │  │SearchFilters│  │  DataTable  │        │
│  │ Sous-titre  │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Compteur Rés.│  │             │  │ContextMenu  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 2. useTableState (Hook de Gestion d'État)
```jsx
┌─────────────────────────────────────────────────────────────┐
│                  Hook useTableState                        │
├─────────────────────────────────────────────────────────────┤
│  Entrée:                                                    │
│  • data: []                                                 │
│  • searchFields: []                                         │
│  • filterConfigs: []                                        │
│  • defaultFilters: {}                                       │
│                                                             │
│  Sortie:                                                    │
│  • filteredData: []                                         │
│  • searchTerm: string                                       │
│  • filters: {}                                              │
│  • selectedItems: []                                        │
│  • handlers: {}                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Cycle de Vie du Composant - Component Lifecycle

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Mount     │───▶│   Update    │───▶│  Unmount    │
│             │    │             │    │             │
│ • useState  │    │ • useEffect │    │ • Cleanup   │
│ • useEffect │    │ • Re-render │    │ • Memory    │
│ • Render    │    │ • State     │    │   Free      │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 📱 Design Responsive - Responsive Design

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Desktop   │  │   Tablet    │  │   Mobile    │
│             │  │             │  │             │
│ • Layout    │  │ • Layout    │  │ • Layout    │
│   Complet   │  │   Moyen     │  │   Compact   │
│ • Sidebar   │  │ • Sidebar   │  │ • Sidebar   │
│   Visible   │  │   Replié    │  │   Caché     │
│ • Grands    │  │ • Moyens    │  │ • Petits    │
│   Tableaux  │  │   Tableaux  │  │   Tableaux  │
└─────────────┘  └─────────────┘  └─────────────┘
```

## 🎉 Résumé - Summary

Ce projet suit une architecture moderne et organisée :

- **🏗️ Structure claire** - Organisation logique des fichiers
- **🔄 Composants réutilisables** - Réduction de la duplication
- **🎨 Design responsive** - Fonctionne sur tous les appareils
- **🌙 Support des thèmes** - Thème clair et sombre
- **📊 Gestion de données avancée** - Tableaux, recherche et filtrage
- **🛠️ Maintenance facile** - Code organisé et documenté

Le projet est prêt à être utilisé et développé ! 🚀
