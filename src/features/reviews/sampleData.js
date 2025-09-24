export const sampleReviewUsers = [
  {
    id: 'u-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com'
  },
  {
    id: 'u-2',
    name: 'Amine El Idrissi',
    email: 'amine.elidrissi@example.com'
  },
  {
    id: 'u-3',
    name: 'Laura Chen',
    email: 'laura.chen@example.com'
  }
];

export const sampleReviews = [
  {
    id: 'r-1',
    message: 'Amazing experience at the Marrakech souks. The guided tour was excellent!',
    rating: 5,
    status: 'APPROVED',
    rejectionReason: '',
    userId: 'u-1',
    userName: 'Sarah Johnson',
    entityType: 'spot',
    entityId: 1,
    entityName: 'Marrakech Souks Tour',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-11'
  },
  {
    id: 'r-2',
    message: 'Hotel was comfortable but check-in took longer than expected.',
    rating: 3,
    status: 'PENDING',
    rejectionReason: '',
    userId: 'u-2',
    userName: 'Amine El Idrissi',
    entityType: 'hotel',
    entityId: 2,
    entityName: 'Casablanca Business Hotel',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: 'r-3',
    message: 'Activity was cancelled without notice. Requesting a refund.',
    rating: 2,
    status: 'REJECTED',
    rejectionReason: 'Refund processed and voucher offered.',
    userId: 'u-3',
    userName: 'Laura Chen',
    entityType: 'activity',
    entityId: 4,
    entityName: 'Desert Quad Adventure',
    createdAt: '2023-12-28',
    updatedAt: '2023-12-30'
  }
];
