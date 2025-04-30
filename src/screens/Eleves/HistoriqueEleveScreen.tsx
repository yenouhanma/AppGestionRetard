// src/screens/Eleve/HistoriqueEleveScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import client from '../../api/client';
import {Card} from 'react-native-paper';

export default function HistoriqueEleveScreen() {
  const route = useRoute<any>();
  const {eleve_id, nom, prenom, etat} = route.params;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        const query = etat ? `?etat=${etat}` : '';
        const res = await client.get(`/presences/eleve/${eleve_id}${query}`);
        setData(res.data);
        console.log('Historique reçu :', res.data);
      } catch (err) {
        console.error('Erreur chargement historique', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPresences();
  }, []);

  const renderItem = ({item}: any) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.course}>{item.cours_nom}</Text>
        <Text style={styles.date}>
          {item.date_cours}
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <Text style={[styles.status, getStatusStyle(item.etat)]}>État : {item.etat.toUpperCase()}</Text>
      </Card.Content>
    </Card>
  );

  const getStatusStyle = (etat: string) => {
    switch (etat) {
      case 'present':
        return {color: '#2ecc71'};
      case 'retard':
        return {color: '#f1c40f'};
      case 'absent':
        return {color: '#e74c3c'};
      default:
        return {color: '#7f8c8d'};
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Historique de {prenom} {nom}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0a3d62" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 60}}
        />
      )}
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0a3d62',
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  course: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 6,
  },
  status: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
  },
});
