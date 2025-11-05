# ✅ Service Languages - Création Complète

## 📋 Résumé

Un nouveau service complet pour la gestion des langues a été créé en suivant le pattern Clean Architecture utilisé dans le projet.

## 📁 Fichiers Créés

### 1. Entité Domain
- ✅ `src/core/entities/Language.js` - Entité Language avec validation et méthodes métier

### 2. Interface Repository
- ✅ `src/core/interfaces/repositories/ILanguageRepository.js` - Interface définissant les contrats du repository

### 3. Repository Implementation
- ✅ `src/infrastructure/api/LanguageRepository.js` - Implémentation concrète utilisant l'API HTTP

### 4. Use Cases
- ✅ `src/core/usecases/languages/GetLanguagesUseCase.js` - Récupérer toutes les langues
- ✅ `src/core/usecases/languages/CreateLanguageUseCase.js` - Créer une nouvelle langue
- ✅ `src/core/usecases/languages/UpdateLanguageUseCase.js` - Mettre à jour une langue
- ✅ `src/core/usecases/languages/DeleteLanguageUseCase.js` - Supprimer une langue
- ✅ `src/core/usecases/languages/index.js` - Exports des use cases

### 5. Hook React
- ✅ `src/presentation/hooks/useLanguages.js` - Hook personnalisé pour la gestion des langues

### 6. Exports Mis à Jour
- ✅ `src/core/entities/index.js` - Export de `Language`
- ✅ `src/core/interfaces/repositories/index.js` - Export de `ILanguageRepository`
- ✅ `src/infrastructure/api/index.js` - Export de `LanguageRepository`
- ✅ `src/presentation/hooks/index.js` - Export de `useLanguages`

## 🎯 Structure de l'Entité Language

```javascript
{
  id: string,
  code: string,        // Code ISO 639-1 (2 caractères, ex: 'en', 'fr')
  name: string,       // Nom de la langue (ex: 'English', 'Français')
  createdAt: Date,
  updatedAt: Date,
  createdBy: string,
  updatedBy: string
}
```

## 🔧 Méthodes Disponibles dans useLanguages Hook

```javascript
const {
  languages,           // Array<Language> - Liste des langues
  loading,             // boolean - État de chargement
  error,               // string | null - Message d'erreur
  total,               // number - Nombre total de langues
  loadLanguages,       // () => Promise<void> - Recharger les langues
  createLanguage,      // (languageData) => Promise<Language>
  updateLanguage,      // (id, updateData) => Promise<Language>
  deleteLanguage,      // (id) => Promise<boolean>
  getLanguageById,     // (id) => Promise<Language | null>
  getLanguageByCode,   // (code) => Promise<Language | null>
  refresh              // () => Promise<void> - Alias de loadLanguages
} = useLanguages();
```

## 📡 Endpoints API Gérés

### GET `/api/v1/supported-languages`
- Récupère toutes les langues
- Format de réponse : `{ code, message, data: [...], error }`

### GET `/api/v1/supported-languages/{id}`
- Récupère une langue par son ID
- Format de réponse : `{ code, message, data: {...}, error }`

### POST `/api/v1/supported-languages`
- Crée une nouvelle langue
- Body : `{ code: "en", name: "English" }`
- Format de réponse : `{ code, message, data: {...}, error }`

### PUT `/api/v1/supported-languages/{id}`
- Met à jour une langue existante
- Body : `{ code: "en", name: "English" }`
- Format de réponse : `{ code, message, data: {...}, error }`

### DELETE `/api/v1/supported-languages/{id}`
- Supprime une langue
- Format de réponse : Success (204 ou 200)

## ✅ Fonctionnalités Implémentées

1. **Validation** :
   - Code de langue doit être exactement 2 caractères (ISO 639-1)
   - Nom de langue requis (minimum 2 caractères)

2. **Unicité** :
   - Vérification de l'unicité du code avant création
   - Vérification de l'unicité du code avant mise à jour (si le code change)

3. **Gestion des Formats API** :
   - Support du format imbriqué : `response.data.data`
   - Support du format simple : `response.data`

4. **Gestion d'Erreurs** :
   - Erreurs capturées et stockées dans l'état
   - Messages d'erreur explicites
   - Gestion des cas 404 (langue non trouvée)

## 🔄 Flux de Données

```
Component → useLanguages() → UseCase → Repository → API
```

## 📝 Exemple d'Utilisation

```javascript
import { useLanguages } from '../presentation/hooks/useLanguages';

const MyComponent = () => {
  const { 
    languages, 
    loading, 
    error, 
    createLanguage, 
    updateLanguage, 
    deleteLanguage 
  } = useLanguages();

  const handleCreate = async () => {
    try {
      await createLanguage({
        code: 'fr',
        name: 'Français'
      });
      console.log('Langue créée avec succès!');
    } catch (err) {
      console.error('Erreur:', err.message);
    }
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      {languages.map(lang => (
        <div key={lang.id}>
          {lang.code} - {lang.name}
        </div>
      ))}
    </div>
  );
};
```

## ✅ Validation des Données

L'entité `Language` valide :
- ✅ Code requis et exactement 2 caractères
- ✅ Nom requis et minimum 2 caractères
- ✅ Format des dates (createdAt, updatedAt)

## 🎨 Architecture Respectée

Le service suit exactement le même pattern que les autres services :
- ✅ Entité avec validation métier
- ✅ Interface repository pour découplage
- ✅ Repository concret avec gestion des formats API
- ✅ Use cases pour la logique métier
- ✅ Hook React pour l'interface utilisateur
- ✅ Gestion des erreurs complète
- ✅ Mémorisation des instances pour performance

## 🚀 Prêt à l'Utilisation

Le service Languages est maintenant prêt à être utilisé dans vos composants React. Il suit les mêmes principes que les autres services et s'intègre parfaitement dans l'architecture existante.

