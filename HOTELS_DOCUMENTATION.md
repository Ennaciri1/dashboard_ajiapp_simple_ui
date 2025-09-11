# Documentation Hotels - Hotels Documentation

## 🏨 Vue d'ensemble - Overview

La page Hotels est une fonctionnalité complète de gestion d'hôtels avec formulaire d'ajout et tableau d'affichage, similaire à Tourist Spots mais spécialement conçue pour les hôtels.

## 🏗️ Structure - Structure

```
src/page/services/hotels/
├── components/
│   ├── FormHotel.jsx          # Formulaire d'ajout/modification
│   ├── FormHotel.css          # Styles du formulaire
│   ├── HotelsTable.jsx        # Tableau d'affichage
│   ├── SearchFilters.jsx      # Recherche et filtres
│   ├── ContextMenu.jsx        # Menu contextuel
│   └── index.js               # Exports
├── sampleData.js              # Données d'exemple
├── constants.js               # Constantes
├── utils.js                   # Fonctions utilitaires
├── Hotels.jsx                 # Page principale
└── Hotels.css                 # Styles de la page
```

## 📋 Formulaire Hotel - Hotel Form

### Champs du Formulaire
- **Hotel Name** (requis) - Nom de l'hôtel
- **Description** (requis) - Description détaillée
- **Booking Information** (requis) - Informations de réservation
- **Location** (requis) - Localisation
- **Coordinates** (optionnel) - Latitude et longitude
- **Price per Night** (requis) - Prix par nuit en $
- **Image URL** (optionnel) - URL de l'image
- **Amenities** (requis) - Équipements disponibles
- **Status** - Statut de l'hôtel

### Équipements Disponibles
```javascript
const HOTEL_AMENITIES = [
  "Pool", "Spa", "Restaurant", "Gym", "WiFi",
  "Business Center", "Airport Shuttle", "Mountain View",
  "Beach", "Water Sports", "Traditional", "Cultural Tours",
  "Breakfast", "Hiking"
];
```

### Validation
- Validation complète des champs requis
- Messages d'erreur clairs
- Aperçu de l'image en temps réel
- Formatage automatique des données

## 🔍 Recherche et Filtres - Search and Filters

### Recherche
- Recherche dans le nom, localisation, description et équipements
- Recherche insensible à la casse
- Recherche en temps réel

### Filtres
1. **Status** - Disponible, Complet, Maintenance
2. **Rating** - Haut (4.5+), Moyen (3.5-4.4), Bas (<3.5)
3. **Price Range** - Budget (0-100$), Mid-range (100-250$), Luxury (250$+)

## 📊 Tableau d'Affichage - Display Table

### Colonnes
- **Image** - Photo de l'hôtel
- **Name** - Nom de l'hôtel
- **Location** - Localisation avec icône
- **Description** - Description tronquée
- **Rating** - Note avec étoiles
- **Price/Night** - Prix par nuit
- **Status** - Statut avec badge coloré
- **Actions** - Menu contextuel

### Fonctionnalités
- Sélection multiple
- Tri par colonnes
- Actions contextuelles (Modifier, Supprimer, Voir)
- Design responsive

## 🎨 Design et Styles - Design and Styles

### Thème
- Support des thèmes clair et sombre
- Variables CSS personnalisées
- Design cohérent avec le reste de l'application

### Responsive
- Design adaptatif pour mobile, tablette et desktop
- Tableau responsive avec scroll horizontal
- Formulaire optimisé pour mobile

## 🚀 Utilisation - Usage

### Accès
- **URL**: `/services/hotels`
- **Menu**: Services > Hotels
- **Formulaire**: `/services/hotels/formHotel`

### Navigation
1. **Liste des hôtels** - Affichage principal
2. **Ajouter un hôtel** - Bouton "+ Add Hotel"
3. **Rechercher/Filtrer** - Barre de recherche et filtres
4. **Actions** - Menu contextuel sur chaque hôtel

## 📱 Fonctionnalités Mobiles - Mobile Features

### Formulaire Mobile
- Champs empilés verticalement
- Boutons pleine largeur
- Équipements en grille responsive

### Tableau Mobile
- Colonnes adaptatives
- Images réduites
- Scroll horizontal

## 🔧 Personnalisation - Customization

### Ajouter des Équipements
```javascript
// Dans constants.js
export const HOTEL_AMENITIES = [
  // ... équipements existants
  "New Amenity"
];
```

### Modifier les Filtres
```javascript
// Dans constants.js
export const PRICE_RANGES = {
  // ... plages existantes
  NEW_RANGE: 'New Range (custom)'
};
```

### Personnaliser les Styles
```css
/* Dans Hotels.css */
.custom-hotel-style {
  /* Styles personnalisés */
}
```

## 📊 Données d'Exemple - Sample Data

### Structure des Données
```javascript
{
  id: 1,
  name: "Hotel Name",
  description: "Description...",
  bookingInfo: "Booking info...",
  location: "City, Country",
  coordinates: { lat: 31.6295, lng: -7.9811 },
  pricePerNight: 250,
  image: "https://...",
  rating: 4.8,
  ratingCount: 324,
  amenities: ["Pool", "Spa", "Restaurant"],
  status: "Available"
}
```

## 🎯 Avantages - Benefits

### Pour les Utilisateurs
- Interface intuitive et facile à utiliser
- Recherche et filtrage puissants
- Formulaire complet et validé
- Design responsive

### Pour les Développeurs
- Code modulaire et réutilisable
- Composants bien structurés
- Styles organisés
- Documentation complète

## 🔄 Intégration - Integration

### Avec le Système Existant
- Utilise les mêmes composants de base (Material-UI)
- Suit la même architecture que Tourist Spots
- Intégré dans le système de routage
- Compatible avec le système de thèmes

### Extensibilité
- Facile d'ajouter de nouveaux champs
- Possibilité d'ajouter de nouvelles fonctionnalités
- Structure modulaire pour la maintenance

## 🎉 Conclusion - Conclusion

La page Hotels offre une solution complète pour la gestion d'hôtels avec :
- ✅ **Formulaire complet** - Tous les champs nécessaires
- ✅ **Recherche avancée** - Filtres multiples
- ✅ **Tableau interactif** - Affichage et actions
- ✅ **Design responsive** - Compatible tous appareils
- ✅ **Thèmes supportés** - Clair et sombre
- ✅ **Code maintenable** - Structure claire

La fonctionnalité est prête à être utilisée et peut être facilement étendue selon les besoins ! 🚀
