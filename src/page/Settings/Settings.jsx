import React from 'react'
import './Settings.css'

const Settings = () => {
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your preferences and configurations</p>
      </div>
      
      <div className="settings-content">
        <div className="settings-section">
          <h3 className="settings-section-title">General Preferences</h3>
          
          <div className="settings-form-group">
            <label className="settings-label">Username</label>
            <input 
              type="text" 
              className="settings-input" 
              placeholder="Enter your username"
            />
          </div>
          
          <div className="settings-form-group">
            <label className="settings-label">Email</label>
            <input 
              type="email" 
              className="settings-input" 
              placeholder="Enter your email"
            />
          </div>
          
          <button className="settings-button">Save</button>
        </div>
        
        <div className="settings-section">
          <h3 className="settings-section-title">Notifications</h3>
          
          <div className="settings-form-group">
            <label className="settings-label">Email notifications</label>
            <input 
              type="checkbox" 
              className="settings-input"
            />
          </div>
          
          <div className="settings-form-group">
            <label className="settings-label">Push notifications</label>
            <input 
              type="checkbox" 
              className="settings-input"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings