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

type FormData = {email: string; password: string};

export default function LoginScreen() {
  const {control, handleSubmit} = useForm<FormData>();
  const {signIn} = useAuth();
  const [loading, setLoading] = React.useState(false);
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await signIn(data.email, data.password);
    } catch (err) {
      console.warn('Erreur de connexion', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center">
        Connexion Professeur
      </Text>

      <Text className="mb-1">Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            className="border p-3 mb-4 rounded"
            placeholder="ex: prof@mail.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text className="mb-1">Mot de passe</Text>
      <Controller
        control={control}
        name="password"
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            className="border p-3 mb-6 rounded"
            placeholder="••••••••"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Pressable
        className="bg-blue-600 rounded p-3 items-center"
        onPress={handleSubmit(onSubmit)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">Se connecter</Text>
        )}
      </Pressable>
    </View>
  );
}