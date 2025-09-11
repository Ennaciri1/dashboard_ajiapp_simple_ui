import React from 'react'
import './Profil.css'

const Profil = () => {
  return (
    <div className="profil-container">
      <div className="profil-header">
        <h1 className="profil-title">Profil</h1>
        <p className="profil-subtitle">Informations personnelles et paramètres de compte</p>
      </div>
      
      <div className="profil-content">
        <div className="profil-sidebar">
          <div className="profil-avatar">
            👤
          </div>
          <h2 className="profil-name">John Doe</h2>
          <p className="profil-role">Administrateur</p>
        </div>
        
        <div className="profil-main">
          <div className="profil-section">
            <h3 className="profil-section-title">Informations personnelles</h3>
            
            <div className="profil-info-item">
              <span className="profil-info-label">Nom complet</span>
              <span className="profil-info-value">John Doe</span>
            </div>
            
            <div className="profil-info-item">
              <span className="profil-info-label">Email</span>
              <span className="profil-info-value">john.doe@example.com</span>
            </div>
            
            <div className="profil-info-item">
              <span className="profil-info-label">Téléphone</span>
              <span className="profil-info-value">+33 1 23 45 67 89</span>
            </div>
            
            <div className="profil-info-item">
              <span className="profil-info-label">Date d'inscription</span>
              <span className="profil-info-value">15 Janvier 2024</span>
            </div>
          </div>
          
          <div className="profil-section">
            <h3 className="profil-section-title">Statistiques</h3>
            
            <div className="profil-info-item">
              <span className="profil-info-label">Dernière connexion</span>
              <span className="profil-info-value">Il y a 2 heures</span>
            </div>
            
            <div className="profil-info-item">
              <span className="profil-info-label">Sessions actives</span>
              <span className="profil-info-value">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profil