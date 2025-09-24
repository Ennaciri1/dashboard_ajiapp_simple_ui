// Sample data for tourist spots
export const sampleTouristSpots = [
  {
    id: 1,
    name: 'Jemaa el-Fna',
    description: 'Historic market square in Marrakech with vibrant nightlife.',
    address: 'Marrakech Medina, Morocco',
    cityId: 1,
    cityName: 'Marrakech',
    location: { latitude: 31.6258, longitude: -7.9891 },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&h=200&fit=crop',
        owner: 'Abdel Rahman'
      }
    ],
    isPaidEntry: false,
    openingTime: '09:00',
    closingTime: '23:30',
    active: true,
    rating: 4.8,
    ratingCount: 12500,
    likesCount: 8900,
    interestTypes: ['Culture', 'Food'],
    entryFee: 'Free'
  },
  {
    id: 2,
    name: 'Hassan II Mosque',
    description: 'Iconic mosque overlooking the Atlantic Ocean in Casablanca.',
    address: 'Boulevard Sidi Mohammed Ben Abdallah, Casablanca',
    cityId: 2,
    cityName: 'Casablanca',
    location: { latitude: 33.6083, longitude: -7.6325 },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop',
        owner: 'Imane Laachir'
      }
    ],
    isPaidEntry: true,
    openingTime: '09:00',
    closingTime: '21:00',
    active: true,
    rating: 4.9,
    ratingCount: 9800,
    likesCount: 7600,
    interestTypes: ['Architecture', 'Religion'],
    entryFee: 'MAD 120'
  },
  {
    id: 3,
    name: 'Fes Medina',
    description: 'UNESCO World Heritage site with labyrinthine streets and souks.',
    address: 'Fes El Bali, Fez',
    cityId: 3,
    cityName: 'Fes',
    location: { latitude: 34.0638, longitude: -4.9731 },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop',
        owner: 'Youssef D'
      }
    ],
    isPaidEntry: false,
    openingTime: '08:00',
    closingTime: '22:00',
    active: false,
    rating: 4.7,
    ratingCount: 7200,
    likesCount: 5400,
    interestTypes: ['Culture', 'History'],
    entryFee: 'Free'
  }
];
