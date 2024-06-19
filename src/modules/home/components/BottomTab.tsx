import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {PRIMARY_COLOR} from 'assets/const/FontColor';

import Home from '../screens/Home';
import Media from 'modules/media/screens/Media';
import About from 'modules/about/screens/About';

const BottomTab = createBottomTabNavigator();

const BottomTabComponent = ({navigation}: any) => {
  useEffect(() => {
    // Directly navigate to the "Home" screen when component mounts
    navigation.navigate('Home');
  }, [navigation]);
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        options={{
          tabBarActiveTintColor: PRIMARY_COLOR,
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
        name="Home"
        component={Home}
      />
      <BottomTab.Screen
        options={{
          tabBarActiveTintColor: PRIMARY_COLOR,
          tabBarIcon: ({color, size}) => (
            <Icon name="play-circle" color={color} size={size} />
          ),
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 400, fontSize: 16},
        }}
        name="Media"
        component={Media}
      />
      <BottomTab.Screen
        options={{
          tabBarActiveTintColor: PRIMARY_COLOR,
          tabBarIcon: ({color, size}) => (
            <Icon name="info" color={color} size={size} />
          ),
        }}
        name="About"
        component={About}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabComponent;
