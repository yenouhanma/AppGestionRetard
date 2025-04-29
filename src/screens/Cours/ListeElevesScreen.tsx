// src/screens/Cours/ListeElevesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import client from '../../api/client';
import * as Animatable from 'react-native-animatable';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Presence {
  id: number;
  eleve_id: number;
  cours_id: number;
  date_cours: string;
  etat: string;
  created_at: string;
}

export default function ListeElevesScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { coursId, coursNom, etat } = route.params;

  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await client.get(`/presences/${coursId}?date_cours=${today}&etat=${etat}`);
        setPresences(res.data);
      } catch (err: any) {
        console.error('Erreur chargement présences', err);
        setError('Erreur de chargement...');
      } finally {
        setLoading(false);
      }
    };

    fetchPresences();
  }, []);

  const getEtatIcon = (etat: string) => {
    switch (etat) {
      case 'present':
        return 'check-circle';
      case 'retard':
        return 'clock';
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

  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{etat.toUpperCase()} - {coursNom}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0a3d62" />
      ) : error !== '' ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : presences.length === 0 ? (
        <Text style={styles.emptyText}>Aucun élève trouvé.</Text>
      ) : (
        <FlatList
          data={presences}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animatable.View animation="fadeInUp" delay={index * 100}>
              <Card
                style={[styles.card, { borderLeftColor: getEtatColor(item.etat) }]}
                onPress={() =>
                navigation.navigate('EleveDetail', { eleve: item })
                }
              >
                <Card.Content style={styles.cardContent}>
                <Icon
                    name={getEtatIcon(item.etat)}
                    size={30}
                    color={getEtatColor(item.etat)}
                    style={{ marginRight: 12 }}
                />
                <View>
                    <Text style={styles.eleveName}>
                    {item.nom} {item.prenom}
                    </Text>
                    <Text style={styles.time}>
                    Marqué à {formatTime(item.created_at)}
                    </Text>
                </View>
                </Card.Content>
              </Card>
            </Animatable.View>

          )}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fc',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a3d62',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderLeftWidth: 5,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eleveName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 2,
  },
  time: {
    fontSize: 13,
    color: '#636e72',
  },
});

