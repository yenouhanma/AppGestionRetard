import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
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

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      setLoading(true);
      await signIn(data.email, data.mot_de_passe);
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
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center text-blue-700">
        Connexion
      </Text>

      {error !== '' && (
        <Animatable.View animation="shake" duration={600}>
          <Text className="text-red-600 text-center mb-4">{error}</Text>
        </Animatable.View>
      )}

      <Text className="mb-1 font-medium">Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{required: "L'email est requis"}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <>
            <TextInput
              className="border p-3 rounded mb-1"
              placeholder="ex: prof@mail.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
            />
            {error && (
              <Text className="text-red-600 text-sm mb-2">{error.message}</Text>
            )}
          </>
        )}
      />

      <Text className="mb-1 font-medium">Mot de passe</Text>
      <Controller
        control={control}
        name="mot_de_passe"
        rules={{required: 'Mot de passe requis'}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <>
            <TextInput
              className="border p-3 rounded mb-1"
              placeholder="••••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
            {error && (
              <Text className="text-red-600 text-sm mb-4">{error.message}</Text>
            )}
          </>
        )}
      />

      <Pressable
        className="bg-blue-600 rounded p-3 items-center"
        onPress={handleSubmit(onSubmit)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">
            Se connecter
          </Text>
        )}
      </Pressable>
    </View>
  );
}
