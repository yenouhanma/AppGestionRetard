import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DashboardScreen from '../screens/Home/DashboardScreen';
import CoursDetailScreen from '../screens/Cours/CoursDetailScreen';
import StatsScreen from '../screens/Cours/StatsScreen';
import ListeElevesScreen from '../screens/Eleves/ListeElevesScreen';
import EleveDetailScreen from '../screens/Eleves/EleveDetailScreen';
import HistoriqueEleveScreen from '../screens/Eleves/HistoriqueEleveScreen';
import StatsEleveScreen from '../screens/Eleves/StatsEleveScreen';

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="CoursDetail" component={CoursDetailScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
      <Stack.Screen name="ListeEleves" component={ListeElevesScreen} />
      <Stack.Screen name="EleveDetail" component={EleveDetailScreen} />
      <Stack.Screen name="HistoriqueEleve" component={HistoriqueEleveScreen} />
      <Stack.Screen name="StatsEleve" component={StatsEleveScreen} />
    </Stack.Navigator>
  );
}
