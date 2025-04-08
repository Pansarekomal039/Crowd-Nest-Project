import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../app/firebaseConfig';

const RestaurantDetails = ({ route, navigation }) => {
  const restaurantId = route.params?.restaurantId || route.params?.firestoreId;
  
  if (!restaurantId) {
    return (
      <View style={styles.errorContainer}>
        <Text>No restaurant selected</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);

  // Static image for all restaurants
  const restaurantImage = require("../assets/images/Waiters-amico.png");
  useEffect(() => {
  const fetchRestaurant = async () => {
  try {
    const docRef = doc(firestore, 'restaurants', restaurantId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setRestaurant(docSnap.data());
    } else {
      Alert.alert("Error", "Restaurant not found");
      navigation.goBack(); // or handle differently
    }
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

fetchRestaurant();
}, [restaurantId]);


  useEffect(() => {
    if (restaurant?.location && userLocation) {
      try {
        const dist = getDistance(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: restaurant.location.latitude, longitude: restaurant.location.longitude }
        );
        setDistance((dist / 1000).toFixed(1)); // Convert to km
      } catch (err) {
        console.error('Distance calculation error:', err);
        setDistance(null);
      }
    }
  }, [restaurant, userLocation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D28D9" />
        <Text style={styles.loadingText}>Loading restaurant details...</Text>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={50} color="#FF3B30" />
        <Text style={styles.errorText}>{error || 'Failed to load restaurant'}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Restaurant Header with Name */}
      <View style={styles.header}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        {distance !== null ? (
          <View style={styles.distanceContainer}>
            <Ionicons name="location-outline" size={16} color="#6D28D9" />
            <Text style={styles.distanceText}>{distance} km away</Text>
          </View>
        ) : (
          <Text style={styles.distanceText}>Distance unavailable</Text>
        )}
      </View>

      {/* Static Restaurant Image */}
      <Image source={restaurantImage} style={styles.restaurantImage} />

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {/* Cuisine */}
        <View style={styles.detailRow}>
          <Ionicons name="restaurant-outline" size={20} color="#6D28D9" />
          <Text style={styles.detailText}>{restaurant.cuisine} Cuisine</Text>
        </View>

        {/* Timing */}
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={20} color="#6D28D9" />
          <Text style={styles.detailText}>Open: {restaurant.timing}</Text>
        </View>

        {/* Address */}
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color="#6D28D9" />
          <Text style={styles.detailText}>{restaurant.address}</Text>
        </View>

        {/* Capacity */}
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={20} color="#6D28D9" />
          <Text style={styles.detailText}>Capacity: {restaurant.capacity} guests</Text>
        </View>

        {/* Special Features */}
        {restaurant.specialRequest && (
          <View style={styles.detailRow}>
            <Ionicons name="star-outline" size={20} color="#6D28D9" />
            <Text style={styles.detailText}>Special: {restaurant.specialRequest}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.reserveButton}
          onPress={() => navigation.navigate('Reservation', { restaurantId })}
        >
          <Text style={styles.buttonText}>Make Reservation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.directionsButton}
          onPress={async () => {
            if (restaurant.location) {
              const { latitude, longitude } = restaurant.location;
              const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
              try {
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                  await Linking.openURL(url);
                } else {
                  Alert.alert('Error', 'Unable to open maps app');
                }
              } catch (err) {
                Alert.alert('Error', 'Could not open maps');
              }
            } else {
              Alert.alert('Error', 'Location data not available for this restaurant');
            }
          }}
          disabled={!restaurant.location}
        >
          <Ionicons name="navigate-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      {/* Debug Info (remove in production) */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>User Location: {JSON.stringify(userLocation)}</Text>
          <Text style={styles.debugText}>Restaurant Location: {JSON.stringify(restaurant.location)}</Text>
          <Text style={styles.debugText}>Address: {address}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#6D28D9',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginVertical: 10,
    textAlign: 'center',
  },
  subErrorText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#6D28D9',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    color: '#6D28D9',
    marginLeft: 5,
  },
  restaurantImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 0,
  },
  reserveButton: {
    backgroundColor: '#6D28D9',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  directionsButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  directionsButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  debugContainer: {
    margin: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
  },
});

export default RestaurantDetails;