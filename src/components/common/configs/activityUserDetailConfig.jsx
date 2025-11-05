import React from 'react';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

/**
 * Configuration pour afficher les détails d'un ActivityUser
 */
export const activityUserDetailConfig = {
  title: (user) => user?.fullName || 'User Details',
  subtitle: (user) => `User ID: ${user?.userId || user?.id || 'N/A'}`,
  icon: React.createElement(PersonIcon),
  sections: [
    {
      title: 'Basic Information',
      fields: [
        {
          label: 'Full Name',
          value: 'fullName',
          type: 'text',
          icon: React.createElement(PersonIcon),
          gridSize: 6
        },
        {
          label: 'Email',
          value: 'email',
          type: 'text',
          icon: React.createElement(EmailIcon),
          gridSize: 6
        },
        {
          label: 'Phone Number',
          value: 'phoneNumber',
          type: 'text',
          icon: React.createElement(PhoneIcon),
          gridSize: 6
        },
        {
          label: 'User ID',
          value: (user) => user.userId || user.id || 'N/A',
          type: 'text',
          monospace: true,
          gridSize: 6
        }
      ]
    },
    {
      title: 'Roles',
      icon: React.createElement(SecurityIcon),
      fields: [
        {
          label: '',
          value: (user) => user.roles || [],
          type: 'tags',
          gridSize: 12
        }
      ]
    },
    {
      title: 'Profiles',
      icon: React.createElement(BusinessIcon),
      fields: [
        {
          label: '',
          value: (user) => {
            if (!user.profiles || !Array.isArray(user.profiles) || user.profiles.length === 0) {
              return 'No profiles';
            }
            return user.profiles.map(profile => 
              `${profile.title || 'Unnamed Profile'} (${profile.profileType || 'N/A'})${profile.description ? ': ' + profile.description : ''}`
            ).join('\n\n');
          },
          type: 'text',
          gridSize: 12,
          multiline: true
        }
      ]
    },
    {
      title: 'Additional Information',
      fields: [
        {
          label: 'Profile Picture',
          value: (user) => user.profilePicture ? 'Available' : 'N/A',
          type: 'text',
          gridSize: 6
        },
        {
          label: 'Token Status',
          value: (user) => user.token ? 'Active' : 'Inactive',
          type: 'chip',
          gridSize: 6
        }
      ]
    }
  ]
};

