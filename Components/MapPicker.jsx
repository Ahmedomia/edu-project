import React, { useState, useEffect, useRef } from 'react';

const MapPicker = ({ isOpen, onClose, onConfirm, initialUrl }) => {
  const [position, setPosition] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const L = window.L;

  // Initial coordinates (e.g., center of Saudi Arabia)
  const defaultCenter = [23.8859, 45.0792];

  useEffect(() => {
    if (isOpen && !mapRef.current && window.L) {
      // Wait for a bit to ensure the modal is rendered for correct sizing
      setTimeout(() => {
        const map = L.map('map-container').setView(defaultCenter, 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        mapRef.current = map;

        // Try to parse initial URL if exists
        if (initialUrl) {
          try {
            const coords = parseGoogleMapsUrl(initialUrl);
            if (coords) {
              const pos = [coords.lat, coords.lng];
              map.setView(pos, 15);
              markerRef.current = L.marker(pos).addTo(map);
              setPosition(pos);
            }
          } catch (e) {
            console.error("Error parsing initial URL", e);
          }
        }

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          if (markerRef.current) {
            markerRef.current.setLatLng(e.latlng);
          } else {
            markerRef.current = L.marker(e.latlng).addTo(map);
          }
          setPosition([lat, lng]);
        });
      }, 100);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen]);

  const parseGoogleMapsUrl = (url) => {
    // Basic parser for google maps URLs like https://www.google.com/maps?q=lat,lng or @lat,lng
    const queryMatch = url.match(/q=([-+]?\d+\.\d+),([-+]?\d+\.\d+)/);
    if (queryMatch) return { lat: parseFloat(queryMatch[1]), lng: parseFloat(queryMatch[2]) };
    
    const atMatch = url.match(/@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/);
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    
    return null;
  };

  const handleConfirm = () => {
    if (position) {
      const googleMapsUrl = `https://www.google.com/maps?q=${position[0]},${position[1]}`;
      onConfirm(googleMapsUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 rtl">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">حدد الموقع على الخريطة</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
        </div>
        
        <div className="flex-1 relative">
          <div id="map-container" className="absolute inset-0"></div>
          {!window.L && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
              <p className="text-slate-600">جاري تحميل الخريطة...</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-slate-50 flex justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-right">
            {position ? "تم تحديد الموقع بنجاح" : "اضغط على الخريطة لتحديد الموقع"}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              إلغاء
            </button>
            <button 
              onClick={handleConfirm}
              disabled={!position}
              className={`px-8 py-2 rounded-lg text-white font-bold transition ${
                position ? 'bg-sky-800 hover:bg-sky-900' : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              تأكيد الموقع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
