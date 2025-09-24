import React, { useState, useRef } from 'react';
import { imageService } from '../../services/api/imageService';
import { useNotification } from '../../contexts/NotificationContext';
import './MultiImageSelector.css';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const MultiImageSelector = ({
  images = [],
  onChange,
  label = 'Images',
  maxImages = 10,
  acceptedTypes = 'image/*',
  showPreview = true,
  allowReorder = true,
  showOwnerField = false,
  ownerLabel = 'Owner',
  subdirectory = 'general',
  uploadToServer = false
}) => {
  const { showSuccess, showError } = useNotification();
  const fileInputRef = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(new Set());

  // Convert file to base64 for preview
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    // Check image limit
    if (images.length + files.length > maxImages) {
      showError(`You can only select a maximum of ${maxImages} images.`);
      return;
    }

    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          // Validate file
          const validation = imageService.validateImageFile(file);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }

          const preview = await fileToBase64(file);
          const imageId = Date.now() + Math.random();
          
          const imageData = {
            id: imageId,
            file: file,
            preview: preview,
            name: file.name,
            size: file.size,
            type: file.type,
            owner: showOwnerField ? '' : undefined,
            url: null, // Will be set after upload
            uploading: false
          };

          // Upload to server if enabled
          if (uploadToServer) {
            imageData.uploading = true;
            setUploadingImages(prev => new Set([...prev, imageId]));
            
            try {
              const response = await imageService.uploadImage(file, subdirectory);
              const imageUrl = imageService.getImageUrl(response);
              console.log('Upload response:', response);
              console.log('Extracted image URL:', imageUrl);
              imageData.url = imageUrl;
              imageData.uploading = false;
              setUploadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(imageId);
                return newSet;
              });
            } catch (uploadError) {
              console.error('Error uploading image:', uploadError);
              imageData.uploading = false;
              imageData.uploadError = uploadError.message || 'Upload failed';
              setUploadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(imageId);
                return newSet;
              });
            }
          }

          return imageData;
        })
      );

      onChange([...images, ...newImages]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing images:', error);
      showError(error.message || 'Error processing images.');
    }
  };

  const handleRemoveImage = async (indexToRemove) => {
    const imageToRemove = images[indexToRemove];
    
    // If image was uploaded to server, delete it
    if (uploadToServer && imageToRemove.url) {
      try {
        await imageService.deleteImage(imageToRemove.url);
      } catch (error) {
        console.error('Error deleting image from server:', error);
        // Continue with local removal even if server deletion fails
      }
    }
    
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    onChange(updatedImages);
  };

  const handleOwnerChange = (index, newOwner) => {
    const updatedImages = images.map((image, i) => 
      i === index ? { ...image, owner: newOwner } : image
    );
    onChange(updatedImages);
  };

  const handleDragStart = (event, index) => {
    if (!allowReorder) return;
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event, index) => {
    if (!allowReorder) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    if (!allowReorder) return;
    setDragOverIndex(null);
  };

  const handleDrop = (event, dropIndex) => {
    if (!allowReorder) return;
    event.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    
    // Remove item from current position
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedItem);
    
    onChange(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="multi-image-selector">
      <div className="multi-image-selector__header">
        <label className="multi-image-selector__label">{label}</label>
        <span className="multi-image-selector__counter">
          {images.length}/{maxImages} images
        </span>
      </div>

      {canAddMore && (
        <div className="multi-image-selector__upload-area">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="multi-image-selector__input"
            id="multi-image-input"
          />
          <label htmlFor="multi-image-input" className="multi-image-selector__upload-btn">
            <div className="multi-image-selector__upload-icon">📁</div>
            <div className="multi-image-selector__upload-text">
              <strong>Click to select</strong> or drag and drop
            </div>
            <div className="multi-image-selector__upload-hint">
              PNG, JPG, GIF up to 10MB each
            </div>
          </label>
        </div>
      )}

      {images.length > 0 && (
        <div className="multi-image-selector__gallery">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className={`multi-image-selector__item ${
                dragOverIndex === index ? 'drag-over' : ''
              }`}
              draggable={allowReorder}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              {showPreview && (
                <div className="multi-image-selector__preview">
                  <img
                    src={image.preview || (image.url ? (image.url.startsWith('http') ? image.url : `${baseURL}${image.url}`) : '')}
                    alt={image.name || `Image ${index + 1}`}
                    className="multi-image-selector__preview-img"
                  />
                  {image.uploading && (
                    <div className="multi-image-selector__uploading-overlay">
                      <div className="multi-image-selector__uploading-spinner"></div>
                      <span>Uploading...</span>
                    </div>
                  )}
                  {image.uploadError && (
                    <div className="multi-image-selector__error-overlay">
                      <span>Upload failed</span>
                    </div>
                  )}
                  {allowReorder && !image.uploading && (
                    <div className="multi-image-selector__drag-handle">⋮⋮</div>
                  )}
                </div>
              )}
              
              <div className="multi-image-selector__info">
                <div className="multi-image-selector__filename">
                  {image.name || `Image ${index + 1}`}
                </div>
                {image.size && (
                  <div className="multi-image-selector__filesize">
                    {formatFileSize(image.size)}
                  </div>
                )}
                {showOwnerField && (
                  <div className="multi-image-selector__owner-field">
                    <input
                      type="text"
                      value={image.owner || ''}
                      onChange={(e) => handleOwnerChange(index, e.target.value)}
                      placeholder={ownerLabel}
                      className="multi-image-selector__owner-input"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="multi-image-selector__remove-btn"
                title="Remove this image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="multi-image-selector__empty">
          <div className="multi-image-selector__empty-icon">🖼️</div>
          <div className="multi-image-selector__empty-text">
            No images selected
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageSelector;
