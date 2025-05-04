import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken('MAPBOX_ACCESS_TOKEN');

export default function MapScreen() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }
      Geolocation.getCurrentPosition(
        (pos) => setLocation([pos.coords.longitude, pos.coords.latitude]),
        (err) => console.warn(err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    getLocation();
  }, []);

  if (!location) return null;

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView style={{ flex: 1 }}>
        <MapboxGL.Camera centerCoordinate={location} zoomLevel={14} />
        <MapboxGL.PointAnnotation id="me" coordinate={location} />
      </MapboxGL.MapView>
    </View>
  );
}
