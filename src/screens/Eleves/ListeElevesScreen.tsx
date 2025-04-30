// src/screens/Cours/ListeElevesScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import client from '../../api/client';
import * as Animatable from 'react-native-animatable';
import {Card, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../config/theme';

interface Presence {
  id: number;
  eleve_id: number;
  cours_id: number;
  date_cours: string;
  etat: string;
  created_at: string;
  nom: string;
  prenom: string;
  classe: string;
  email?: string;
}

export default function ListeElevesScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {coursId, coursNom, etat, isGlobal} = route.params;

  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        let endpoint;
        if (isGlobal) {
          endpoint = `/presences/${coursId}/global?etat=${etat}`;
        } else {
          const today = new Date().toISOString().split('T')[0];
          endpoint = `/presences/${coursId}?date_cours=${today}&etat=${etat}`;
        }

        const res = await client.get(endpoint);
        setPresences(res.data);
      } catch (err: any) {
        console.error('Erreur chargement présences', err);
        setError(err.response?.data?.message || 'Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchPresences();
  }, [coursId, etat, isGlobal]);

  const getEtatIcon = () => {
    switch (etat) {
      case 'present':
        return 'check-circle';
      case 'retard':
        return 'clock-alert';
      case 'absent':
        return 'close-circle';
      default:
        return 'account-question';
    }
  };

  const getEtatColor = () => {
    switch (etat) {
      case 'present':
        return '#20CE5A';
      case 'retard':
        return '#FFA500';
      case 'absent':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getHeaderTitle = () => {
    const etatText =
      etat === 'present'
      ? 'Présents' : etat === 'retard' ? 'En retard' : 'Absents';
    return `${etatText} - ${coursNom}`;
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text
          variant="titleLarge"
          style={[styles.title, {color: getEtatColor()}]}>
          <Icon name={getEtatIcon()} size={24} /> {getHeaderTitle()}
        </Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          {isGlobal ? 'Toutes périodes' : "Aujourd'hui"}
        </Text>
      </Animatable.View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : error ? (
        <Animatable.View
          animation="shake"
          style={[
            styles.errorContainer,
            {backgroundColor: colors.errorContainer},
          ]}>
          <Icon name="alert-circle" size={24} color={colors.error} />
          <Text style={[styles.errorText, {color: colors.error}]}>{error}</Text>
        </Animatable.View>
      ) : presences.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="account-group" size={40} color={colors.textSecondary} />
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            Aucun élève trouvé
          </Text>
        </View>
      ) : (
        <FlatList
          data={presences}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({item, index}) => (
            <Animatable.View animation="fadeInUp" delay={index * 100}>
              <Card
                style={[
                  styles.card,
                  {
                    borderLeftColor: getEtatColor(),
                    backgroundColor: colors.surface,
                  },
                ]}
                onPress={() =>
                  navigation.navigate('EleveDetail', {
                      eleve: {
                      id: item.eleve_id,
                      nom: item.nom,
                      prenom: item.prenom,
                      classe: item.classe,
                      etat: item.etat,
                      created_at: item.created_at,
                      },
                  })
                }>
                <Card.Content style={styles.cardContent}>
                  <Icon
                    name={getEtatIcon()}
                    size={30}
                    color={getEtatColor()}
                    style={styles.icon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={[styles.eleveName, {color: colors.text}]}>
                      {item.prenom} {item.nom}
                    </Text>
                    <Text style={[styles.time, {color: colors.textSecondary}]}>
                      {isGlobal ? 'Dernière présence' : 'Marqué le'} {formatDate(item.created_at)}
                    </Text>
                    {item.email && (
                      <Text
                        style={[styles.email, {color: colors.textSecondary}]}>
                        {item.email}
                      </Text>
                    )}
                  </View>
                </Card.Content>
              </Card>
            </Animatable.View>
          )}
        />
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
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
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
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xlarge,
  },
  emptyText: {
    marginTop: theme.spacing.medium,
    fontSize: 16,
  },
  card: {
    marginBottom: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    borderLeftWidth: 5,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.medium,
  },
  icon: {
    marginRight: theme.spacing.medium,
  },
  textContainer: {
    flex: 1,
  },
  eleveName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.small / 2,
  },
  time: {
    fontSize: 14,
  },
  email: {
    fontSize: 14,
    marginTop: theme.spacing.small / 2,
  },
  listContent: {
    paddingBottom: theme.spacing.xlarge,
  },
});
