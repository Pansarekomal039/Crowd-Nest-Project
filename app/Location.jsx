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
import FlatLI from '../components/FlatLI';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getFirestore, collection,query, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Location from "expo-location";
import RestList from '../app/RestList'; 
import { firestore } from '../app/firebaseConfig';
import O_Login from '../app/O_Login'; 
import { ScrollView } from "react-native-gesture-handler";
// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Drawer Navigator
const Drawer = createDrawerNavigator();

const MainScreen = ({ navigation }) => (
  <O_Login navigation={navigation} />
);
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
  const firestore = getFirestore();

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Location Permission Denied", "Please allow location access.");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
      if (reverseGeocode.length > 0) {
        const { city, region, country } = reverseGeocode[0];
        setAddress(`${city}, ${region}, ${country}`);
      }

      setLoading(false);
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(firestore, 'restaurants'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const restaurantList = [];
      querySnapshot.forEach((doc) => {
        restaurantList.push({ id: doc.id, ...doc.data() });
      });
      setRestaurants(restaurantList);
    });
    return () => unsubscribe();
  }, [user]);

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
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      image: require('../assets/images/1.jpg'),
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      image: require('../assets/images/2.jpg'),
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      image: require('../assets/images/3.jpg'),
    },
  ];

  // Render function for the horizontal FlatList
  const renderImageItem = ({ item }) => (
    <TouchableOpacity style={styles.imageItem}>
      <Image source={item.image} style={styles.horizontalImage} resizeMode="cover" />
    </TouchableOpacity>
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
            {/* Horizontal FlatList for Images */}
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
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantDetails}>Cuisine: {item.cuisine}</Text>
            <Text style={styles.restaurantDetails}>Timing: {item.timing}</Text>
            <Text style={styles.restaurantDetails}>Address: {item.address}</Text>
            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={() => navigation.navigate("Reservation", { restaurants: item })}
            >
              <Text style={styles.seeMoreButtonText}>See More</Text>
            </TouchableOpacity>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Image
              source={require("../assets/images/1.jpg")} // Default image for section
              style={styles.sectionImage}
            />
          </View>
        )}
        initialNumToRender={10}
        windowSize={21}
        maxToRenderPerBatch={10}
      />
    </View>
  );
};

// Bottom Tab Navigator with 4 screens
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Reservations") {
            iconName = focused ? "document" : "document-outline"; // Correct icon name
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline"; // Correct icon name
          } else if (route.name === "Owner Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home"
       component={RestaurantSearch} 
      options={{headerShown: false}}/>
      <Tab.Screen name="Reservations"
       component={HomeScreen} 
       options={{headerShown: false}}/>
      <Tab.Screen name="Notifications" 
      component={ProfileScreen}
      options={{headerShown: false}}/>
      <Tab.Screen name="Owner Profile" 
      component={O_Login}
      options={{headerShown: false}} />
    </Tab.Navigator>
  );
};

// Drawer Navigator with Bottom Tab Navigator as the main screen
const DrawerNav = () => {
  return (
      <Drawer.Navigator initialRouteName="Crowd-nest">
        <Drawer.Screen name="Crowd-nest" component={BottomTabNavigator} />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen name="Contact" component={ContactScreen} />
      </Drawer.Navigator>
  );
};

// Additional Drawer Screens
const AboutScreen = () => (
  <View style={styles.screenContainer}>
    <Text>About Screen</Text>
  </View>
);

const ContactScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Contact Screen</Text>
  </View>
);

const styles = StyleSheet.create({
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
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  seeMoreButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
export default DrawerNav;