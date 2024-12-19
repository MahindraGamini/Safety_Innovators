import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform,
  PermissionsAndroid
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';

interface DangerousLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  dangerLevel: 'Low' | 'Medium' | 'High';
}


MapboxGL.setAccessToken('pk.eyJ1IjoibWFoaWkwNyIsImEiOiJjbTRsbXcxemkwMzl2MmlzM2xuMW1yNjYyIn0.Fl-SlD2tQss_Md5u2BqunA');


const DANGEROUS_LOCATIONS: DangerousLocation[] = [
  {
    id: '1',
    name: 'Downtown Crime Zone',
    coordinates: [-74.0060, 40.7128],
    description: 'High crime rate area',
    dangerLevel: 'High'
  },
  {
    id: '2',
    name: 'Industrial District',
    coordinates: [-73.7949, 40.7282],
    description: 'Reported safety incidents',
    dangerLevel: 'Medium',
  }
];

const DangerousLocationsMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<DangerousLocation | null>(null);
  const [initialCamera, setInitialCamera] = useState({
    centerCoordinate: [-74.0060, 40.7128] as [number, number],
    zoomLevel: 10
  });

  useEffect(() => {
    // Request location permissions
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
      return true;
    };

    requestLocationPermission();
  }, []);

  const getDangerMarkerStyle = (dangerLevel: DangerousLocation['dangerLevel']) => {
    switch(dangerLevel) {
      case 'High':
        return styles.highDangerMarker;
      case 'Medium':
        return styles.mediumDangerMarker;
      case 'Low':
        return styles.lowDangerMarker;
    }
  };

  const renderDangerMarkers = () => {
    return DANGEROUS_LOCATIONS.map((location) => (
      <MapboxGL.PointAnnotation
        key={location.id}
        id={location.id}
        coordinate={location.coordinates}
        onSelected={() => setSelectedLocation(location)}
      >
        
        <View style={[
          styles.marker,
          getDangerMarkerStyle(location.dangerLevel)
        ]}/>
      </MapboxGL.PointAnnotation>
    ));
  };

  const getDangerLevelStyle = (dangerLevel: DangerousLocation['dangerLevel']) => {
    switch(dangerLevel) {
      case 'High':
        return styles.highDanger;
      case 'Medium':
        return styles.mediumDanger;
      case 'Low':
        return styles.lowDanger;
    }
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView 
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapboxGL.Camera
          zoomLevel={initialCamera.zoomLevel}
          centerCoordinate={initialCamera.centerCoordinate}
        />
        
     
        {renderDangerMarkers()}
      </MapboxGL.MapView>

    
      {selectedLocation && (
        <View style={styles.locationDetailsContainer}>
          <Text style={styles.locationTitle}>{selectedLocation.name}</Text>
          <Text style={styles.locationDescription}>
            {selectedLocation.description}
          </Text>
          <Text style={[
            styles.dangerLevelText,
            getDangerLevelStyle(selectedLocation.dangerLevel)
          ]}>
            Danger Level: {selectedLocation.dangerLevel}
          </Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedLocation(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  highDangerMarker: {
    backgroundColor: 'red',
  },
  mediumDangerMarker: {
    backgroundColor: 'orange',
  },
  lowDangerMarker: {
    backgroundColor: 'yellow',
  },
  locationDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationDescription: {
    marginBottom: 10,
  },
  dangerLevelText: {
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
  },
  highDanger: {
    backgroundColor: 'rgba(255,0,0,0.2)',
    color: 'darkred',
  },
  mediumDanger: {
    backgroundColor: 'rgba(255,165,0,0.2)',
    color: 'darkorange',
  },
  lowDanger: {
    backgroundColor: 'rgba(255,255,0,0.2)',
    color: 'darkgreen',
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
});

export default DangerousLocationsMap;