// src/screens/Eleves/StatsEleveScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useRoute} from '@react-navigation/native';
import client from '../../api/client';
import {Card, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

interface Stats {
  present: number;
  retard: number;
  absent: number;
}

export default function StatsEleveScreen() {
  const route = useRoute<any>();
  const {eleve_id, nom, prenom} = route.params;
  const {colors} = useTheme();

  const [stats, setStats] = useState<Stats>({present: 0, retard: 0, absent: 0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log(`Fetching stats for eleve_id: ${eleve_id}`);
        const res = await client.get(`/presences/eleve/${eleve_id}/stats`);
        console.log('Full API response:', res);
        console.log('Response data:', res.data);
        if (res.data) {
          setStats(res.data);
        } else {
          setError('Données non disponibles');
          console.warn('Réponse API vide');
        }
      } catch (err) {
        console.error('Détails erreur:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [eleve_id]);

  const getCardStyle = (color: string) => ({
    backgroundColor: color,
    borderRadius: 12,
    paddingVertical: 25,
    marginBottom: 16,
    elevation: 3,
  });

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Animatable.View animation="fadeInDown">
        <Text
          variant="titleLarge"
          style={[styles.title, {color: colors.primary}]}>
          Historique de {prenom} {nom}
        </Text>
      </Animatable.View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : error ? (
        <Text style={[styles.errorText, {color: colors.error}]}>{error}</Text>
      ) : (
        <View style={styles.cardsContainer}>
          <Animatable.View animation="fadeInUp" delay={150}>
            <Card style={getCardStyle('#2ecc71')}>
              <Card.Content style={styles.cardContent}>
                <Icon name="check-circle" size={40} color="#fff" />
                <Text style={styles.cardText}>Présents: {stats.present}</Text>
              </Card.Content>
            </Card>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={300}>
            <Card style={getCardStyle('#f1c40f')}>
              <Card.Content style={styles.cardContent}>
                <Icon name="clock" size={40} color="#fff" />
                <Text style={styles.cardText}>Retards: {stats.retard}</Text>
              </Card.Content>
            </Card>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={450}>
            <Card style={getCardStyle('#e74c3c')}>
              <Card.Content style={styles.cardContent}>
                <Icon name="close-circle" size={40} color="#fff" />
                <Text style={styles.cardText}>Absents: {stats.absent}</Text>
              </Card.Content>
            </Card>
          </Animatable.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    width: '100%',
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
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
  },
});
