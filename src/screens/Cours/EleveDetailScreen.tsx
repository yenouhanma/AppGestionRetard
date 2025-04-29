// src/screens/Cours/EleveDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EleveDetailScreen() {
  const route = useRoute<any>();
  const { eleve } = route.params;

  const getEtatIcon = (etat: string) => {
    switch (etat) {
      case 'present':
        return 'check-circle';
      case 'retard':
        return 'clock-outline';
      case 'absent':
        return 'close-circle';
      default:
        return 'account-question';
    }
  };

  const getEtatColor = (etat: string) => {
    switch (etat) {
      case 'present':
        return '#2ecc71';
      case 'retard':
        return '#f1c40f';
      case 'absent':
        return '#e74c3c';
      default:
        return '#3498db';
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Icon
            name={getEtatIcon(eleve.etat)}
            size={64}
            color={getEtatColor(eleve.etat)}
            style={styles.icon}
          />
          <Text style={styles.name}>{eleve.nom} {eleve.prenom}</Text>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>État</Text>
            <Text style={[styles.value, { color: getEtatColor(eleve.etat) }]}>
              {eleve.etat.toUpperCase()}
            </Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{eleve.email || 'Non disponible'}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Heure marquée</Text>
            <Text style={styles.value}>
              {new Date(eleve.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width * 0.9,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  icon: {
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0a3d62',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBlock: {
    marginBottom: 14,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
  },
});
