import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  ActivityIndicator, 
  Alert,
  StyleSheet,
  StatusBar,
  FlatList,
  SectionList,
  Image,
  TouchableOpacity  
} from "react-native";
import {
  Line,
  Colors,
} from '../components/style';
const { brand, darkLight, primary } = Colors;
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { getFirestore, collection,query, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Location from "expo-location";
import { DrawerItemList, DrawerContentScrollView } from "@react-navigation/drawer";
import RestList from '../app/RestList'; 
import O_Login from '../app/O_Login'; 
import AboutScreen from "../app/About";
import ContactUsScreen from "../app/Contact";
import ReservationScreen from "../app/restres";
const Tab = createBottomTabNavigator();

// Drawer Navigator
const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};
// const MainScreen = ({ navigation }) => (
//   <O_Login navigation={navigation} />
// );
// Placeholder components for the 4 screens
const HomeScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Home Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Profile Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Settings Screen</Text>
  </View>
);

const groupRestByCuisine = (restaurants) => {
  const grouped = {};
  restaurants.forEach((restaurants) => {
    if(!grouped[restaurants.cuisine]){
      grouped[restaurants.cuisine]= [];
    }
    grouped[restaurants.cuisine].push(restaurants);
  });
  return Object.keys(grouped).map((cuisine) =>({
    title: cuisine,
    data: grouped[cuisine],
  }));
};

const RestaurantSearch = ({ navigation }) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const Auth = getAuth();
  const user = Auth.currentUser;
  const firestore = getFirestore(); // This returns the firestore object

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Location Permission Denied", "Please allow location access.");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({ 
        accuracy:Location.Accuracy.High,
      });
      const reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
      if (reverseGeocode.length > 0) {
        const { city, region, country, street, name, postalCode } = reverseGeocode[0];
        const detailedAddress = `${street || name}, ${city}, ${region}, ${postalCode}, ${country}`;
        setAddress(detailedAddress)
      }

      setLoading(false);
    };

    getLocation();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "restaurants"),
      (querySnapshot) => {
        const restaurantList = [];
        querySnapshot.forEach((doc) => {
          console.log("Document ID:", doc.id); // Should show iVV76l3g3oByQSWTELg1
          console.log("Custom ID field:", doc.data().id); // Should show 1742615131701
          restaurantList.push({ 
            id: doc.id, // Using Firestore document ID
            ...doc.data() 
          });
        });
        setRestaurants(restaurantList);
      }
    );
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  const groupedRest = groupRestByCuisine(restaurants);

  // Dummy data for horizontal images (same as in FlatLI)
  const images = [
    {
      id: '1',
      image: require('../assets/images/home meal.jpg'),
      cuisine:"Punjabi",
    },
    {
      id: '2',
      image: require('../assets/images/Maharashtra.jpg'),
      cuisine:"Maharashtrian",
    },
    {
      id: '3',
      image: require('../assets/images/SouthIndian.jpg'),
      cuisine:"South Indian",
    },
    {
      id: '4',
      image: require('../assets/images/EastIndian.jpg'),
      cuisine:"East Indian",
    },
    {
      id: '5',
      image: require('../assets/images/Chinese.jpg'),
      cuisine:"Chinese",
    },
    {
      id: '6',
      image: require('../assets/images/Rajsthani.jpg'),
      cuisine:"Rajasthani",
    },
    {
      id: '7',
      image: require('../assets/images/Gujarati.jpg'),
      cuisine:"Gujrati",
    },

  ];

  const renderImageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageItem}
      onPress={() => navigation.navigate("Cuisine", { cuisine: item.cuisine, Auth, firestore })}
    >
      <Image source={item.image} style={styles.horizontalImage} resizeMode="cover" />
      <Text style={styles.cuisineText}>{item.cuisine}</Text>
    </TouchableOpacity>
  );

  const renderRestaurantItem = ({ item }) => (
    <View style={styles.restaurantItem}>
      {item.image && typeof item.image === 'string' ? (
        <Image 
          source={{ uri: item.image }} 
          style={styles.restaurantImage} 
          onError={() => console.log('Failed to load image')}
          defaultSource={require("../assets/images/Waiters-amico.png")} 
        />
      ) : (
        <View style={[styles.restaurantImage, {justifyContent: 'center', alignItems: 'center'}]}>
          <Ionicons name="restaurant-outline" size={40} color="#000" />
        </View>
      )}
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantDetails}>Cuisine: {item.cuisine}</Text>
      <Text style={styles.restaurantDetails}>Timing: {item.timing}</Text>
      <Text style={styles.restaurantDetails}>Address: {item.address}</Text>
      <TouchableOpacity
        style={styles.seeMoreButton}
        onPress={() => navigation.navigate("RestD", { 
          restaurantId: item.id // Using Firestore document ID
        })}
      >
        <Text style={styles.seeMoreButtonText}>See More</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={groupedRest}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text style={styles.locationText}>
              📍 {address || "Fetching location..."}
            </Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for restaurants..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        }
        renderItem={renderRestaurantItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
      />
    </View>
  );
};


const Cuisine = ({ route, navigation }) => {
  const { cuisine,Auth,firestore } = route.params; 
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (!Auth.currentUser) return;
    const q = query(collection(firestore, "restaurants"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const restaurantList = [];
      querySnapshot.forEach((doc) => {
        restaurantList.push({ id: doc.id, ...doc.data() });
      });
      // Filter restaurants by cuisine
      const filteredRestaurants = restaurantList.filter(
        (restaurant) => restaurant.cuisine === cuisine
      );
      setRestaurants(filteredRestaurants);
    });
    return () => unsubscribe();
  }, [cuisine]);

  return (
    <View style={styles.container}>
      <Text style={styles.cuisineHeader}>{cuisine} Restaurants</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantDetails}>Cuisine: {item.cuisine}</Text>
            <Text style={styles.restaurantDetails}>Timing: {item.timing}</Text>
            <Text style={styles.restaurantDetails}>Address: {item.address}</Text>
          </View>
        
        )}
      />
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Reservations") {
            iconName = focused ? "document" : "document-outline";
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline"; 
          } else if (route.name === "Owner Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Cuisine") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6D28D9",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home"
       component={RestaurantSearch} 
      options={{headerShown: false}}/>
      <Tab.Screen name="Reservations"
       component={ReservationScreen} 
       options={{headerShown: false}}/>
      <Tab.Screen name="Notifications" 
      component={ProfileScreen}
      options={{headerShown: false}}/>
      <Tab.Screen name="Owner Profile" 
      component={O_Login}
      options={{headerShown: false}} />
      <Tab.Screen name="Cuisine"
       component={Cuisine} 
      options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

// Drawer Navigator with Bottom Tab Navigator as the main screen
const DrawerNav = () => {
  return (
    <Drawer.Navigator
    initialRouteName="Crowd-nest"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
    drawerActiveTintColor: "#6D28D9", // Active item text color
    drawerInactiveTintColor: "#333", // Inactive item text color
    drawerActiveBackgroundColor: "#EDE9FE", // Active item background color
    drawerInactiveBackgroundColor: "#FFF", // Inactive item background color
    drawerItemStyle: styles.drawerItem, // Custom style for drawer items
    drawerLabelStyle: styles.drawerLabel, // Custom style for drawer labels
  }}
>        
        <Drawer.Screen name="Crowd-nest" component={BottomTabNavigator} />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen name="Contact" component={ContactUsScreen} />
      </Drawer.Navigator>
  );
};

// Additional Drawer Screens
// const AboutScreen = () => (
//   <View style={styles.screenContainer}>
//     <Text>About Screen</Text>
//   </View>
// );

const ContactScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Contact Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  horizontalList: {
    paddingVertical: 10,
    marginBottom:20,
  },
  imageItem: {
    height: 150,
    width: 200,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  horizontalImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  restaurantItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  restaurantImage: {
    borderRadius: 5,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  restaurantDetails: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  seeMoreButton: {
    backgroundColor: "#6D28D9",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  seeMoreButtonText: {
    color: "white",
    // fontWeight: "bold",
   
  },
  // drawerHeader: {
  //   padding: 20,
  //   backgroundColor: "#6D28D9", // Header background color
  // },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF", // Header text color
  },
  drawerItem: {
    borderRadius: 8, 
    marginHorizontal: 10,
    marginVertical: 5,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});
export default DrawerNav;