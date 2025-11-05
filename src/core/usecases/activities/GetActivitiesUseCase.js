/**
 * Use case: Get activities list
 */
export class GetActivitiesUseCase {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  /**
   * Executes the use case
   * @param {Object} params - Search parameters
   * @param {Object} params.filters - Filters to apply (can include userId)
   * @param {string} params.searchTerm - Search term
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (asc/desc)
   * @returns {Promise<{activities: Array, users: Array, total: number}>}
   */
  async execute({ filters = {}, searchTerm = '', sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
    try {
      // Validate parameters
      this._validateParams({ filters, searchTerm, sortBy, sortOrder });

      // Retrieval of activities and users
      let result;
      if (searchTerm) {
        result = await this.activityRepository.search(searchTerm, filters);
      } else {
        result = await this.activityRepository.findAll(filters);
      }

      // Ensure result has the expected structure
      const activities = result.activities || [];
      const users = result.users || [];

      // Ensure activities is an array
      if (!Array.isArray(activities)) {
        console.warn('Repository did not return an array for activities:', activities);
        return { activities: [], users: [], total: 0 };
      }

      // Sort activities
      const sortedActivities = this._sortActivities(activities, sortBy, sortOrder);

      return {
        activities: sortedActivities,
        users: users,
        total: sortedActivities.length
      };
    } catch (error) {
      throw new Error(`Error fetching activities: ${error.message}`);
    }
  }

  /**
   * Validates input parameters
   */
  _validateParams({ filters, searchTerm, sortBy, sortOrder }) {
    if (typeof filters !== 'object') {
      throw new Error('Filters must be an object');
    }

    if (typeof searchTerm !== 'string') {
      throw new Error('Search term must be a string');
    }

    const validSortFields = ['title', 'price', 'createdAt', 'updatedAt', 'likesCount'];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Sort field must be one of: ${validSortFields.join(', ')}`);
    }

    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) {
      throw new Error(`Sort order must be 'asc' or 'desc'`);
    }
  }

  /**
   * Sorts activities according to criteria
   */
  _sortActivities(activities, sortBy, sortOrder) {
    return activities.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Handle null/undefined values
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return sortOrder === 'asc' ? 1 : -1;
      if (valueB == null) return sortOrder === 'asc' ? -1 : 1;

      // Handle strings
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      // Comparison
      let comparison = 0;
      if (valueA > valueB) comparison = 1;
      else if (valueA < valueB) comparison = -1;

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }
}

