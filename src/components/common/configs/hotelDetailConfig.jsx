import React from 'react';
import {
  Hotel as HotelIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Favorite as FavoriteIcon,
  Image as ImageIcon,
  CalendarToday as CalendarTodayIcon,
  City as CityIcon
} from '@mui/icons-material';

/**
 * Configuration pour afficher les détails d'un Hotel
 */
export const hotelDetailConfig = {
  title: (hotel) => hotel?.name || 'Hotel Details',
  subtitle: (hotel) => `ID: ${hotel?.id || 'N/A'}`,
  icon: React.createElement(HotelIcon),
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
          label: 'Price Range',
          value: (hotel) => hotel.priceRange || hotel._rawData?.priceRange,
          type: 'price',
          icon: React.createElement(MoneyIcon),
          gridSize: 6
        },
        {
          label: 'Likes',
          value: (hotel) => hotel.likesCount || hotel._rawData?.likesCount || 0,
          type: 'number',
          icon: React.createElement(FavoriteIcon),
          gridSize: 6
        },
        {
          label: 'City',
          value: (hotel) => hotel.cityName || hotel._rawData?.cityName || hotel.city || 'N/A',
          type: 'text',
          icon: React.createElement(CityIcon),
          gridSize: 6
        },
        {
          label: 'City ID',
          value: (hotel) => hotel.cityId || hotel._rawData?.cityId || 'N/A',
          type: 'text',
          icon: React.createElement(LocationIcon),
          monospace: true,
          gridSize: 6
        },
        {
          label: 'Location Coordinates',
          value: (hotel) => hotel.location || hotel._rawData?.location,
          type: 'location',
          icon: React.createElement(LocationIcon),
          gridSize: 12
        }
      ]
    },
    {
      title: 'Images',
      icon: React.createElement(ImageIcon),
      fields: [
        {
          label: '',
          value: (hotel) => {
            const images = hotel.images || hotel._rawData?.images || [];
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

