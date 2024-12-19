import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapboxGL from '@rnmapbox/maps';
import DangerousLocationsMap from './src/screens/DangerousLocationsMap';
import { StatusBar } from 'react-native';

// Define the stack parameter list type
type RootStackParamList = {
  DangerMap: undefined;
  // Add more screen types here as needed
};

// Initialize the stack navigator with types
const Stack = createStackNavigator<RootStackParamList>();


  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="DangerMap"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FF4500', // Orange-red theme color
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyle: { backgroundColor: '#FFFFFF' }
          }}
        >
          <Stack.Screen
            name="DangerMap"
            component={DangerousLocationsMap}
            options={{
              title: 'Danger Zone Tracker',
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;