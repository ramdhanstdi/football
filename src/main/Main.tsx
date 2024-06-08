import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from 'modules/auth/screens/Login';
import Register from 'modules/auth/screens/Register';
import ProfileInformation from 'modules/auth/screens/ProfileInformation';
import BottomTabComponent from 'modules/home/components/BottomTab';
import AboutTeam from 'modules/about/screens/AboutTeam';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const Main = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const getItemtoken = async (): Promise<any> => {
      try {
        const value = await AsyncStorage.getItem('token');
        if (value !== null) {
          setToken(value);
          return value;
        }
      } catch (error) {
        return '';
      }
    };
    getItemtoken();
  }, [token]);
  return (
    <NavigationContainer>
      {token ? (
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="BottomTabComponent"
            component={BottomTabComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="AboutTeam"
            component={AboutTeam}
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
