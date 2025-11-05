import { LanguageRepository } from '../../infrastructure/api/LanguageRepository.js';
import { getActiveLanguages } from '../utils/translationValidator.js';

/**
 * Service to get active languages
 * This service can be used by use cases to validate translations
 */
class LanguageService {
  constructor() {
    this.languageRepository = new LanguageRepository();
    this._cachedLanguages = null;
    this._cacheTimestamp = null;
    this._cacheTTL = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Get all active languages
   * @param {boolean} useCache - Whether to use cached languages (default: true)
   * @returns {Promise<Array>} Array of active language objects
   */
  async getActiveLanguages(useCache = true) {
    const now = Date.now();
    
    // Return cached languages if available and not expired
    if (useCache && this._cachedLanguages && this._cacheTimestamp && (now - this._cacheTimestamp) < this._cacheTTL) {
      return this._cachedLanguages;
    }

    try {
      const languagesData = await this.languageRepository.findAll();
      const activeLanguages = getActiveLanguages(languagesData);
      
      // Cache the result
      this._cachedLanguages = activeLanguages;
      this._cacheTimestamp = now;
      
      return activeLanguages;
    } catch (error) {
      console.error('Error fetching active languages:', error);
      // Return empty array on error to prevent blocking updates
      return [];
    }
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this._cachedLanguages = null;
    this._cacheTimestamp = null;
  }
}

// Export singleton instance
export const languageService = new LanguageService();


