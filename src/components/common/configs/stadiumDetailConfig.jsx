import React from 'react';
import {
  SportsSoccer as StadiumIcon,
  LocationOn as LocationIcon,
  Image as ImageIcon,
  CalendarToday as CalendarTodayIcon,
  City as CityIcon
} from '@mui/icons-material';

/**
 * Configuration pour afficher les détails d'un Stadium
 */
export const stadiumDetailConfig = {
  title: (stadium) => stadium?.name || 'Stadium Details',
  subtitle: (stadium) => `ID: ${stadium?.id || 'N/A'}`,
  icon: React.createElement(StadiumIcon),
  sections: [
    {
      title: 'Description',
      fields: [
        {
          label: 'Description',
          value: 'description',
          type: 'text',
          multiline: true,
          gridSize: 12
        }
      ]
    },
    {
      title: 'Information',
      fields: [
        {
          label: 'City',
          value: (stadium) => stadium.cityName || stadium._rawData?.cityName || stadium.city || 'N/A',
          type: 'text',
          icon: React.createElement(CityIcon),
          gridSize: 6
        },
        {
          label: 'City ID',
          value: (stadium) => stadium.cityId || stadium._rawData?.cityId || 'N/A',
          type: 'text',
          icon: React.createElement(LocationIcon),
          monospace: true,
          gridSize: 6
        },
        {
          label: 'Location Coordinates',
          value: (stadium) => stadium.location || stadium._rawData?.location,
          type: 'location',
          icon: React.createElement(LocationIcon),
          gridSize: 12
        },
        {
          label: 'Capacity',
          value: (stadium) => stadium.capacity || stadium._rawData?.capacity || 'N/A',
          type: 'number',
          gridSize: 6
        }
      ]
    },
    {
      title: 'Images',
      icon: React.createElement(ImageIcon),
      fields: [
        {
          label: '',
          value: (stadium) => {
            const images = stadium.images || stadium._rawData?.images || [];
            return images.map(img => img.url || img);
          },
          type: 'images',
          gridSize: 12
        }
      ]
    },
    {
      title: 'Timeline',
      icon: React.createElement(CalendarTodayIcon),
      fields: [
        {
          label: 'Created At',
          value: 'createdAt',
          type: 'date',
          gridSize: 12
        },
        {
          label: 'Updated At',
          value: 'updatedAt',
          type: 'date',
          gridSize: 12
        }
      ]
    }
  ]
};

