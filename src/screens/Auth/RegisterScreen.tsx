import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useForm} from 'react-hook-form';
import {Text, TouchableRipple} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {PasswordInputField} from '../../components/common/PasswordInputField';
import client from '../../api/client';
import {InputField} from '../../components/common/InputField';
import {theme} from '../../config/theme';

type FormData = {
  nom: string;
  email: string;
  mot_de_passe: string;
  confirmer_mot_de_passe: string;
};

export default function RegisterScreen() {
  const {control, handleSubmit, formState, watch} = useForm<FormData>();
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const onSubmit = async (data: FormData) => {
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      await client.post('/auth/register', {
        nom: data.nom,
        email: data.email,
        mot_de_passe: data.mot_de_passe,
        role: 'professeur',
      });
      setSuccess('Inscription réussie ! Redirection...');
      setTimeout(() => {
        navigation.navigate('Login'); // nom de l’écran de login
      }, 3000);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Cet email est déjà utilisé.');
      } else {
        setError('Erreur lors de l’inscription.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={1000}
        style={styles.header}>
        <Icon name="account-plus" size={60} color={theme.colors.primary} />
        <Text variant="headlineMedium" style={styles.title}>
          Créer un compte
        </Text>
      </Animatable.View>

      {error !== '' && (
        <Animatable.View animation="shake" style={styles.errorContainer}>
          <Icon name="alert-circle" size={20} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </Animatable.View>
      )}

      {success !== '' && (
        <Animatable.View animation="fadeIn" style={styles.successContainer}>
          <Icon name="check-circle" size={20} color={theme.colors.success} />
          <Text style={styles.successText}>{success}</Text>
        </Animatable.View>
      )}

      <InputField
        control={control}
        name="nom"
        label="Nom"
        placeholder="Entrer votre nom complet"
        icon="account"
        rules={{required: 'Nom requis'}}
      />

      <InputField
        control={control}
        name="email"
        label="Email"
        placeholder="professeur@mail.com"
        icon="email"
        keyboardType="email-address"
        rules={{required: 'Email requis'}}
      />

      <PasswordInputField
        control={control}
        name="mot_de_passe"
        label="Mot de passe"
        rules={{required: 'Mot de passe requis'}}
      />

      <PasswordInputField
        control={control}
        name="confirmer_mot_de_passe"
        label="Confirmer le mot de passe"
        rules={{
          required: 'Confirmation requise',
          validate: (value) =>
            value === watch('mot_de_passe') ||
            'Les mots de passe ne correspondent pas.',
        }}
        icon="lock-check"
      />

      <TouchableRipple
        style={[
          styles.button,
          loading || !formState.isValid && styles.buttonDisabled
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading || !formState.isValid}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.buttonContent}>
            <Icon name="account-plus" size={20} color="#fff" />
            <Text style={styles.buttonText}>S'inscrire</Text>
          </View>
        )}
      </TouchableRipple>
      <Text
        style={{
          textAlign: 'center',
          color: theme.colors.primary,
          marginTop: 20,
        }}
        onPress={() => navigation.navigate('Login')}>
        Vous avez déjà un compte ? Connectez-vous
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.xlarge,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xlarge,
  },
  title: {
    marginTop: theme.spacing.medium,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  label: {
    marginBottom: theme.spacing.small,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  input: {
    marginBottom: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  inputError: {
    color: theme.colors.error,
    fontSize: 14,
    marginBottom: theme.spacing.medium,
  },
  button: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.medium,
    paddingVertical: theme.spacing.medium,
    marginTop: theme.spacing.large,
  },
  buttonDisabled: {
    backgroundColor: '#FFB74D',
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: theme.spacing.small,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    marginBottom: theme.spacing.large,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    marginBottom: theme.spacing.large,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.error,
    marginLeft: theme.spacing.small,
  },
  successText: {
    color: theme.colors.success,
    marginLeft: theme.spacing.small,
  },
});
