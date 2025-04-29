// src/screens/Cours/StatsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import client from '../../api/client';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Stats {
  present: number;
  retard: number;
  absent: number;
}

export default function StatsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { coursId, coursNom } = route.params;

  const [stats, setStats] = useState<Stats>({ present: 0, retard: 0, absent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const res = await client.get(`/presences/${coursId}/stats?date_cours=${today}`);
        setStats(res.data);
      } catch (err: any) {
        console.error('Erreur chargement stats', err);
        setError('Impossible de charger les statistiques.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques du jour</Text>
      <Text style={styles.subtitle}>{coursNom}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0a3d62" />
      ) : error !== '' ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.cardsContainer}>
        
        <Card
            style={[styles.card, { backgroundColor: '#2ecc71' }]}
            onPress={() => navigation.navigate('ListeEleves', { coursId, coursNom, etat: 'present' })}
        >
            <Card.Content style={styles.cardContent}>
            <Icon name="check-circle" size={40} color="#fff" />
            <Text style={styles.cardText}>Présents : {stats.present}</Text>
            </Card.Content>
        </Card>

        <Card
            style={[styles.card, { backgroundColor: '#f1c40f' }]}
            onPress={() => navigation.navigate('ListeEleves', { coursId, coursNom, etat: 'retard' })}
        >
            <Card.Content style={styles.cardContent}>
            <Icon name="clock" size={40} color="#fff" />
            <Text style={styles.cardText}>Retards: {stats.retard}</Text>
            </Card.Content>
        </Card>

        <Card
            style={[styles.card, { backgroundColor: '#e74c3c' }]}
            onPress={() => navigation.navigate('ListeEleves', { coursId, coursNom, etat: 'absent' })}
        >
            <Card.Content style={styles.cardContent}>
            <Icon name="close-circle" size={40} color="#fff" />
            <Text style={styles.cardText}>Absents: {stats.absent}</Text>
            </Card.Content>
        </Card>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fc',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a3d62',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    width: '100%',
    gap: 16,
    marginTop: 10,
  },
  card: {
    borderRadius: 12,
    paddingVertical: 18,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: '#e74c3c',
    marginTop: 30,
    fontSize: 16,
    textAlign: 'center',
  },
});
