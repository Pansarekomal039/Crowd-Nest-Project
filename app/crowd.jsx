import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const RestaurantDetails = ({ route }) => {
  const { restaurant } = route.params;
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateDistance = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow location access.');
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      const userCoords = userLocation.coords;

      // Assuming restaurant has latitude and longitude fields
      const restaurantCoords = {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
      };

      const distanceInKm = calculateDistanceBetweenCoordinates(
        userCoords.latitude,
        userCoords.longitude,
        restaurantCoords.latitude,
        restaurantCoords.longitude
      );

      setDistance(distanceInKm);
      setLoading(false);
    };

    calculateDistance();
  }, []);

  const calculateDistanceBetweenCoordinates = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(2);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      <Text style={styles.sectionTitle}>Crowd Details</Text>
      <Text style={styles.detailText}>Timing: {restaurant.timing}</Text>
      <Text style={styles.detailText}>Cuisine: {restaurant.cuisine}</Text>
      <Text style={styles.detailText}>Address: {restaurant.address}</Text>
      <Text style={styles.detailText}>Distance: {distance} km</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default RestaurantDetails;