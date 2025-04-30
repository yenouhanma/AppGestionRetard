// src/screens/Cours/CoursDetailScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import client from '../../api/client';
import {
  Button,
  Snackbar,
  Text,
  Card,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../config/theme';

interface Eleve {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export default function CoursDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {coursId, coursNom} = route.params;

  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState(colors.primary);

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        const res = await client.get(`/cours/${coursId}/eleves`);
        setEleves(res.data);
      } catch (err) {
        console.error('Erreur chargement élèves', err);
        setSnackbarMessage('Erreur lors du chargement des élèves');
        setSnackbarColor(colors.error);
        setSnackbarVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEleves();
  }, [coursId]);

  const marquerPresence = async (
    eleveId: number,
    etat: 'present' | 'retard' | 'absent',
  ) => {
    try {
      await client.post('/presences', {
        eleve_id: eleveId,
        cours_id: coursId,
        date_cours: new Date().toISOString().split('T')[0],
        etat,
      });

      setSnackbarMessage(
        `Présence "${etat}" enregistrée pour ${
          eleves.find(e => e.id === eleveId)?.prenom
        }`,
      );
      setSnackbarColor(getStatusColor(etat));
      setSnackbarVisible(true);
    } catch (err) {
      console.error('Erreur marquage présence', err);
      setSnackbarMessage("Erreur lors de l'enregistrement");
      setSnackbarColor(colors.error);
      setSnackbarVisible(true);
    }
  };

  const getStatusColor = (etat: string) => {
    switch (etat) {
      case 'present':
        return '#24CF5D';
      case 'retard':
        return '#FFA500';
      case 'absent':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getStatusIcon = (etat: string) => {
    switch (etat) {
      case 'present':
        return 'check-circle';
      case 'retard':
        return 'clock-alert';
      case 'absent':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Animatable.View animation="fadeInDown">
        <Text
          variant="titleLarge"
          style={[styles.title, {color: colors.primary}]}>
          <Icon name="book-open" size={24} /> {coursNom}
        </Text>
      </Animatable.View>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Stats', {coursId, coursNom})}
        icon="chart-bar"
        style={styles.statsButton}
        labelStyle={styles.buttonLabel}
        theme={{roundness: theme.radius.medium}}>
        Voir les statistiques
      </Button>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={eleves}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({item, index}) => (
            <Animatable.View animation="fadeInUp" delay={index * 100}>
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.eleveInfo}>
                    <Icon name="account" size={24} color={colors.primary} />
                    <Text variant="titleMedium" style={styles.eleveName}>
                      {item.prenom} {item.nom}
                    </Text>
                  </View>
                  <Text
                    style={[styles.eleveEmail, {color: colors.textSecondary}]}>
                    {item.email}
                  </Text>

                  <View style={styles.actions}>
                    {['present', 'retard', 'absent'].map((etat) => (
                      <Button
                        key={etat}
                        mode="contained"
                        compact
                        onPress={() => marquerPresence(item.id, etat as any)}
                        style={[
                          styles.statusButton,
                          {backgroundColor: getStatusColor(etat)},
                        ]}
                        icon={getStatusIcon(etat)}
                        labelStyle={styles.buttonLabel}
                        theme={{roundness: theme.radius.small}}>
                        {etat.charAt(0).toUpperCase() + etat.slice(1)}
                      </Button>
                    ))}
                  </View>
                </Card.Content>
              </Card>
            </Animatable.View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon
                name="account-group"
                size={40}
                color={colors.textSecondary}
              />
              <Text style={[styles.emptyText, {color: colors.textSecondary }]}>
                Aucun élève inscrit à ce cours
              </Text>
            </View>
          }
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={{backgroundColor: snackbarColor}}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}>
        <Text style={{color: '#fff'}}>{snackbarMessage}</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.medium,
  },
  title: {
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  statsButton: {
    marginVertical: theme.spacing.medium,
    backgroundColor: theme.colors.secondary,
  },
  card: {
    marginBottom: theme.spacing.medium,
    borderRadius: theme.radius.medium,
  },
  cardContent: {
    paddingVertical: theme.spacing.large,
  },
  eleveInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  eleveName: {
    marginLeft: theme.spacing.small,
  },
  eleveEmail: {
    fontSize: 14,
    marginBottom: theme.spacing.medium,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.small,
  },
  statusButton: {
    flex: 1,
    marginHorizontal: theme.spacing.small / 2,
  },
  buttonLabel: {
    color: '#fff',
  },
  loader: {
    marginTop: theme.spacing.xlarge,
  },
  listContent: {
    paddingBottom: theme.spacing.xlarge,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xlarge,
  },
  emptyText: {
    marginTop: theme.spacing.medium,
    fontSize: 16,
  },
});
