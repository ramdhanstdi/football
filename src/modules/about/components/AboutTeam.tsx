import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PRIMARY_COLOR, TEXT_DARK, TEXT_LIGHT} from 'assets/const/FontColor';
import http from 'helpers/axios';
import CardTeam from './CardTeam';

const AboutTeam = ({navigation}) => {
  const [filter, setFilter] = useState('Senior');
  const [player, setPlayer] = useState([
    {
      id: '',
      playerNumber: '',
      position: '',
      backName: '',
      backNumber: '',
      bio: '',
      category: '',
      memberId: '',
      members: {linkUrl: ''},
    },
  ]);

  useEffect(() => {
    const getPlayer = async () => {
      try {
        const fetch = await http();
        let response;
        if (filter === 'Management') {
          response = await fetch.get('/managements', {
            params: {
              page: 1,
              limit: 15,
            },
          });
        } else if (filter === 'Coach') {
          response = await fetch.get('/coaches', {
            params: {
              page: 1,
              limit: 15,
            },
          });
        } else {
          response = await fetch.get('/players', {
            params: {
              category: filter,
              page: 1,
              limit: 100,
              status: 'ACTIVE',
            },
          });
        }
        console.log(response.data.items);

        setPlayer(response.data.items);
      } catch (error) {
        // console.log(error.response);
      }
    };

    getPlayer();
  }, [filter]);

  return (
    <ScrollView style={{marginHorizontal: 8, marginBottom: 30}}>
      <Text style={styles.titleText}>Pemain Klub</Text>
      <View style={styles.bottomBar} />
      <View style={{display: 'flex', flexDirection: 'row', gap: 4}}>
        <TouchableOpacity
          onPress={() => setFilter('Senior')}
          style={filter === 'Senior' ? styles.cardActive : styles.card}>
          <Text
            style={
              filter === 'Senior' ? styles.textStyleActive : styles.textStyle
            }>
            Senior
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('U-16')}
          style={filter === 'U-16' ? styles.cardActive : styles.card}>
          <Text
            style={
              filter === 'U-16' ? styles.textStyleActive : styles.textStyle
            }>
            U-16
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('U-18')}
          style={filter === 'U-18' ? styles.cardActive : styles.card}>
          <Text
            style={
              filter === 'U-18' ? styles.textStyleActive : styles.textStyle
            }>
            U-18
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('U-20')}
          style={filter === 'U-20' ? styles.cardActive : styles.card}>
          <Text
            style={
              filter === 'U-20' ? styles.textStyleActive : styles.textStyle
            }>
            U-20
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{display: 'flex', flexDirection: 'row', gap: 4}}>
        <TouchableOpacity
          onPress={() => setFilter('Other')}
          style={filter === 'Other' ? styles.cardActive : styles.card}>
          <Text
            style={
              filter === 'Other' ? styles.textStyleActive : styles.textStyle
            }>
            Other
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('Coach')}
          style={filter === 'Coach' ? styles.cardActive : styles.card}>
          <Text
            style={
              filter === 'Coach' ? styles.textStyleActive : styles.textStyle
            }>
            Coach
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('Management')}
          style={filter === 'Management' ? styles.cardActive : styles.card}>
          <Text
            style={
              filter === 'Management'
                ? styles.textStyleActive
                : styles.textStyle
            }>
            Management
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{display: 'flex', flexDirection: 'row', gap: 4}}></View>
      <View style={styles.bottomBar} />
      {player?.map(data => (
        <CardTeam
          navigation={navigation}
          backName={data.backName}
          backNumber={data.backNumber}
          bio={data.bio}
          position={data.position}
          imgSrc={data.members.linkUrl}
          id={data.memberId}
        />
      ))}
    </ScrollView>
  );
};

export default AboutTeam;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 16,
    color: TEXT_DARK,
  },
  textStyleActive: {
    fontSize: 16,
    color: TEXT_LIGHT,
  },
  card: {
    backgroundColor: '#e4e3e3e3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardActive: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  bottomBar: {
    borderBottomWidth: 3,
    width: '50%',
    borderColor: PRIMARY_COLOR,
    marginTop: 4,
    marginBottom: 8,
  },
  titleText: {fontSize: 24, color: TEXT_DARK, fontWeight: '600', marginTop: 8},
});
