// src/screens/Cours/CoursDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import client from '../../api/client';
import { Button, Snackbar } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Eleve {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export default function CoursDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { coursId, coursNom } = route.params;

  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        const res = await client.get(`/cours/${coursId}/eleves`);
        setEleves(res.data);
      } catch (err) {
        console.error('Erreur chargement élèves', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEleves();
  }, []);

  const marquerPresence = async (
    eleveId: number,
    etat: 'present' | 'retard' | 'absent',
  ) => {
    try {
      await client.post('/presences', {
        eleve_id: eleveId,
        cours_id: coursId,
        date_cours: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        etat,
      });
      setSnackbarMessage(`Présence "${etat}" enregistrée !`);
      setSnackbarVisible(true);
    } catch (err) {
      console.error('Erreur marquage présence', err);
      setSnackbarMessage('Erreur enregistrement présence');
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cours : {coursNom}</Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Stats', { coursId, coursNom })}
        style={{ marginTop: 20 }}>
        Voir Statistiques
      </Button>

      {loading ? (
        <ActivityIndicator size="large" color="#0a3d62" />
      ) : (
        <FlatList
          data={eleves}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item, index }) => (
            <Animatable.View
              animation="fadeInUp"
              delay={index * 100}
              style={styles.eleveCard}>
              <Text style={styles.eleveName}>
                {item.nom} {item.prenom}
              </Text>
              <View style={styles.actions}>
                <Button
                  mode="contained"
                  compact
                  style={[styles.button, { backgroundColor: '#2ecc71' }]}
                  icon="check-circle"
                  onPress={() => marquerPresence(item.id, 'present')}>
                  Présent
                </Button>
                <Button
                  mode="contained"
                  compact
                  style={[styles.button, { backgroundColor: '#f1c40f' }]}
                  icon="clock"
                  onPress={() => marquerPresence(item.id, 'retard')}>
                  Retard
                </Button>
                <Button
                  mode="contained"
                  compact
                  style={[styles.button, { backgroundColor: '#e74c3c' }]}
                  icon="close-circle"
                  onPress={() => marquerPresence(item.id, 'absent')}>
                  Absent
                </Button>
              </View>
            </Animatable.View>
          )}
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={{ backgroundColor: '#0a3d62' }}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fc',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a3d62',
    marginBottom: 15,
    textAlign: 'center',
  },
  eleveCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 12,
  },
  eleveName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#34495e',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginHorizontal: 2,
    borderRadius: 6,
  },
});
