import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';

const ContactUsScreen = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log({ name, email, message });
    
    Alert.alert('Success', 'Thank you for your message! We will get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@yourapp.com?subject=App Support');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.yourapp.com');
  };

  const handleSocialMedia = (url) => {
    Linking.openURL(url);
  };

  // Get version from expoConfig instead of manifest
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.subtitle}>We'd love to hear from you!</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send us a message</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Your Message"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Contacts</Text>
        
        <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
          <Ionicons name="mail" size={24} color="#3498db" />
          <Text style={styles.contactText}>Email: crowdnest@gmail.com</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
          <Ionicons name="call" size={24} color="#3498db" />
          <Text style={styles.contactText}>Phone: +91 00000 00000</Text>
        </TouchableOpacity>
        
        {/* <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
          <Ionicons name="globe" size={24} color="#3498db" />
          <Text style={styles.contactText}>Website: www.crowdnest.com.com</Text>
        </TouchableOpacity> */}
        
        <View style={styles.socialIconsContainer}>
          <Text style={styles.socialText}>Follow us:</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={() => handleSocialMedia('https://facebook.com/yourapp')}>
              <FontAwesome name="facebook" size={24} color="#3b5998" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSocialMedia('https://twitter.com/yourapp')}>
              <FontAwesome name="twitter" size={24} color="#1da1f2" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSocialMedia('https://instagram.com/yourapp')}>
              <FontAwesome name="instagram" size={24} color="#e1306c" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>App Version: {appVersion}</Text>
        <Text style={styles.footerText}>© {new Date().getFullYear()} YourApp. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    // backgroundColor: '#6D28D9',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#6D28D9',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#34495e',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  socialText: {
    marginRight: 15,
    fontSize: 16,
    color: '#34495e',
  },
  socialIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 10,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#95a5a6',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default ContactUsScreen;