import React from 'react'
import './Profile.css'

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
        <p className="profile-subtitle">Personal information and account settings</p>
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            👤
          </div>
          <h2 className="profile-name">John Doe</h2>
          <p className="profile-role">Administrator</p>
        </div>
        
        <div className="profile-main">
          <div className="profile-section">
            <h3 className="profile-section-title">Personal Information</h3>
            
            <div className="profile-info-item">
              <span className="profile-info-label">Full Name</span>
              <span className="profile-info-value">John Doe</span>
            </div>
            
            <div className="profile-info-item">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">john.doe@example.com</span>
            </div>
            
            <div className="profile-info-item">
              <span className="profile-info-label">Phone</span>
              <span className="profile-info-value">+1 234 567 890</span>
            </div>
            
            <div className="profile-info-item">
              <span className="profile-info-label">Registration Date</span>
              <span className="profile-info-value">January 15, 2024</span>
            </div>
          </div>
          
          <div className="profile-section">
            <h3 className="profile-section-title">Statistics</h3>
            
            <div className="profile-info-item">
              <span className="profile-info-label">Last Login</span>
              <span className="profile-info-value">2 hours ago</span>
            </div>
            
            <div className="profile-info-item">
              <span className="profile-info-label">Active Sessions</span>
              <span className="profile-info-value">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile