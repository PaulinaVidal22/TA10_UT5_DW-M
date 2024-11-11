import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado. No se puede acceder a la ubicación.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(location);

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setAddress(reverseGeocode[0]);  
    })();
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        location ? (
          <View>
            <View style={styles.card}>
              <Text style={styles.title}>Ubicación actual:</Text>
              <Text style={styles.infoText}>Latitud: {location.coords.latitude}</Text>
              <Text style={styles.infoText}>Longitud: {location.coords.longitude}</Text>
            </View>

            {address && (
              <View style={styles.card}>
                <Text style={styles.title}>Ubicación aproximada:</Text>
                <Text style={styles.infoText}>
                  {address.city}, {address.region}, {address.country}
                </Text>
                <Text style={styles.infoText}>
                  Código Postal: {address.postalCode || "No disponible"}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.infoText}>Obteniendo ubicación...</Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'lavender',
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    width: 300,
    height: 150, 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 3,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 5,
  },
});
