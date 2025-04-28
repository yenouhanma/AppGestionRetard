// src/screens/Home/DashboardScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthContext';
import client from '../../api/client';
import {Text, Card, Button, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {theme} from '../../config/theme';

interface Cours {
  id: number;
  nom: string;
  description?: string;
}

export default function DashboardScreen() {
  const {user, signOut} = useAuth();
  const navigation = useNavigation();
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const {colors} = useTheme();

  const fetchCours = async () => {
    try {
      const res = await client.get('/cours');
      setCours(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des cours', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCours();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCours();
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        style={[styles.header, {backgroundColor: colors.primary}]}>
        <Icon name="account-circle" size={40} color="#fff" />
        <Text variant="titleLarge" style={styles.welcomeText}>
          Bonjour {user?.nom}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </Animatable.View>

      <View style={styles.content}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          <Icon name="book" size={20} color={colors.primary} /> Vos cours
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : cours.length === 0 ? (
          <Animatable.View animation="fadeIn" style={styles.emptyContainer}>
            <Icon name="book-remove" size={40} color="#999" />
            <Text style={styles.emptyText}>Aucun cours disponible</Text>
          </Animatable.View>
        ) : (
          <FlatList
            data={cours}
            keyExtractor={(item) => item.id.toString()}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            renderItem={({item, index}) => (
              <Animatable.View animation="fadeInUp" delay={index * 100}>
                <Card style={styles.card}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <Icon name="book-open" size={24} color={colors.primary} />
                      <Text variant="titleMedium" style={styles.coursTitle}>
                        {item.nom}
                      </Text>
                    </View>
                    {item.description && (
                      <Text style={styles.coursDescription}>
                        {item.description}
                      </Text>
                    )}
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      mode="text"
                      icon="arrow-right"
                      textColor={colors.primary}
                      onPress={() =>
                        navigation.navigate('CoursDetail', {
                          coursId: item.id,
                          coursNom: item.nom,
                        })
                      }>
                      Voir détails
                    </Button>
                  </Card.Actions>
                </Card>
              </Animatable.View>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}

        <Button
          mode="contained"
          onPress={signOut}
          style={styles.logoutButton}
          icon="logout"
          textColor="#fff"
          theme={{roundness: theme.radius.medium}}>
          Se déconnecter
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingVertical: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
    borderBottomLeftRadius: theme.radius.large,
    borderBottomRightRadius: theme.radius.large,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  welcomeText: {
    marginTop: theme.spacing.small,
    color: '#fff',
    fontWeight: 'bold',
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: theme.spacing.medium,
  },
  sectionTitle: {
    marginBottom: theme.spacing.medium,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  loader: {
    marginTop: theme.spacing.xlarge,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyText: {
    marginTop: theme.spacing.medium,
    color: theme.colors.textSecondary,
  },
  card: {
    marginBottom: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  coursTitle: {
    marginLeft: theme.spacing.small,
    color: theme.colors.text,
  },
  coursDescription: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: theme.spacing.large,
  },
  logoutButton: {
    marginTop: theme.spacing.medium,
    backgroundColor: theme.colors.secondary,
  },
});
