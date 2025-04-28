import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useAuth} from '../../contexts/AuthContext';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../config/theme';
import {Text, TextInput, TouchableRipple} from 'react-native-paper';

type FormData = {email: string; mot_de_passe: string};

export default function LoginScreen() {
  const {control, handleSubmit, formState} = useForm<FormData>();
  const {signIn} = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const onSubmit = async (data: FormData) => {
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      await signIn(data.email, data.mot_de_passe);
      setSuccess('Connexion réussie !');
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError('Erreur serveur. Veuillez réessayer.');
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
        <Icon name="school" size={60} color={theme.colors.primary} />
        <Text variant="headlineMedium" style={styles.title}>
          Connexion
        </Text>
      </Animatable.View>

      {error !== '' && (
        <Animatable.View
          animation="shake"
          duration={600}
          style={styles.errorContainer}>
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

      <Controller
        control={control}
        name="email"
        rules={{required: "L'email est requis"}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              mode="outlined"
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
              keyboardType="email-address"
              placeholder="professeur@mail.com"
              value={value}
              onChangeText={onChange}
              error={!!error}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  error: theme.colors.error,
                },
                roundness: theme.radius.medium,
              }}
            />
            {error && (
              <Text style={styles.inputError}>
                <Icon name="alert" size={14} /> {error.message}
              </Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="mot_de_passe"
        rules={{required: 'Mot de passe requis'}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              mode="outlined"
              left={<TextInput.Icon icon="lock" />}
              right={<TextInput.Icon icon="eye" />}
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={!!error}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  error: theme.colors.error,
                },
                roundness: theme.radius.medium,
              }}
            />
            {error && (
              <Text style={styles.inputError}>
                <Icon name="alert" size={14} /> {error.message}
              </Text>
            )}
          </>
        )}
      />

      <TouchableRipple
        style={[
          styles.button,
          (loading || !formState.isValid) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading || !formState.isValid}
        rippleColor="rgba(255, 255, 255, 0.32)">
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.buttonContent}>
            <Icon name="login" size={20} color="#fff" />
            <Text style={styles.buttonText}>Se connecter</Text>
          </View>
        )}
      </TouchableRipple>
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
    marginTop: -theme.spacing.small,
    marginBottom: theme.spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.medium,
    paddingVertical: theme.spacing.medium,
    marginTop: theme.spacing.large,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#FFB74D',
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: '600',
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
  errorText: {
    color: theme.colors.error,
    marginLeft: theme.spacing.small,
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
  successText: {
    color: theme.colors.success,
    marginLeft: theme.spacing.small,
  },
});
