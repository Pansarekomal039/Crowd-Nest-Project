import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  getFirestore, 
  doc, 
  getDoc,
  collection,
  query,
  where,
  getDocs 
} from 'firebase/firestore';
import { PageLogo } from '../components/style';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

const RestD = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const firestore = getFirestore();
  
  // useEffect(() => {
  //   const fetchRestaurant = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
        
  //       if (!restaurantId) {
  //         throw new Error('No restaurant ID provided');
  //       }
  
  //       // Always fetch by document ID
  //       const docRef = doc(firestore, 'restaurants', restaurantId);
  //       const docSnap = await getDoc(docRef);
  
  //       if (docSnap.exists()) {
  //         const data = docSnap.data();
  //         // Ensure location is properly formatted
  //         const locationData = data.location 
  //           ? {
  //               latitude: data.location.latitude,
  //               longitude: data.location.longitude
  //             }
  //           : null;
            
  //         setRestaurant({ 
  //           id: docSnap.id, 
  //           ...data,
  //           location: locationData
  //         });
  //       } else {
  //         throw new Error('Restaurant not found in database');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching restaurant:', error);
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchRestaurant();
  // }, [restaurantId]);

  

  // Fetch restaurant data
  // Fetch restaurant data
useEffect(() => {
  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!restaurantId) {
        throw new Error('No restaurant ID provided');
      }

      // ====== ADD DEBUG LOGS HERE ======
      console.log("Fetching restaurant with ID:", restaurantId);
      const docRef = doc(firestore, 'restaurants', restaurantId);
      console.log("Document path:", docRef.path);

      // First try: Direct document fetch
      const docSnap = await getDoc(docRef);
      console.log("Document exists?", docSnap.exists());

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Retrieved data:", data); // Log the complete restaurant data
        
        const locationData = data.location 
          ? {
              latitude: Number(data.location.latitude),
              longitude: Number(data.location.longitude)
            }
          : null;
        
        console.log("Formatted location data:", locationData); // Add this to check location
        
        setRestaurant({ 
          id: docSnap.id, 
          ...data,
          location: locationData
        });
        return;
      }
      // ====== END OF DEBUG LOGS ======

      // Second try: Query by custom ID field
      const q = query(
        collection(firestore, 'restaurants'),
        where('id', '==', restaurantId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        console.log("Fallback query data:", data); // Add this for fallback cases
        
        const locationData = data.location 
          ? {
              latitude: Number(data.location.latitude),
              longitude: Number(data.location.longitude)
            }
          : null;
        
        setRestaurant({ 
          id: doc.id, 
          ...data,
          location: locationData
        });
      } else {
        throw new Error('Restaurant not found in database');
      }

    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchRestaurant();
}, [restaurantId]);
  // Get user location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      } catch (err) {
        console.error('Error getting location:', err);
        setError('Failed to get location');
      }
    })();
  }, []);

  // Calculate distance when both locations are available
  useEffect(() => {
    if (restaurant?.location && userLocation) {
      console.log("Calculating distance between:", {
          userLocation,
          restaurantLocation: restaurant.location
      });
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6D28D9" />
        <Text>Loading restaurant details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text>Restaurant data not available</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleGetDirections = async () => {
    if (!restaurant?.location || 
        !restaurant.location.latitude || 
        !restaurant.location.longitude) {
      Alert.alert('Error', 'Location data not available for this restaurant');
      return;
    }
  
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
      console.error('Error opening maps:', err);
      Alert.alert('Error', 'Could not open maps');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{restaurant.name}</Text>
        {distance !== null ? (
          <View style={styles.distanceContainer}>
            <Ionicons name="location-outline" size={16} color="#6D28D9" />
            <Text style={styles.distanceText}>{distance} km away</Text>
          </View>
        ) : (
          <Text style={styles.distanceText}>Distance unavailable</Text>
        )}
      </View>

      {restaurant.image ? (
  <Image 
    source={{ uri: restaurant.image }} 
    style={styles.restaurantImage}
    resizeMode="cover"
    onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
  />
) : (
  <View style={styles.imagePlaceholder}>
    <PageLogo resizeMode="cover" source={require("../assets/images/Waiters-amico.png")} />
  </View>
)}
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="restaurant-outline" size={20} color="#6D28D9" />
          <Text style={styles.detailText}>{restaurant.cuisine} Cuisine</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={20} color="#6D28D9" />
          <Text style={styles.detailText}>Open: {restaurant.timing}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color="#6D28D9" />
          <Text style={styles.detailText}>{restaurant.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={20} color="#6D28D9" />
          <Text style={styles.detailText}>Capacity: {restaurant.capacity}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => navigation.navigate('Reservation', { restaurantId })}
        >
          <Text style={styles.buttonText}>Make Reservation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleGetDirections}
          disabled={!restaurant.location}
        >
          <Ionicons name="navigate-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  name: {
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
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#6D28D9',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RestD;