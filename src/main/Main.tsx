import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from 'modules/auth/screens/Login';
import Register from 'modules/auth/screens/Register';
import ProfileInformation from 'modules/auth/screens/ProfileInformation';
import BottomTabComponent from 'modules/home/components/BottomTab';

const Stack = createNativeStackNavigator();

const Main = () => {
  const token = true;
  return (
    <NavigationContainer>
      {token ? (
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="BottomTabComponent"
            component={BottomTabComponent}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="Login"
            component={Login}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Register"
            component={Register}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="ProfileInformation"
            component={ProfileInformation}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Main;
