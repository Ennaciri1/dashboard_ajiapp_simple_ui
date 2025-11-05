# 🏗️ Architecture Clean - Simple UI

## 📋 Vue d'ensemble

Ce projet a été restructuré selon les principes de la **Clean Architecture** et du **Domain-Driven Design** pour améliorer la maintenabilité, la testabilité et l'évolutivité.

## 🎯 Principes appliqués

### 1. **Séparation des responsabilités**
- **Core** : Logique métier pure
- **Infrastructure** : Accès aux données et services externes
- **zx** : Interface utilisateur et logique de présentation
- **Shared** : Code partagé entre les couches

### 2. **Inversion des dépendances**
- Les couches externes dépendent des couches internes
- Les interfaces définissent les contrats
- Les implémentations concrètes respectent ces contrats

### 3. **Testabilité**
- Logique métier isolée et testable
- Mocking facile grâce aux interfaces
- Séparation claire entre logique et présentation

## 📁 Nouvelle structure

```
src/
├── core/                          # 🎯 COUCHE MÉTIER
│   ├── entities/                  # Entités du domaine
│   │   ├── Hotel.js              # Entité Hotel avec logique métier
│   │   ├── TouristSpot.js        # Entité Site touristique
│   │   ├── City.js               # Entité Ville
│   │   └── index.js              # Exports
│   ├── usecases/                  # Cas d'usage (business rules)
│   │   ├── hotels/               # Cas d'usage pour les hôtels
│   │   │   ├── GetHotelsUseCase.js
│   │   │   ├── CreateHotelUseCase.js
│   │   │   ├── UpdateHotelUseCase.js
│   │   │   ├── DeleteHotelUseCase.js
│   │   │   └── index.js
│   │   └── touristSpots/         # Cas d'usage pour les sites
│   └── interfaces/               # Contrats et interfaces
│       └── repositories/         # Interfaces des repositories
│           ├── IHotelRepository.js
│           ├── ITouristSpotRepository.js
│           └── index.js
│
├── infrastructure/               # 🔧 COUCHE INFRASTRUCTURE
│   ├── api/                      # Services API
│   │   ├── httpClient.js         # Client HTTP configuré
│   │   ├── HotelRepository.js    # Implémentation repository hôtels
│   │   ├── TouristSpotRepository.js
│   │   └── index.js
│   └── storage/                  # Stockage local (localStorage, etc.)
│       └── authStorage.js
│
├── presentation/                 # 🎨 COUCHE PRÉSENTATION
│   ├── components/               # Composants React
│   │   ├── ui/                   # Composants UI purs (boutons, inputs...)
│   │   ├── forms/                # Composants de formulaires
│   │   └── layout/               # Composants de mise en page
│   ├── pages/                    # Pages de l'application
│   ├── hooks/                    # Hooks personnalisés
│   │   ├── useHotels.js          # Hook pour la gestion des hôtels
│   │   └── index.js
│   └── contexts/                 # Contextes React (déplacés ici)
│
├── shared/                       # 🤝 COUCHE PARTAGÉE
│   ├── constants/                # Constantes de l'application
│   ├── utils/                    # Fonctions utilitaires
│   ├── types/                    # Types et constantes TypeScript-like
│   │   ├── Hotel.js              # Types pour les hôtels
│   │   └── index.js
│   └── validators/               # Validateurs
│       ├── hotelValidator.js     # Validations pour les hôtels
│       └── index.js
│
└── app/                          # ⚙️ CONFIGURATION APP
    ├── App.jsx                   # Composant racine
    ├── App.css                   # Styles du composant racine
    ├── main.jsx                  # Point d'entrée
    └── router.jsx                # Configuration des routes
```

## 🔄 Flux de données

### 1. **Flux de lecture (Query)**
```
UI Component → Hook → UseCase → Repository → API
```

### 2. **Flux d'écriture (Command)**
```
UI Component → Hook → UseCase → Entity (validation) → Repository → API
```

### 3. **Gestion des erreurs**
```
API Error → Repository → UseCase → Hook → UI Component
```

## 🎯 Entités métier

### Hotel
```javascript
class Hotel {
  constructor(data) { /* ... */ }
  
  // Méthodes métier
  isActive()
  hasAmenity(amenity)
  updateRating(rating)
  validate()
  
  // Sérialisation
  toJSON()
  static fromJSON(data)
}
```

### Avantages des entités :
- **Validation intégrée** : Logique de validation dans l'entité
- **Méthodes métier** : Comportements spécifiques au domaine
- **Immutabilité** : Contrôle des modifications
- **Sérialisation** : Conversion facile pour l'API

## 🔧 Cas d'usage (Use Cases)

### Exemple : GetHotelsUseCase
```javascript
class GetHotelsUseCase {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository;
  }
  
  async execute({ filters, searchTerm, sortBy, sortOrder }) {
    // 1. Validation des paramètres
    // 2. Récupération des données
    // 3. Application de la logique métier
    // 4. Retour des résultats
  }
}
```

### Avantages des cas d'usage :
- **Logique métier centralisée** : Une seule source de vérité
- **Testabilité** : Tests unitaires faciles
- **Réutilisabilité** : Utilisable depuis différentes interfaces
- **Validation** : Contrôle des entrées et sorties

## 🔌 Repositories et Interfaces

### Interface IHotelRepository
```javascript
class IHotelRepository {
  async findAll(filters) { throw new Error('Must be implemented'); }
  async findById(id) { throw new Error('Must be implemented'); }
  async create(hotel) { throw new Error('Must be implemented'); }
  async update(id, hotel) { throw new Error('Must be implemented'); }
  async delete(id) { throw new Error('Must be implemented'); }
}
```

### Implémentation HotelRepository
```javascript
class HotelRepository extends IHotelRepository {
  async findAll(filters) {
    // Implémentation concrète avec httpClient
  }
}
```

### Avantages :
- **Découplage** : UI indépendante de l'implémentation
- **Testabilité** : Mock facile des repositories
- **Flexibilité** : Changement d'implémentation transparent

## 🎣 Hooks personnalisés

### useHotels
```javascript
const useHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Initialisation des use cases
  const getHotelsUseCase = new GetHotelsUseCase(hotelRepository);
  
  const loadHotels = async (params) => {
    setLoading(true);
    try {
      const result = await getHotelsUseCase.execute(params);
      setHotels(result.hotels);
    } catch (error) {
      // Gestion d'erreur
    } finally {
      setLoading(false);
    }
  };
  
  return { hotels, loading, loadHotels, createHotel, updateHotel, deleteHotel };
};
```

### Avantages :
- **Encapsulation** : Logique complexe cachée aux composants
- **Réutilisabilité** : Hook utilisable dans plusieurs composants
- **État partagé** : Gestion centralisée de l'état
- **Gestion d'erreurs** : Centralisation de la gestion des erreurs

## 🧪 Testabilité

### Tests unitaires des entités
```javascript
describe('Hotel Entity', () => {
  test('should validate hotel data', () => {
    const hotel = new Hotel({ name: 'Test Hotel', location: 'Paris' });
    const validation = hotel.validate();
    expect(validation.isValid).toBe(true);
  });
});
```

### Tests des cas d'usage
```javascript
describe('GetHotelsUseCase', () => {
  test('should return filtered hotels', async () => {
    const mockRepository = { findAll: jest.fn().mockResolvedValue([]) };
    const useCase = new GetHotelsUseCase(mockRepository);
    
    await useCase.execute({ filters: { status: 'active' } });
    
    expect(mockRepository.findAll).toHaveBeenCalledWith({ status: 'active' });
  });
});
```

## 🚀 Migration depuis l'ancienne structure

### Étapes de migration :
1. **✅ Création de la nouvelle structure** - Terminé
2. **🔄 Migration des composants** - En cours
3. **🔄 Mise à jour des imports** - En cours
4. **⏳ Tests et validation** - À faire
5. **⏳ Suppression de l'ancien code** - À faire

### Coexistence temporaire :
- Les deux structures coexistent temporairement
- Migration progressive composant par composant
- Tests de régression pour valider les changements

## 📚 Bonnes pratiques

### 1. **Entités**
- Toujours valider les données dans l'entité
- Méthodes métier dans l'entité, pas dans les composants
- Immutabilité des propriétés importantes

### 2. **Cas d'usage**
- Un cas d'usage = une action métier
- Validation des paramètres d'entrée
- Gestion des erreurs métier

### 3. **Repositories**
- Respecter strictement l'interface
- Gestion des erreurs techniques
- Transformation des données API vers entités

### 4. **Hooks**
- État local au hook, pas global
- Gestion des effets de bord (loading, errors)
- Méthodes d'action claires et simples

## 🎯 Prochaines étapes

1. **Migration complète des composants**
2. **Ajout des tests unitaires**
3. **Optimisation des performances**
4. **Documentation des composants**
5. **Suppression de l'ancien code**

Cette architecture garantit une base solide pour l'évolution future du projet ! 🚀
