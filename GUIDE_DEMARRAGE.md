# Guide de Démarrage Rapide - Quick Start Guide

## 🚀 Lancer le Projet - Running the Project

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```

### 3. Ouvrir le navigateur
```
http://localhost:5174
```

## 📱 Pages Disponibles - Available Pages

### 1. Dashboard (Tableau de bord)
- **Lien**: `/`
- **Description**: Affichage des statistiques système
- **Fonctionnalités**: Tableaux interactifs, recherche, filtrage

### 2. Features (Fonctionnalités)
- **Lien**: `/features`
- **Description**: Affichage des fonctionnalités de l'application
- **Fonctionnalités**: Catégorisation, priorités, état de développement

### 3. Tourist Spots (Lieux touristiques)
- **Lien**: `/services/tourist-spots`
- **Description**: Gestion des lieux touristiques
- **Fonctionnalités**: Tableau interactif, recherche avancée, filtrage

### 4. Form Spots (Formulaire des lieux)
- **Lien**: `/services/tourist-spots/formSpots`
- **Description**: Ajout/modification des lieux touristiques
- **Fonctionnalités**: Formulaire complet, validation des données

### 5. Paramètres
- **Lien**: `/paramètres`
- **Description**: Paramètres de l'application

### 6. Profil
- **Lien**: `/profil`
- **Description**: Profil utilisateur

## 🎨 Fonctionnalités Principales - Main Features

### 1. Basculement de Thème
- **Emplacement**: Barre d'application supérieure
- **Fonction**: Basculement entre thème clair et sombre
- **Sauvegarde**: La préférence est sauvegardée automatiquement

### 2. Recherche et Filtrage
- **Emplacement**: En haut de chaque page
- **Fonction**: Recherche dans les données et filtrage
- **Fonctionnalités**: Recherche avancée, filtres multiples

### 3. Tableaux Interactifs
- **Fonction**: Affichage des données dans des tableaux
- **Fonctionnalités**: Sélection multiple, tri, actions

### 4. Menus Contextuels
- **Fonction**: Actions rapides sur les éléments
- **Fonctionnalités**: Modifier, supprimer, voir

## 🛠️ Ajouter une Nouvelle Page - Adding a New Page

### 1. Créer le fichier
```jsx
// src/page/ma-page/MaPage.jsx
import React from 'react';
import { PageTemplate } from '../../shared';

const MaPage = () => {
  const columns = [
    {
      key: 'name',
      label: 'Nom',
      render: (item) => <Typography>{item.name}</Typography>
    }
  ];

  return (
    <PageTemplate
      title="Ma Page"
      data={data}
      columns={columns}
      searchFields={['name', 'description']}
    />
  );
};

export default MaPage;
```

### 2. Ajouter le lien
```jsx
// src/router.jsx
import MaPage from "./page/ma-page/MaPage";

// Dans les routes
<Route path="ma-page" element={<MaPage />} />
```

### 3. Ajouter au menu
```jsx
// src/components/Drawer/Drawer.jsx
// Ajouter un nouvel élément dans le menu
```

## 🎯 Personnaliser les Composants - Customizing Components

### 1. Personnaliser SearchFilters
```jsx
<SearchFilters
  searchPlaceholder="Placeholder de recherche personnalisé"
  addButtonText="Bouton d'ajout personnalisé"
  onAdd={handleAdd}
  filters={filtresPersonnalises}
/>
```

### 2. Personnaliser DataTable
```jsx
<DataTable
  data={data}
  columns={columns}
  showCheckbox={true}
  showActions={true}
  className="tableau-personnalise"
/>
```

### 3. Personnaliser ContextMenu
```jsx
<ContextMenu
  menuItems={[
    { icon: EditIcon, text: "Modifier", action: handleEdit },
    { icon: DeleteIcon, text: "Supprimer", action: handleDelete }
  ]}
/>
```

## 📊 Gestion des Données - Data Management

### 1. Utiliser useTableState
```jsx
const {
  data: donneesFiltrees,
  searchTerm,
  setSearchTerm,
  filters,
  handleFilterChange,
  selectedItems,
  handleSelectAll,
  handleSelectItem
} = useTableState(donneesInitiales, {
  searchFields: ['name', 'description'],
  filterConfigs: [
    {
      key: 'filtreStatut',
      field: 'status',
      label: 'Statut',
      allValue: 'TOUS',
      options: [
        { value: 'TOUS', label: 'Tous les statuts' },
        { value: 'Actif', label: 'Actif' }
      ]
    }
  ]
});
```

### 2. Formater les Données
```jsx
import { formatters } from '../../shared/utils';

// Dans une colonne de tableau
{
  key: 'date',
  label: 'Date',
  render: (item) => formatters.date(item.date)
}
```

## 🎨 Personnaliser les Styles - Customizing Styles

### 1. Variables CSS
```css
/* src/styles/global.css */
:root {
  --primary-color: #1976d2;
  --secondary-color: #dc004e;
  --background-default: #fafafa;
  --text-primary: #213547;
}
```

### 2. Styles Personnalisés
```css
/* Dans le fichier CSS de la page */
.ma-classe-personnalisee {
  background-color: var(--primary-color);
  color: white;
  padding: 16px;
  border-radius: 8px;
}
```

## 🔧 Dépannage - Troubleshooting

### 1. Erreur 404
- **Cause**: Fichier introuvable
- **Solution**: Vérifier le chemin du fichier

### 2. Erreur d'Import
- **Cause**: Import incorrect
- **Solution**: Vérifier le chemin d'import

### 3. Erreur de Style
- **Cause**: CSS manquant
- **Solution**: Vérifier l'import des styles

## 📚 Plus d'Informations - More Information

- **Documentation complète**: `EXPLICATION_PROJET.md`
- **Diagramme du projet**: `PROJECT_DIAGRAM.md`
- **Résumé du nettoyage**: `CLEANUP_SUMMARY.md`
- **Correction Router**: `ROUTER_FIX.md`
- **Correction FormSpots**: `FORMSPOTS_FIX.md`

## 🎉 Conclusion - Conclusion

Ce projet est prêt à être utilisé et développé ! Vous pouvez :

- ✅ **Utiliser les pages existantes** - Dashboard, Features, Tourist Spots
- ✅ **Ajouter de nouvelles pages** - En utilisant PageTemplate
- ✅ **Personnaliser les composants** - Selon vos besoins
- ✅ **Gérer les données** - En utilisant useTableState
- ✅ **Personnaliser les styles** - En utilisant les Variables CSS

Profitez du développement ! 🚀
