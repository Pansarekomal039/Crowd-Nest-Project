import React, {useEffect, useState} from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {
  StyledContainer,
  PageTitle,
  Line,
  StyledButton,
  ButtonText,
  Colors
} from '../components/style';
import { useNavigation, useRouter } from 'expo-router';

const { primary } = Colors;

// First define the component
const RestList = () => {
  const navigation = useNavigation();
  const route = useRouter();
  const [restaurants, setRestaurants] = React.useState([]);

  useEffect(() => {
    if (route?.params?.newRestaurant) {
      setRestaurants(prevRestaurants => [
        ...prevRestaurants,
        {
          id: Date.now().toString(),
          ...route.params.newRestaurant
        }
      ]);
    }
  }, [route?.params?.newRestaurant]);

  

  return (
    <StyledContainer>
      <PageTitle> Restaurants List</PageTitle>
      <Line />
      <View style= {styles.Container}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.restaurantDetails}>Cuisine: {item.cuisine}</Text>
            <Text style={styles.restaurantDetails}>Capacity: {item.no_of_guest}</Text>
            <Text style={styles.restaurantDetails}>
              Timing: {formatTime(item.openTime)} - {formatTime(item.closeTime)}
            </Text>
          </View>
        )}
      />
       </View>
      <StyledButton onPress={() => navigation.navigate('RestProfile')}>
        <ButtonText>Add New Restaurant</ButtonText>
      </StyledButton>
    </StyledContainer>
  );
};
  

RestList.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      newRestaurant: PropTypes.object
    })
  })
};

const styles = StyleSheet.create({
  Container: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  restaurantItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
},
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});

export default RestList;