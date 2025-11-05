# EntityDetailModal - Guide d'utilisation

Le composant `EntityDetailModal` est un composant générique et réutilisable pour afficher les détails de n'importe quelle entité dans l'application.

## Utilisation de base

```jsx
import EntityDetailModal from '../../components/common/EntityDetailModal';
import { yourEntityConfig } from './configs/yourEntityConfig';

const YourDetailModal = ({ open, onClose, entity }) => {
  const config = {
    ...yourEntityConfig,
    title: typeof yourEntityConfig.title === 'function' 
      ? yourEntityConfig.title(entity) 
      : yourEntityConfig.title,
    subtitle: typeof yourEntityConfig.subtitle === 'function'
      ? yourEntityConfig.subtitle(entity)
      : yourEntityConfig.subtitle
  };

  return (
    <EntityDetailModal
      open={open}
      onClose={onClose}
      entity={entity}
      config={config}
    />
  );
};
```

## Structure de configuration

Une configuration doit suivre cette structure :

```javascript
export const yourEntityConfig = {
  // Titre du modal (string ou fonction)
  title: (entity) => entity.name || 'Details',
  
  // Sous-titre du modal (string ou fonction)
  subtitle: (entity) => `ID: ${entity.id || 'N/A'}`,
  
  // Icône à afficher dans l'avatar
  icon: <YourIcon />,
  
  // Sections à afficher
  sections: [
    {
      // Titre de la section (optionnel)
      title: 'Section Title',
      
      // Icône de la section (optionnel)
      icon: <SectionIcon />,
      
      // Description de la section (optionnel)
      description: 'Description text',
      
      // Champs à afficher dans cette section
      fields: [
        {
          // Label du champ
          label: 'Field Label',
          
          // Valeur : string (path), ou fonction
          value: 'fieldName', // ou (entity) => entity.fieldName
          
          // Type de champ (voir types disponibles ci-dessous)
          type: 'text',
          
          // Icône optionnelle
          icon: <FieldIcon />,
          
          // Taille dans la grille (xs={gridSize})
          gridSize: 6,
          
          // Options spécifiques selon le type
          multiline: true,  // pour type 'text'
          monospace: true   // pour type 'text'
        }
      ]
    }
  ]
};
```

## Types de champs disponibles

### `text`
Affiche du texte simple.

```javascript
{
  label: 'Description',
  value: 'description',
  type: 'text',
  multiline: true,  // optionnel : texte multi-lignes
  monospace: true   // optionnel : police monospace
}
```

### `number`
Affiche un nombre en grande taille.

```javascript
{
  label: 'Likes',
  value: 'likesCount',
  type: 'number',
  icon: <FavoriteIcon />
}
```

### `price`
Affiche un prix formaté avec le symbole $.

```javascript
{
  label: 'Price',
  value: 'price',
  type: 'price',
  icon: <MoneyIcon />
}
```

Supporte aussi les objets `priceRange` :
```javascript
{
  minPrice: 20,
  maxPrice: 200,
  valid: true
}
```

### `date`
Affiche une date formatée.

```javascript
{
  label: 'Created At',
  value: 'createdAt',
  type: 'date'
}
```

### `location`
Affiche des coordonnées de localisation.

```javascript
{
  label: 'Location',
  value: 'location',
  type: 'location',
  icon: <LocationIcon />
}
```

Supporte les objets :
```javascript
{
  latitude: 34.0139405,
  longitude: -6.8256177,
  valid: true
}
```

### `boolean`
Affiche un chip Yes/No.

```javascript
{
  label: 'Active',
  value: 'active',
  type: 'boolean'
}
```

### `chip`
Affiche un chip avec la valeur.

```javascript
{
  label: 'Status',
  value: 'status',
  type: 'chip'
}
```

### `images`
Affiche une galerie d'images.

```javascript
{
  label: '',
  value: 'imageUrls', // ou (entity) => entity.images.map(img => img.url)
  type: 'images'
}
```

Supporte :
- Tableau de strings (URLs)
- Tableau d'objets avec propriété `url`

### `tags`
Affiche une liste de tags en chips.

```javascript
{
  label: '',
  value: 'tags', // ou (entity) => entity.tags || []
  type: 'tags'
}
```

## Exemples de configurations

### Exemple : Activity

Voir `activityDetailConfig.js`

### Exemple : Hotel

Voir `hotelDetailConfig.js`

### Exemple : Stadium

Voir `stadiumDetailConfig.js`

### Exemple : ActivityUser

Voir `activityUserDetailConfig.js`

## Fonctions personnalisées pour `value`

Vous pouvez utiliser des fonctions pour extraire ou transformer des valeurs :

```javascript
{
  label: 'Full Name',
  value: (entity) => `${entity.firstName} ${entity.lastName}`,
  type: 'text'
}
```

```javascript
{
  label: 'Price Range',
  value: (entity) => entity.priceRange || entity._rawData?.priceRange,
  type: 'price'
}
```

```javascript
{
  label: 'Images',
  value: (entity) => {
    const images = entity.images || entity._rawData?.images || [];
    return images.map(img => img.url || img);
  },
  type: 'images'
}
```

## Bonnes pratiques

1. **Réutilisabilité** : Créez une configuration par type d'entité
2. **Organisation** : Regroupez les champs liés dans des sections
3. **Icônes** : Utilisez des icônes Material-UI cohérentes
4. **Labels** : Utilisez des labels clairs et descriptifs
5. **GridSize** : Utilisez 6 ou 12 pour un layout équilibré (6 = 2 colonnes, 12 = 1 colonne)

## Fichiers créés

- `EntityDetailModal.jsx` : Composant générique
- `EntityDetailModal.css` : Styles du composant
- `configs/activityDetailConfig.js` : Configuration pour Activity
- `configs/hotelDetailConfig.js` : Configuration pour Hotel
- `configs/stadiumDetailConfig.js` : Configuration pour Stadium
- `configs/activityUserDetailConfig.js` : Configuration pour ActivityUser


