import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormControlLabel,
  Switch,
  Rating,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { sampleTouristSpots } from '../touristSpots';
import { sampleHotels } from '../hotels';
import {
  REVIEW_STATUS,
  REVIEW_STATUS_OPTIONS,
  REVIEW_ENTITY_OPTIONS,
  sampleReviewUsers
} from './index';
import './FormReview.css';

const activityOptions = [
  { id: 'a-1', name: 'Desert Quad Adventure' },
  { id: 'a-2', name: 'Atlas Mountains Trek' }
];

const entityMap = {
  spot: sampleTouristSpots.map((spot) => ({ id: spot.id, name: spot.name })),
  hotel: sampleHotels.map((hotel) => ({ id: hotel.id, name: hotel.name })),
  activity: activityOptions
};

const getUserOptions = () => sampleReviewUsers.map((user) => ({ value: user.id, label: user.name }));

const FormReview = () => {
  const navigate = useNavigate();
  const [isModerationMode, setIsModerationMode] = useState(false);

  const [formData, setFormData] = useState({
    message: '',
    rating: 0,
    status: REVIEW_STATUS.PENDING,
    rejectionReason: '',
    userId: sampleReviewUsers[0]?.id || '',
    entityType: 'spot',
    entityId: sampleTouristSpots[0]?.id || ''
  });

  const entityOptions = useMemo(() => entityMap[formData.entityType] || [], [formData.entityType]);

  const handleInputChange = (field) => (event) => {
    const value = event?.target?.value ?? event;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      status: value,
      rejectionReason: value === REVIEW_STATUS.REJECTED ? prev.rejectionReason : ''
    }));
  };

  const handleEntityTypeChange = (event) => {
    const type = event.target.value;
    const options = entityMap[type] || [];
    setFormData((prev) => ({
      ...prev,
      entityType: type,
      entityId: options[0]?.id || ''
    }));
  };

  const handleToggleModeration = (event) => {
    setIsModerationMode(event.target.checked);
  };

  const handleBack = () => {
    navigate('/services/reviews');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formattedData = {
      ...formData,
      rating: Number(formData.rating),
      rejectionReason: formData.status === REVIEW_STATUS.REJECTED ? formData.rejectionReason : '',
      entityId: formData.entityId,
      createdAt: new Date().toISOString()
    };

    console.log('Review form submitted:', formattedData);
    alert('Review saved successfully!');
    navigate('/services/reviews');
  };

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h1>Review</h1>
      </div>

      <div className="simple-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <FormControlLabel
              control={
                <Switch
                  checked={isModerationMode}
                  onChange={handleToggleModeration}
                  color="primary"
                />
              }
              label="Moderation mode"
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              value={formData.message}
              onChange={handleInputChange('message')}
              rows={4}
              className="simple-textarea"
              readOnly={isModerationMode}
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <Rating
              name="rating"
              value={Number(formData.rating)}
              onChange={(_, value) => handleInputChange('rating')(value || 0)}
            />
          </div>

          <div className="form-group">
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={formData.status} label="Status" onChange={handleStatusChange}>
                {REVIEW_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {formData.status === REVIEW_STATUS.REJECTED && (
            <div className="form-group">
              <label>Rejection reason</label>
              <textarea
                value={formData.rejectionReason}
                onChange={handleInputChange('rejectionReason')}
                rows={3}
                className="simple-textarea"
              />
            </div>
          )}

          <div className="form-group">
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <Select value={formData.userId} label="User" onChange={handleInputChange('userId')}>
                {getUserOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="form-row">
            <div className="form-group">
              <FormControl fullWidth>
                <InputLabel>Entity type</InputLabel>
                <Select value={formData.entityType} label="Entity type" onChange={handleEntityTypeChange}>
                  {REVIEW_ENTITY_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="form-group">
              <FormControl fullWidth>
                <InputLabel>Entity</InputLabel>
                <Select value={formData.entityId} label="Entity" onChange={handleInputChange('entityId')}>
                  {entityOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleBack} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormReview;
