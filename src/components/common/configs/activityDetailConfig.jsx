import React from 'react';
import {
  SportsSoccer as SportsSoccerIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Favorite as FavoriteIcon,
  Image as ImageIcon,
  Label as LabelIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

/**
 * Configuration pour afficher les détails d'une Activity
 */
export const activityDetailConfig = {
  title: (activity) => activity?.title || 'Activity Details',
  subtitle: (activity) => `ID: ${activity?.id || 'N/A'}`,
  icon: React.createElement(SportsSoccerIcon),
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
          label: 'Price',
          value: 'price',
          type: 'price',
          icon: React.createElement(MoneyIcon),
          gridSize: 6
        },
        {
          label: 'Likes',
          value: 'likesCount',
          type: 'number',
          icon: React.createElement(FavoriteIcon),
          gridSize: 6
        },
        {
          label: 'City',
          value: (activity) => activity?.cityName || activity?.city || 'N/A',
          type: 'text',
          icon: React.createElement(LocationIcon),
          gridSize: 6
        },
        {
          label: 'City ID',
          value: 'cityId',
          type: 'text',
          icon: React.createElement(LocationIcon),
          monospace: true,
          gridSize: 6
        },
        {
          label: 'Location Coordinates',
          value: 'location',
          type: 'location',
          icon: React.createElement(LocationIcon),
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
          value: 'imageUrls',
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
    },
    {
      title: 'Tags',
      icon: React.createElement(LabelIcon),
      fields: [
        {
          label: '',
          value: 'tags',
          type: 'tags',
          gridSize: 12
        }
      ]
    }
  ]
};

