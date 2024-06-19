import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CardHeadLine from '../components/CardHeadLine';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {TEXT_DARK, TEXT_LIGHT} from 'assets/const/FontColor';
import Button from 'base/components/Button';
import CardNews from '../components/CardNews';
import http from 'helpers/axios';

const windowWidth = Dimensions.get('window').width;

const Media = ({navigation}: any) => {
  const [dataSlider, setDataSlider] = useState([
    {title: '', linkUrl: '', id: ''},
  ]);
  const [dataNews, setDataNews] = useState([
    {title: '', linkUrl: '', id: '', createdAt: ''},
  ]);
  const [_, setPage] = useState(1);

  const getNews = useCallback(async (pageNumber: number) => {
    try {
      const fetch = await http();
      const response = await fetch.get('/news', {
        params: {
          sortBy: 'createdAt | DESC',
          page: pageNumber,
          limit: 5,
          status: 'published',
        },
      });
      if (pageNumber === 1) {
        setDataNews(response.data.items);
      } else {
        setDataNews(prevData => [...prevData, ...response.data.items]);
      }
    } catch (error) {
      //
    }
  }, []);

  const handleSubmit = () => {
    setPage(prevPage => {
      const nextPage = prevPage + 1;
      getNews(nextPage);
      return nextPage;
    });
  };

  useEffect(() => {
    const getNewsSlider = async () => {
      try {
        const fetch = await http();
        const response = await fetch.get('/news', {
          params: {
            sortBy: 'createdAt | DESC',
            page: 1,
            limit: 5,
            status: 'published',
          },
        });
        setDataSlider(response.data.items);
        setDataNews(response.data.items);
        setPage(1); // Reset page to 1 on initial load
      } catch (error) {
        //
      }
    };

    getNewsSlider();
  }, []);

  return (
    <ScrollView>
      <View>
        <SwiperFlatList
          autoplay
          autoplayDelay={2}
          autoplayLoop
          index={0}
          showPagination
          data={dataSlider}
          style={{height: windowWidth - 50}}
          renderItem={({item}) => (
            <CardHeadLine
              title={item.title}
              navigation={navigation}
              imgSrc={item.linkUrl.replace('/', '%2f')}
              href={item.id}
            />
          )}
        />
      </View>
      <View style={{backgroundColor: '#fff'}}>
        <Text style={styles.textNews}>Berita Terbaru</Text>
        {dataNews.map(item => (
          <CardNews
            navigation={navigation}
            imgSrc={item.linkUrl.replace('/', '%2f')}
            title={item.title}
            date={item.createdAt}
            href={item.id}
          />
        ))}
        <View style={{marginHorizontal: 'auto'}}>
          <Button
            action={handleSubmit}
            title="submit"
            text="Muat Lainnya"
            variant="secondary"
            disabled={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Media;

const styles = StyleSheet.create({
  textNews: {
    fontSize: 16,
    marginVertical: 16,
    marginHorizontal: 8,
    fontWeight: '500',
    color: TEXT_DARK,
  },
  textTV: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_LIGHT,
    textAlign: 'center',
    marginVertical: 16,
  },
});
