import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {PRIMARY_COLOR, TEXT_DARK} from 'assets/const/FontColor';
import AboutDetail from '../components/AboutDetail';

const About = () => {
  const [section, setSection] = useState('about');
  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 8,
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity onPress={() => setSection('about')}>
          <Text style={styles.textTitle}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSection('tim')}>
          <Text style={styles.textTitle}>Tim</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSection('profile')}>
          <Text style={styles.textTitle}>Profile User</Text>
        </TouchableOpacity>
      </View>
      {section === 'about' && (
        <View>
          <AboutDetail />
        </View>
      )}
      {section === 'tim' && (
        <View>
          <Text style={styles.textTitle}>Tim</Text>
        </View>
      )}
      {section === 'profile' && (
        <View>
          <Text style={styles.textTitle}>Profile User</Text>
        </View>
      )}
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  headBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: PRIMARY_COLOR,
    height: 300,
    alignItems: 'flex-end',
  },
  textTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
  },
});
