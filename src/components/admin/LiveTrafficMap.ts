// src/components/admin/LiveTrafficMap.ts
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useSession } from '../lib/session';

interface TrafficData {
  id: number;
  ip: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface Props {
  // Add any props you need to pass to this component
}

const LiveTrafficMap: React.FC<Props> = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [map, setMap] = useState<L.Map | null>(null);
  const { session } = useSession();

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        const response = await axios.get('/api/admin/analytics/traffic', {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });
        setTrafficData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrafficData();
  }, [session.token]);

  useEffect(() => {
    if (map) {
      map.invalidateSize();
    }
  }, [map]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    // Handle map click event
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={2}
      style={{ height: '100vh', width: '100vw' }}
      whenCreated={(map) => setMap(map)}
      onClick={handleMapClick}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {trafficData.map((traffic) => (
        <Marker key={traffic.id} position={[traffic.latitude, traffic.longitude]}>
          <Popup>
            <div>
              <h2>IP: {traffic.ip}</h2>
              <p>Country: {traffic.country}</p>
              <p>City: {traffic.city}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LiveTrafficMap;

/* Add any CSS styles you need for this component */
.leaflet-map-pane {
  z-index: 1;
}

.leaflet-popup-content {
  width: 200px;
  height: 100px;
  padding: 10px;
  font-size: 14px;
  text-align: center;
}

.leaflet-popup-content h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.leaflet-popup-content p {
  margin-bottom: 10px;
}

This code creates a live traffic map component that displays markers for each traffic data point. The component uses the `react-leaflet` library to render the map and markers. The `useSession` hook is used to get the session token, which is used to authenticate the API request to fetch traffic data. The `useEffect` hook is used to fetch traffic data when the component mounts and to update the map when the traffic data changes. The `handleMapClick` function is called when the user clicks on the map. The CSS styles are used to customize the appearance of the map and markers.