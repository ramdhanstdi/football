import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {PRIMARY_COLOR, TEXT_DARK} from 'assets/const/FontColor';

const AboutTeam = () => {
  return (
    <View>
      <Text style={styles.titleText}>Pemain Klub</Text>
      <View style={styles.bottomBar} />
      <View style={{display: 'flex'}}>
        <View style={styles.card}>
          <Text style={styles.titleText}>TIM UTAMA</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.textStyle}>U-20</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.textStyle}>U-18</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.textStyle}>U-16</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.textStyle}>Putri</Text>
        </View>
      </View>
      <Text style={styles.titleText}>Penjaga Gawang</Text>
      <View style={styles.bottomBar} />
    </View>
  );
};

export default AboutTeam;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 16,
    color: TEXT_DARK,
  },
  card: {backgroundColor: '#eee', padding: 8, borderRadius: 8},
  bottomBar: {
    borderBottomWidth: 3,
    width: 20,
    borderColor: PRIMARY_COLOR,
    marginTop: 4,
  },
  titleText: {fontSize: 24, color: TEXT_DARK, fontWeight: '600'},
});
