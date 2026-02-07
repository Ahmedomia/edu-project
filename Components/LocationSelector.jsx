import React, { useState, useEffect } from 'react';
import { getCountries, getCitiesByCountry, getNeighborhoodsByCity } from '../src/locationData';

const LocationSelector = ({ 
  country = '', 
  city = '', 
  neighborhood = '', 
  onChange,
  disabled = false,
  showLabels = true,
  required = true
}) => {
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [selectedCity, setSelectedCity] = useState(city);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(neighborhood);
  const [isCustomNeighborhood, setIsCustomNeighborhood] = useState(false);

  const countries = getCountries();
  const cities = selectedCountry ? getCitiesByCountry(selectedCountry) : [];
  const neighborhoods = selectedCountry && selectedCity ? getNeighborhoodsByCity(selectedCountry, selectedCity) : [];

  useEffect(() => {
    setSelectedCountry(country);
    setSelectedCity(city);
    setSelectedNeighborhood(neighborhood);
    
    // Check if current neighborhood is custom (not in predefined list)
    if (neighborhood && neighborhoods.length > 0 && !neighborhoods.includes(neighborhood)) {
      setIsCustomNeighborhood(true);
    } else {
      setIsCustomNeighborhood(false);
    }
  }, [country, city, neighborhood, neighborhoods]);

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    setSelectedCity('');
    setSelectedNeighborhood('');
    setIsCustomNeighborhood(false);
    
    if (onChange) {
      onChange({
        country: newCountry,
        city: '',
        neighborhood: ''
      });
    }
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    setSelectedNeighborhood('');
    setIsCustomNeighborhood(false);
    
    if (onChange) {
      onChange({
        country: selectedCountry,
        city: newCity,
        neighborhood: ''
      });
    }
  };

  const handleNeighborhoodSelectChange = (e) => {
    const value = e.target.value;
    
    if (value === '__custom__') {
      setIsCustomNeighborhood(true);
      setSelectedNeighborhood('');
    } else {
      setIsCustomNeighborhood(false);
      setSelectedNeighborhood(value);
      
      if (onChange) {
        onChange({
          country: selectedCountry,
          city: selectedCity,
          neighborhood: value
        });
      }
    }
  };

  const handleNeighborhoodInputChange = (e) => {
    const newNeighborhood = e.target.value;
    setSelectedNeighborhood(newNeighborhood);
    
    if (onChange) {
      onChange({
        country: selectedCountry,
        city: selectedCity,
        neighborhood: newNeighborhood
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Country */}
      <div>
        {showLabels && (
          <label className="text-sm text-slate-600">
            الدولة {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          disabled={disabled}
          className={`w-full rounded-lg p-3 ${
            disabled
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-slate-800 text-white'
          }`}
          required={required}
        >
          <option value="">اختر الدولة</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        {showLabels && (
          <label className="text-sm text-slate-600">
            المدينة {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          value={selectedCity}
          onChange={handleCityChange}
          disabled={disabled || !selectedCountry}
          className={`w-full rounded-lg p-3 ${
            disabled || !selectedCountry
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-slate-800 text-white'
          }`}
          required={required}
        >
          <option value="">اختر المدينة</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Neighborhood */}
      <div>
        {showLabels && (
          <label className="text-sm text-slate-600">
            الحي <span className="text-slate-400 text-xs">(اختياري)</span>
          </label>
        )}
        
        {neighborhoods.length > 0 && !isCustomNeighborhood ? (
          <select
            value={selectedNeighborhood}
            onChange={handleNeighborhoodSelectChange}
            disabled={disabled || !selectedCity}
            className={`w-full rounded-lg p-3 ${
              disabled || !selectedCity
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800 text-white'
            }`}
          >
            <option value="">اختر الحي (اختياري)</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
            <option value="__custom__">أخرى (اكتب الحي)</option>
          </select>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={selectedNeighborhood}
              onChange={handleNeighborhoodInputChange}
              disabled={disabled || !selectedCity}
              placeholder="اكتب الحي (اختياري)"
              className={`w-full rounded-lg p-3 ${
                disabled || !selectedCity
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 text-white'
              }`}
            />
            {neighborhoods.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsCustomNeighborhood(false);
                  setSelectedNeighborhood('');
                }}
                className="text-sm text-sky-600 hover:text-sky-800"
              >
                العودة للقائمة
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
