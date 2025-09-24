import React, { useState } from 'react';
import { MultiImageSelector } from '../../components/common';
import './ImageSelectorTest.css';

const ImageSelectorTest = () => {
  const [images, setImages] = useState([]);
  const [hotelImages, setHotelImages] = useState([]);
  const [touristImages, setTouristImages] = useState([]);

  const handleImagesChange = (newImages) => {
    setImages(newImages);
    console.log('Images updated:', newImages);
  };

  const handleHotelImagesChange = (newImages) => {
    setHotelImages(newImages);
    console.log('Hotel images updated:', newImages);
  };

  const handleTouristImagesChange = (newImages) => {
    setTouristImages(newImages);
    console.log('Tourist site images updated:', newImages);
  };

  return (
    <div className="image-selector-test">
      <div className="test-header">
        <h1>MultiImageSelector Component Test</h1>
        <p>This page allows you to test the multiple local image selection functionality.</p>
      </div>

      <div className="test-section">
        <h2>Standard Configuration</h2>
        <p>Select up to 5 images with preview and reordering.</p>
        <MultiImageSelector
          images={images}
          onChange={handleImagesChange}
          label="Standard Images"
          maxImages={5}
          showPreview={true}
          allowReorder={true}
        />
      </div>

      <div className="test-section">
        <h2>Hotel Configuration with Owner Field</h2>
        <p>Select up to 8 images for a hotel with owner field.</p>
        <MultiImageSelector
          images={hotelImages}
          onChange={handleHotelImagesChange}
          label="Hotel Images"
          maxImages={8}
          showPreview={true}
          allowReorder={true}
          showOwnerField={true}
          ownerLabel="Photographer/Source"
        />
      </div>

      <div className="test-section">
        <h2>Tourist Site Configuration with Owner Field</h2>
        <p>Select up to 10 images for a tourist site with owner field.</p>
        <MultiImageSelector
          images={touristImages}
          onChange={handleTouristImagesChange}
          label="Tourist Site Images"
          maxImages={10}
          showPreview={true}
          allowReorder={true}
          showOwnerField={true}
          ownerLabel="Image Owner"
        />
      </div>

      <div className="test-results">
        <h3>Results (Console)</h3>
        <div className="results-info">
          <p><strong>Standard Images:</strong> {images.length} selected</p>
          <p><strong>Hotel Images:</strong> {hotelImages.length} selected</p>
          <p><strong>Tourist Site Images:</strong> {touristImages.length} selected</p>
          <p>Check the browser console to see image details.</p>
        </div>
      </div>

      <div className="test-features">
        <h3>Testable Features</h3>
        <ul>
          <li>✅ Multiple local file selection</li>
          <li>✅ Selected image preview</li>
          <li>✅ Individual image removal</li>
          <li>✅ Drag and drop reordering</li>
          <li>✅ Image count limit</li>
          <li>✅ File size display</li>
          <li>✅ Owner field for each image</li>
          <li>✅ Responsive interface</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageSelectorTest;
