import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {PRIMARY_COLOR} from 'assets/const/FontColor';

const About = () => {
  return (
    <View>
      <View style={styles.headBlock}>
        <View>
          <Text style={styles.textTitle}>Tentang Persib</Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, modi
            labore omnis neque voluptatibus eius illo excepturi sequi sit eaque
            velit cumque beatae temporibus, praesentium sed nihil soluta
            consectetur repellendus?
          </Text>
        </View>
        <Image
          source={require('assets/images/main.png')}
          style={{width: 40, height: 40}}
        />
      </View>
      <View style={{display: 'flex'}}>
        <TouchableOpacity style={{width: '100%'}}>
          <Text>Tentang</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width: '100%'}}>
          <Text>Tim</Text>
        </TouchableOpacity>
      </View>
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
  },
});
