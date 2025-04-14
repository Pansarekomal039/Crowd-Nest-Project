import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ReservationScreen = () => {
  const handleReserve = () => {
    alert('Your table has been reserved! We will contact you shortly.');
  };

  return (
    <View style={styles.container}>
      {/* Restaurant image */}
      <Image 
        source={require('../assets/images/1.jpg')} // Replace with your image
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Reservation message */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Please reserve your table</Text>
        <Text style={styles.subText}>We'll ensure the perfect dining experience for you</Text>
      </View>

      {/* Reserve button */}
      <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
        <Text style={styles.buttonText}>Reserve Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  reserveButton: {
    backgroundColor: '#6D28D9',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',

    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReservationScreen;