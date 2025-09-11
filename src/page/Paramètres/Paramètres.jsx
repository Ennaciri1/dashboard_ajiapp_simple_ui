import React from 'react'
import './Paramètres.css'

const Paramètres = () => {
  return (
    <div className="parametres-container">
      <div className="parametres-header">
        <h1 className="parametres-title">Paramètres</h1>
        <p className="parametres-subtitle">Gérez vos préférences et configurations</p>
      </div>
      
      <div className="parametres-content">
        <div className="parametres-section">
          <h3 className="parametres-section-title">Préférences générales</h3>
          
          <div className="parametres-form-group">
            <label className="parametres-label">Nom d'utilisateur</label>
            <input 
              type="text" 
              className="parametres-input" 
              placeholder="Entrez votre nom d'utilisateur"
            />
          </div>
          
          <div className="parametres-form-group">
            <label className="parametres-label">Email</label>
            <input 
              type="email" 
              className="parametres-input" 
              placeholder="Entrez votre email"
            />
          </div>
          
          <button className="parametres-button">Sauvegarder</button>
        </div>
        
        <div className="parametres-section">
          <h3 className="parametres-section-title">Notifications</h3>
          
          <div className="parametres-form-group">
            <label className="parametres-label">Notifications par email</label>
            <input 
              type="checkbox" 
              className="parametres-input"
            />
          </div>
          
          <div className="parametres-form-group">
            <label className="parametres-label">Notifications push</label>
            <input 
              type="checkbox" 
              className="parametres-input"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Paramètres