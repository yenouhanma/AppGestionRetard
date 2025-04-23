import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DashboardScreen from '../screens/Home/DashboardScreen';

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}
