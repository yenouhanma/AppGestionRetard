import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useAuth} from '../../contexts/AuthContext';
import * as Animatable from 'react-native-animatable';

type FormData = {email: string; mot_de_passe: string};

export default function LoginScreen() {
  const {control, handleSubmit} = useForm<FormData>();
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
      <Text style={styles.title}>Connexion</Text>

      {error !== '' && (
        <Animatable.View
          animation="shake"
          duration={600}
          style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </Animatable.View>
      )}

      {success !== '' && (
        <Animatable.View animation="fadeIn" style={styles.successContainer}>
          <Text style={styles.successText}>{success}</Text>
        </Animatable.View>
      )}

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{required: "L'email est requis"}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <>
            <TextInput
              style={[styles.input, error && styles.inputErrorBorder]}
              placeholder="professeur@mail.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
            />
            {error && <Text style={styles.inputError}>{error.message}</Text>}
          </>
        )}
      />

      <Text style={styles.label}>Mot de passe</Text>
      <Controller
        control={control}
        name="mot_de_passe"
        rules={{required: 'Mot de passe requis'}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <>
            <TextInput
              style={[styles.input, error && styles.inputErrorBorder]}
              placeholder="••••••••"
              placeholderTextColor="#999"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
            {error && <Text style={styles.inputError}>{error.message}</Text>}
          </>
        )}
      />

      <Pressable
        style={({pressed}) => [
          styles.button,
          pressed && styles.buttonPressed,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF', // Bleu attirant
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#007AFF', // Bleu attirant
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#007AFF', // Bleu attirant
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputErrorBorder: {
    borderColor: '#FF3B30', // Rouge pour les erreurs
  },
  inputError: {
    color: '#FF3B30', // Rouge pour les erreurs
    fontSize: 14,
    marginTop: -10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF9500', // Orange
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonPressed: {
    backgroundColor: '#E57C00', // Orange plus foncé pour l'état pressé
  },
  buttonDisabled: {
    backgroundColor: '#FFB74D', // Orange plus clair pour désactivé
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE', // Fond rouge clair
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#FF3B30', // Rouge pour erreur
    textAlign: 'center',
    fontSize: 15,
  },
  successContainer: {
    backgroundColor: '#E8F5E9', // Fond vert clair
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  successText: {
    color: '#4CAF50', // Vert pour succès
    textAlign: 'center',
    fontSize: 15,
  },
});
