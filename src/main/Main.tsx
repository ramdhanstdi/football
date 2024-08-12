import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from 'modules/auth/screens/Login';
import Register from 'modules/auth/screens/Register';
import ProfileInformation from 'modules/auth/screens/ProfileInformation';
import BottomTabComponent from 'modules/home/components/BottomTab';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToken} from './TokenProvider';
import MediaDetail from 'modules/media/screens/MediaDetail';
import UserDetail from 'modules/user/screens/UserDetail';
import ResetPassword from 'modules/auth/screens/ResetPassword';
import UserTransaction from 'modules/user/screens/UserTransaction';
import CheckTransaction from 'modules/payment/screens/CheckTransaction';
import ChangePassword from 'modules/user/screens/ChangePassword';

const Stack = createNativeStackNavigator();

const Main = ({navigation}) => {
  const {token, setToken} = useToken();
  useEffect(() => {
    const getItemtoken = async (): Promise<any> => {
      try {
        const value = await AsyncStorage.getItem('token');
        if (value !== null) {
          setToken(value);
          navigation.navigate('BottomTabComponent');
          return value;
        }
      } catch (error) {
        return '';
      }
    };
    getItemtoken();
  }, [setToken]);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="BottomTabComponent"
          component={BottomTabComponent}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="MediaDetail"
          component={MediaDetail}
        />
        <Stack.Screen
          options={{headerShown: true, headerBackButtonMenuEnabled: true}}
          name="UserDetail"
          component={UserDetail}
        />
        <Stack.Screen
          options={{headerShown: true, headerBackButtonMenuEnabled: true}}
          name="UserTransaction"
          component={UserTransaction}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="CheckTransaction"
          component={CheckTransaction}
        />
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
          name="ResetPassword"
          component={ResetPassword}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ProfileInformation"
          component={ProfileInformation}
        />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
