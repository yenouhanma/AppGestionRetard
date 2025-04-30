// src/screens/Cours/StatsScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import client from '../../api/client';
import {Card, Text, Switch, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {theme} from '../../config/theme';

interface Stats {
  present: number;
  retard: number;
  absent: number;
}

export default function StatsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {coursId, coursNom} = route.params;

  const [stats, setStats] = useState<Stats>({present: 0, retard: 0, absent: 0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [global, setGlobal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const endpoint = global
          ? `/presences/${coursId}/stats-global`
          : `/presences/${coursId}/stats?date_cours=${
              new Date().toISOString().split('T')[0]
            }`;

        const res = await client.get(endpoint);
        setStats(res.data);
      } catch (err) {
        console.error('Erreur chargement stats', err);
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [global]);

  const navigateToList = (etat: 'present' | 'retard' | 'absent') => {
    navigation.navigate('ListeEleves', {coursId, coursNom, etat, isGlobal: global});
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text
          variant="titleLarge"
          style={[styles.title, {color: colors.primary}]}>
          Statistiques {global ? 'globales' : 'du jour'}
        </Text>
        <Text
          variant="titleMedium"
          style={[styles.subtitle, {color: colors.text}]}>
          {coursNom}
        </Text>
      </Animatable.View>

      <View style={[styles.switchContainer, {backgroundColor: colors.surface}]}>
        <Text style={[styles.switchLabel, {color: colors.text}]}>
          <Icon name="calendar" size={18} /> Période :
        </Text>
        <View style={styles.switchWrapper}>
          <Text style={[styles.switchText, !global && styles.switchTextActive]}>
            Aujourd'hui
          </Text>
          <Switch
            value={global}
            onValueChange={setGlobal}
            color={colors.primary}
          />
          <Text style={[styles.switchText, global && styles.switchTextActive]}>
            Global
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : error ? (
        <Animatable.View
          animation="shake"
          style={[styles.errorContainer, {backgroundColor: colors.errorContainer}]}>
          <Icon name="alert-circle" size={24} color={colors.error} />
          <Text style={[styles.errorText, {color: colors.error}]}>{error}</Text>
        </Animatable.View>
      ) : (
        <View style={styles.cardsContainer}>
          {/* Carte Présents - Agrandie */}
          <Animatable.View animation="fadeInUp" delay={150}>
            <Card
              style={[styles.card, {backgroundColor: '#2ecc71'}]}
              onPress={() => navigateToList('present')}>
              <Card.Content style={styles.cardContent}>
                <Icon name="check-circle" size={40} color="#fff" />
                <Text style={styles.cardText}>Présents: {stats.present}</Text>
              </Card.Content>
            </Card>
          </Animatable.View>

          {/* Carte Retards - Agrandie */}
          <Animatable.View animation="fadeInUp" delay={300}>
            <Card
              style={[styles.card, {backgroundColor: '#f1c40f'}]}
              onPress={() => navigateToList('retard')}>
              <Card.Content style={styles.cardContent}>
                <Icon name="clock" size={40} color="#fff" />
                <Text style={styles.cardText}>Retards: {stats.retard}</Text>
              </Card.Content>
            </Card>
          </Animatable.View>

          {/* Carte Absents - Agrandie */}
          <Animatable.View animation="fadeInUp" delay={450}>
            <Card
              style={[styles.card, {backgroundColor: '#e74c3c'}]}
              onPress={() => navigateToList('absent')}>
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
    padding: theme.spacing.medium,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    opacity: 0.8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    marginBottom: theme.spacing.medium,
    elevation: 2,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchText: {
    fontSize: 14,
    opacity: 0.6,
    marginHorizontal: theme.spacing.small,
  },
  switchTextActive: {
    opacity: 1,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  cardsContainer: {
    gap: 20, // Espacement augmenté entre les cartes
    marginBottom: theme.spacing.medium,
  },
  card: {
    borderRadius: 12,
    paddingVertical: 25, // Hauteur augmentée
    elevation: 3,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    marginTop: 12,
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  loader: {
    marginTop: theme.spacing.xlarge,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    marginTop: theme.spacing.large,
  },
  errorText: {
    marginLeft: theme.spacing.small,
  },
});
