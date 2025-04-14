import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  Linking,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AboutScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <LinearGradient
        colors={['#6D28D9', '#8B5CF6']}
        style={styles.header}
      >
        <Image 
          source={require('../assets/images/Waiters-amico.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>About CrowdNest</Text>
        <Text style={styles.tagline}>Dining Made Smarter, Faster, Better</Text>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Features</Text>
        
        <View style={styles.featureCard}>
          <Ionicons name="time-outline" size={30} color="#6D28D9" style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Save Your Time</Text>
            <Text style={styles.featureDescription}>
              No more waiting in long queues. CrowdNest helps you find available tables instantly, 
              saving you precious time for what really matters - enjoying your meal.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="alarm-outline" size={30} color="#6D28D9" style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Smart Table Estimation</Text>
            <Text style={styles.featureDescription}>
              Get accurate wait time estimates based on real-time data. Our algorithm calculates 
              how soon you'll get a table so you can plan accordingly.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="location-outline" size={30} color="#6D28D9" style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Discover Nearby Gems</Text>
            <Text style={styles.featureDescription}>
              Find the best restaurants near you with our location-based search. We show you 
              dining options based on your current location and preferences.
            </Text>
          </View>
        </View>
      </View>

      {/* How It Works Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Search restaurants near you</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Check real-time availability</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Get your estimated wait time</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>Reserve and enjoy your meal!</Text>
          </View>
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.contactText}>
          Have questions or feedback? We'd love to hear from you!
        </Text>
        
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => Linking.openURL('mailto:support@crowdnest.com')}
        >
          <Ionicons name="mail-outline" size={20} color="white" />
          <Text style={styles.contactButtonText}>Email Support</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 CrowdNest</Text>
        <Text style={styles.footerText}>Version 1.0.0</Text>
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
    padding: 30,
    alignItems: 'center',
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F3FF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6D28D9',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  stepContainer: {
    backgroundColor: '#F5F3FF',
    borderRadius: 15,
    padding: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    backgroundColor: '#6D28D9',
    color: 'white',
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 15,
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  contactText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  contactButton: {
    backgroundColor: '#6D28D9',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default AboutScreen;