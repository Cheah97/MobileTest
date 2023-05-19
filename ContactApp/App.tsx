import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import EditContact from './EditContact';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: 'Contact',
            headerStyle: {backgroundColor: 'white'},
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="EditContact"
          component={EditContact}
          options={{
            headerTitle: '',
            headerTitleAlign: 'center',
          }}
        />
        {/* Add other screens and their options here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
