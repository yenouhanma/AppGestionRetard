// src/screens/Home/DashboardScreen.tsx
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import * as Animatable from 'react-native-animatable';

export default function DashboardScreen() {
  const {user, signOut} = useAuth();

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={800}
        style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenue {user?.nom}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </Animatable.View>

      <View style={styles.content}>
        {/* Vous pouvez ajouter d'autres éléments de dashboard ici */}
        <Text style={styles.subtitle}>Tableau de bord</Text>

        <Pressable
          style={({pressed}) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={signOut}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007AFF', // Bleu attirant
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#007AFF', // Bleu attirant
    fontWeight: '600',
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#FF9500', // Orange
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutButtonPressed: {
    backgroundColor: '#E57C00', // Orange plus foncé
    transform: [{scale: 0.98}],
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
