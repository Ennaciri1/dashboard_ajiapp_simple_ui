# Translation Service Documentation

## Overview

The Translation Service provides a complete solution for managing multilingual content across different entity types (cities, tourist spots, hotels, etc.). It allows administrators to view and edit translations grouped by entity type, entity ID, and field name.

## Architecture

The service follows Clean Architecture principles:

### Core Layer
- **`ITranslationRepository`** (`src/core/interfaces/repositories/ITranslationRepository.js`): Interface defining repository contracts
- **Use Cases**:
  - `GetTranslationsUseCase`: Retrieves grouped translations
  - `UpdateTranslationUseCase`: Updates translations for a specific field

### Infrastructure Layer
- **`TranslationRepository`** (`src/infrastructure/api/TranslationRepository.js`): Concrete implementation using HTTP client

### Presentation Layer
- **`useTranslations`** Hook (`src/presentation/hooks/useTranslations.js`): React hook for translation management
- **`TranslationEditor`** Component (`src/components/common/TranslationEditor.jsx`): UI component for editing translations

## API Endpoints

### Get Grouped Translations
```
GET /api/v1/translations/grouped
```

**Response Format:**
```json
{
  "code": "200",
  "message": "All translations retrieved successfully",
  "data": {
    "tourist_spot": {
      "XyUBmF7ArfkXI2jthztI": {
        "address": {
          "en": "hassan rue de rabat"
        },
        "name": {
          "en": "hassan"
        },
        "description": {
          "en": "hassan"
        }
      }
    },
    "city": {
      "TBjFezq6DZxQfJOvY5od": {
        "name": {
          "en": "sale"
        }
      }
    }
  },
  "error": false
}
```

### Update Translation
```
PUT /api/v1/translations/entity/{entityType}/{entityId}/field/{fieldName}
```

**Request Body:**
```json
{
  "en": "English translation",
  "fr": "French translation",
  "ar": "Arabic translation"
}
```

**Response Format:**
```json
{
  "code": "200",
  "message": "Translation updated successfully",
  "data": {
    "en": "English translation",
    "fr": "French translation",
    "ar": "Arabic translation"
  },
  "error": false
}
```

## Features

### 1. Automatic Language Support
- The service automatically loads all supported languages from the `Languages` service
- If a translation doesn't exist for a supported language, it displays as an empty field
- All supported languages are always shown, even if they're not in the API response

### 2. Entity Type Mapping
The service uses `entityTypeMapper.js` to convert between frontend and API formats:
- Frontend: `tourist-spot`, `touristSpot`
- API: `tourist_spot`

### 3. Real-time Updates
- When a translation is updated, the service automatically refreshes the grouped translations
- The UI reflects changes immediately

## Usage Examples

### Using the Hook

```javascript
import { useTranslations } from '../../presentation/hooks/useTranslations';
import { useLanguages } from '../../presentation/hooks/useLanguages';

function MyComponent() {
  const { languages } = useLanguages();
  const {
    getFieldTranslations,
    updateTranslation,
    loading,
    error
  } = useTranslations();

  // Get translations for a specific field
  const translations = getFieldTranslations(
    'city',
    'TBjFezq6DZxQfJOvY5od',
    'name',
    languages // Pass supported languages for complete translation set
  );

  // Update translations
  const handleUpdate = async () => {
    await updateTranslation(
      'city',
      'TBjFezq6DZxQfJOvY5od',
      'name',
      {
        en: 'Sale',
        fr: 'Salé',
        ar: 'سلا'
      }
    );
  };
}
```

### Using the TranslationEditor Component

```javascript
import TranslationEditor from '../../components/common/TranslationEditor';

function FormCity({ cityId }) {
  return (
    <TranslationEditor
      entityType="city"
      entityId={cityId}
      fieldName="name"
      label="City Name Translations"
      required={true}
      multiline={false}
    />
  );
}
```

### TranslationEditor Props

- `entityType` (string, required): Type of entity (e.g., 'city', 'tourist_spot', 'hotel')
- `entityId` (string, required): ID of the entity
- `fieldName` (string, required): Name of the field (e.g., 'name', 'description', 'address')
- `label` (string, optional): Label to display for the field
- `required` (boolean, optional): Whether the field is required
- `multiline` (boolean, optional): Whether to use multiline input
- `rows` (number, optional): Number of rows for multiline input (default: 3)

## Data Flow

1. **Loading Translations:**
   - `useTranslations` hook loads all grouped translations on mount
   - Translations are stored in `groupedTranslations` state
   - `GetTranslationsUseCase` retrieves data from API via `TranslationRepository`

2. **Getting Field Translations:**
   - `getFieldTranslations()` extracts translations for a specific field
   - If a language doesn't exist in the response, it returns an empty string for that language
   - All supported languages are included in the result

3. **Updating Translations:**
   - User edits translations in `TranslationEditor`
   - On save, `updateTranslation()` is called
   - `UpdateTranslationUseCase` sends PUT request via `TranslationRepository`
   - After successful update, translations are refreshed automatically

## Supported Entity Types

The service supports the following entity types:
- `city` - Cities
- `tourist_spot` - Tourist spots
- `hotel` - Hotels
- `stadium` - Stadiums
- `visa` - Visas
- `contact` - Contacts
- `activity` - Activities

## Integration Points

The Translation Service integrates with:
- **Languages Service**: Gets list of supported languages
- **Entity Forms**: Used in form components for editing entity translations
- **API Client**: Uses `httpClient` for API communication

## Current Usage

The Translation Service is currently used in:
- `FormCity.jsx`: For editing city name translations
- Other entity forms can be updated to use `TranslationEditor` component

## Future Enhancements

Potential improvements:
- Bulk translation updates
- Translation history/versioning
- Translation validation
- Auto-translation suggestions
- Translation export/import


