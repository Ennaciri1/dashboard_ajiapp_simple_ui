import { useState, useEffect, useCallback } from 'react';
import { Contact } from '../../core/entities/Contact.js';

/**
 * Hook personnalisé pour la gestion des contacts
 */
export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  /**
   * Charge la liste des contacts
   */
  const loadContacts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Simulation API - À remplacer par un vrai repository
      const mockContacts = [
        {
          id: 'c-1',
          name: 'Office de Tourisme',
          link: 'https://tourism.example.com',
          icon: 'map',
          active: true,
          category: 'Information',
          description: 'Office officiel du tourisme',
          priority: 'high'
        },
        {
          id: 'c-2',
          name: 'Services d\'Urgence',
          link: 'tel:+212123456789',
          icon: 'phone',
          active: true,
          category: 'Emergency',
          description: 'Numéro d\'urgence 24h/24',
          priority: 'urgent'
        },
        {
          id: 'c-3',
          name: 'Événements Culturels',
          link: 'https://events.example.com',
          icon: 'event',
          active: false,
          category: 'Events',
          description: 'Plateforme des événements culturels',
          priority: 'normal'
        }
      ];

      // Conversion en entités
      const contactEntities = mockContacts.map(contactData => Contact.fromJSON(contactData));
      
      // Filtrage selon les paramètres
      let filteredContacts = contactEntities;
      if (params.category) {
        filteredContacts = contactEntities.filter(contact => contact.category === params.category);
      }
      if (params.active !== undefined) {
        filteredContacts = filteredContacts.filter(contact => contact.active === params.active);
      }

      setContacts(filteredContacts);
      setTotal(filteredContacts.length);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crée un nouveau contact
   */
  const createContact = useCallback(async (contactData) => {
    setLoading(true);
    setError(null);

    try {
      const contact = new Contact(contactData);

      // Validation
      const validation = contact.validate();
      if (!validation.isValid) {
        throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
      }

      // Simulation API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mise à jour de la liste locale
      setContacts(prev => [...prev, contact]);
      setTotal(prev => prev + 1);
      
      return contact;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Met à jour un contact existant
   */
  const updateContact = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const existingContact = contacts.find(c => c.id === id);
      if (!existingContact) {
        throw new Error('Contact non trouvé');
      }

      const updatedContactData = { ...existingContact, ...updateData };
      const contact = new Contact(updatedContactData);

      // Validation
      const validation = contact.validate();
      if (!validation.isValid) {
        throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
      }

      // Simulation API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mise à jour de la liste locale
      setContacts(prev => prev.map(contact => 
        contact.id === id ? new Contact(updatedContactData) : contact
      ));
      
      return contact;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contacts]);

  /**
   * Active/désactive un contact
   */
  const toggleContactStatus = useCallback(async (id) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) {
      throw new Error('Contact non trouvé');
    }

    const newStatus = !contact.active;
    return updateContact(id, { active: newStatus });
  }, [contacts, updateContact]);

  /**
   * Supprime un contact
   */
  const deleteContact = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Simulation API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mise à jour de la liste locale
      setContacts(prev => prev.filter(contact => contact.id !== id));
      setTotal(prev => prev - 1);

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filtre les contacts par catégorie
   */
  const getContactsByCategory = useCallback((category) => {
    return contacts.filter(contact => contact.category === category);
  }, [contacts]);

  /**
   * Récupère les contacts d'urgence
   */
  const getEmergencyContacts = useCallback(() => {
    return contacts.filter(contact => contact.isEmergency() && contact.isActive());
  }, [contacts]);

  /**
   * Statistiques des contacts
   */
  const getContactsStats = useCallback(() => {
    const active = contacts.filter(c => c.isActive()).length;
    const inactive = contacts.filter(c => !c.isActive()).length;
    const emergency = contacts.filter(c => c.isEmergency()).length;
    const byCategory = contacts.reduce((acc, contact) => {
      acc[contact.category] = (acc[contact.category] || 0) + 1;
      return acc;
    }, {});

    return {
      total: contacts.length,
      active,
      inactive,
      emergency,
      byCategory
    };
  }, [contacts]);

  /**
   * Efface les erreurs
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Chargement initial
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  return {
    // État
    contacts,
    loading,
    error,
    total,
    
    // Actions
    loadContacts,
    createContact,
    updateContact,
    toggleContactStatus,
    deleteContact,
    clearError,
    
    // Helpers
    getContactsByCategory,
    getEmergencyContacts,
    getContactsStats,
    refresh: loadContacts
  };
};
