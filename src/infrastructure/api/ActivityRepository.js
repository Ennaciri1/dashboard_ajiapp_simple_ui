import httpClient from './httpClient.js';

/**
 * Repository pour la gestion des activités
 * Utilise l'API HTTP pour la persistance
 */
export class ActivityRepository {
  constructor() {
    this.basePath = '/activities/admin/all';
  }

  /**
   * Récupère toutes les activités
   * @param {Object} filters - Filtres à appliquer (peut inclure userId pour filtrer par utilisateur)
   * @returns {Promise<{activities: Array, users: Array}>} - Retourne les activités aplaties et les utilisateurs
   */
  async findAll(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters as query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;

      const response = await httpClient.get(url);
      
      // Handle API response format: { code, message, data: [{userId, email, fullName, activities: [...]}], error }
      if (response.data) {
        let usersData = [];
        if (response.data.data && Array.isArray(response.data.data)) {
          usersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          usersData = response.data;
        }

        // Extraire toutes les activités de tous les utilisateurs et les aplatir
        const allActivities = [];
        const users = [];

        usersData.forEach(userGroup => {
          // Ajouter les informations de l'utilisateur
          users.push({
            userId: userGroup.userId,
            email: userGroup.email,
            fullName: userGroup.fullName,
            profilePicture: userGroup.profilePicture,
            activityProfile: userGroup.activityProfile,
            totalActivities: userGroup.totalActivities || 0
          });

          // Ajouter les activités de cet utilisateur avec les informations de l'utilisateur
          if (userGroup.activities && Array.isArray(userGroup.activities)) {
            userGroup.activities.forEach(activity => {
              allActivities.push({
                ...activity,
                // Ajouter les informations de l'utilisateur à chaque activité
                userId: userGroup.userId,
                userEmail: userGroup.email,
                userFullName: userGroup.fullName,
                createdByName: activity.createdByName || userGroup.fullName,
                createdBy: activity.createdBy || userGroup.email
              });
            });
          }
        });

        return {
          activities: allActivities,
          users: users
        };
      }
      
      return { activities: [], users: [] };
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }

  /**
   * Recherche des activités
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} filters - Filtres additionnels
   * @returns {Promise<{activities: Array, users: Array}>}
   */
  async search(searchTerm, filters = {}) {
    try {
      // For now, get all and filter client-side
      // In the future, this could use a dedicated search endpoint
      const { activities, users } = await this.findAll(filters);
      
      if (!searchTerm) {
        return { activities, users };
      }

      const searchLower = searchTerm.toLowerCase();
      const filteredActivities = activities.filter(activity => {
        const title = (activity.title || '').toLowerCase();
        const description = (activity.description || '').toLowerCase();
        const createdByName = (activity.createdByName || '').toLowerCase();
        const userFullName = (activity.userFullName || '').toLowerCase();
        return title.includes(searchLower) || 
               description.includes(searchLower) ||
               createdByName.includes(searchLower) ||
               userFullName.includes(searchLower);
      });

      return { activities: filteredActivities, users };
    } catch (error) {
      console.error('Error searching activities:', error);
      throw error;
    }
  }

  /**
   * Récupère une activité par ID
   * @param {string} id - ID de l'activité
   */
  async findById(id) {
    try {
      const response = await httpClient.get(`${this.basePath}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching activity by ID:', error);
      throw error;
    }
  }
}

