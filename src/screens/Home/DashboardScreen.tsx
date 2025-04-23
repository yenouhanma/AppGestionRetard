// src/screens/Home/DashboardScreen.tsx
import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';

export default function DashboardScreen() {
  const {user, signOut} = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-4">Bienvenue Professeur</Text>
      <Text className="mb-6 text-gray-700">{user?.email}</Text>

      <Pressable className="bg-red-600 px-6 py-3 rounded" onPress={signOut}>
        <Text className="text-white font-semibold">Déconnexion</Text>
      </Pressable>
    </View>
  );
}
