import React, { useEffect, useMemo, useRef, useState } from 'react';
import './MapSelector.css';

const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const DEFAULT_CENTER = [31.7917, -7.0926]; // Morocco center
const DEFAULT_ZOOM = 6; // Zoom level to show Morocco properly

let leafletPromise = null;

const appendStylesheetOnce = (href) => {
  if (typeof document === 'undefined') {
    return;
  }
  const isLoaded = Array.from(document.styleSheets).some((sheet) => sheet.href === href);
  if (!isLoaded) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
};

const loadLeaflet = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (window.L) {
    return Promise.resolve(window.L);
  }

  if (!leafletPromise) {
    appendStylesheetOnce(LEAFLET_CSS_URL);
    leafletPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = LEAFLET_JS_URL;
      script.async = true;
      script.onload = () => resolve(window.L);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  return leafletPromise;
};

const MapSelector = ({
  latitude,
  longitude,
  onChange,
  label = 'Select a location',
  height,
  searchPlaceholder = 'Search for an address or place'
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const hasValidCoords = Number.isFinite(lat) && Number.isFinite(lng);

  const hasResults = useMemo(() => searchResults.length > 0, [searchResults]);

  useEffect(() => {
    let isCancelled = false;

    loadLeaflet()
      .then((L) => {
        if (isCancelled || !mapContainerRef.current) {
          return;
        }

        const initialCenter = hasValidCoords ? [lat, lng] : DEFAULT_CENTER;
        const initialZoom = hasValidCoords ? 12 : DEFAULT_ZOOM;

        const map = L.map(mapContainerRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          zoomControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const addOrUpdateMarker = (coords) => {
          if (markerRef.current) {
            markerRef.current.setLatLng(coords);
          } else {
            markerRef.current = L.marker(coords, { draggable: true }).addTo(map);
            markerRef.current.on('dragend', (event) => {
              const { lat: newLat, lng: newLng } = event.target.getLatLng();
              onChange?.({ latitude: newLat, longitude: newLng });
            });
          }
        };

        if (hasValidCoords) {
          addOrUpdateMarker([lat, lng]);
        }

        map.on('click', (event) => {
          const { lat: nextLat, lng: nextLng } = event.latlng;
          addOrUpdateMarker([nextLat, nextLng]);
          onChange?.({ latitude: nextLat, longitude: nextLng });
        });

        mapRef.current = { map, L };
        setIsMapReady(true);
      })
      .catch((error) => {
        console.error('Failed to load Leaflet', error);
      });

    return () => {
      isCancelled = true;
      if (mapRef.current?.map) {
        mapRef.current.map.remove();
        mapRef.current = null;
      }
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isMapReady || !mapRef.current) {
      return;
    }

    const { map, L } = mapRef.current;
    if (!L) {
      return;
    }

    if (hasValidCoords) {
      const coords = [lat, lng];
      map.setView(coords, map.getZoom() || 12);
      if (markerRef.current) {
        markerRef.current.setLatLng(coords);
      } else {
        markerRef.current = L.marker(coords, { draggable: true }).addTo(map);
        markerRef.current.on('dragend', (event) => {
          const { lat: newLat, lng: newLng } = event.target.getLatLng();
          onChange?.({ latitude: newLat, longitude: newLng });
        });
      }
    }
  }, [latitude, longitude, isMapReady]);

  const handleResultSelection = (result) => {
    const nextLat = parseFloat(result.lat);
    const nextLng = parseFloat(result.lon);
    if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) {
      return;
    }
    if (mapRef.current?.map && mapRef.current?.L) {
      const { map, L } = mapRef.current;
      map.setView([nextLat, nextLng], 14);
      
      // Add or update marker
      if (markerRef.current) {
        markerRef.current.setLatLng([nextLat, nextLng]);
      } else {
        markerRef.current = L.marker([nextLat, nextLng], { draggable: true }).addTo(map);
        markerRef.current.on('dragend', (event) => {
          const { lat: newLat, lng: newLng } = event.target.getLatLng();
          onChange?.({ latitude: newLat, longitude: newLng });
        });
      }
    }
    onChange?.({ latitude: nextLat, longitude: nextLng });
    setSearchResults([]);
    setSearchTerm(''); // Clear search field after selection
  };

  const handleClearResults = () => {
    setSearchResults([]);
    setSearchError('');
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError('');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    try {
      // D'abord chercher au Maroc
      const moroccoUrl = new URL('https://nominatim.openstreetmap.org/search');
      moroccoUrl.searchParams.set('format', 'json');
      moroccoUrl.searchParams.set('limit', '8');
      moroccoUrl.searchParams.set('q', query.trim());
      moroccoUrl.searchParams.set('addressdetails', '1');
      moroccoUrl.searchParams.set('countrycodes', 'ma'); // Maroc seulement
      
      const moroccoResponse = await fetch(moroccoUrl.toString(), {
        headers: {
          'Accept-Language': 'fr',
          'User-Agent': 'SimpleUI/1.0 (contact@example.com)'
        }
      });

      if (!moroccoResponse.ok) {
        throw new Error('Search not available at the moment.');
      }

      let results = await moroccoResponse.json();
      
      // If no results in Morocco, search globally
      if (!results || results.length === 0) {
        const globalUrl = new URL('https://nominatim.openstreetmap.org/search');
        globalUrl.searchParams.set('format', 'json');
        globalUrl.searchParams.set('limit', '5');
        globalUrl.searchParams.set('q', query.trim());
        globalUrl.searchParams.set('addressdetails', '1');
        
        const globalResponse = await fetch(globalUrl.toString(), {
          headers: {
            'Accept-Language': 'fr',
            'User-Agent': 'SimpleUI/1.0 (contact@example.com)'
          }
        });
        
        if (globalResponse.ok) {
          results = await globalResponse.json();
        }
      }

      setSearchResults(Array.isArray(results) ? results : []);
      if (!results || results.length === 0) {
        setSearchError('No results found. Try another search term.');
      }
    } catch (error) {
      console.error('Location search failed', error);
      setSearchError(error.message || 'An error occurred during the search.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    performSearch(searchTerm);
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Clear results if field is empty
    if (!value.trim()) {
      setSearchResults([]);
      setSearchError('');
      return;
    }
    
    // Automatic search with delay
    const newTimeout = setTimeout(() => {
      performSearch(value);
    }, 500); // Wait 500ms after user stops typing
    
    setSearchTimeout(newTimeout);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      // Cancel automatic search timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      performSearch(searchTerm);
    }
  };

  const mapSelectorStyle = height ? { height: `${height}px` } : {};

  return (
    <div className="map-selector" style={mapSelectorStyle}>
      <div className="map-selector__header">
        <span className="map-selector__label">{label}</span>
        <span className="map-selector__helper">Click on the map to set coordinates</span>
      </div>
      <div className="map-selector__search">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
          onKeyPress={handleSearchKeyPress}
          placeholder={searchPlaceholder}
          className="map-selector__search-input"
        />
        <button 
          type="button" 
          onClick={handleSearch}
          className="map-selector__search-button" 
          disabled={isSearching}
        >
          {isSearching ? 'Searching…' : 'Search'}
        </button>
      </div>
      {searchError && <div className="map-selector__error">{searchError}</div>}
      {hasResults && (
        <div className="map-selector__results-container">
          <div className="map-selector__results-header">
            <span className="map-selector__results-title">Search Results</span>
            <button
              type="button"
              onClick={handleClearResults}
              className="map-selector__results-close"
              title="Close results"
            >
              ×
            </button>
          </div>
          <ul className="map-selector__results">
            {searchResults.map((result) => (
              <li key={`${result.place_id}`}>
                <button
                  type="button"
                  onClick={() => handleResultSelection(result)}
                  className="map-selector__result-item"
                >
                  <div className="map-selector__result-content">
                    <span className="map-selector__result-name">
                      {result.name || result.display_name.split(',')[0]}
                    </span>
                    <span className="map-selector__result-address">
                      {result.display_name}
                    </span>
                  </div>
                  <span className="map-selector__result-coords">
                    {parseFloat(result.lat).toFixed(4)} · {parseFloat(result.lon).toFixed(4)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div ref={mapContainerRef} className="map-selector__map" />
    </div>
  );
};

export default MapSelector;
