import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import RenderHtml from 'react-native-render-html';
import http from 'helpers/axios';
import {blobToBase64} from 'utils/image.utils';
import {TEXT_DARK} from 'assets/const/FontColor';
import {useRoute} from '@react-navigation/native';

const MediaDetail = () => {
  const {width} = useWindowDimensions();
  const [preview, setPreview] = useState(
    'https://cloud-atg.moph.go.th/quality/sites/default/files/default_images/default.png',
  );
  const [dataAbout, setDataAbout] = useState({
    id: '',
    createdAt: 0,
    updatedAt: 0,
    deletedAt: 0,
    name: '',
    title: '',
    subtitle: '',
    content: '',
    linkUrl: '',
  });
  const route = useRoute();
  const {data} = route.params;

  const getImage = useCallback(async () => {
    if (dataAbout.linkUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000000);
      const fetch = await http();
      try {
        const result = await fetch.get(
          `/files/${dataAbout.linkUrl.replace('/', '%2f')}`,
          {
            signal: controller.signal,
            responseType: 'blob',
          },
        );
        return Promise.resolve(result);
      } catch (err) {
        const error = err as any;
        return error?.response?.data;
      } finally {
        clearTimeout(timeoutId);
        controller.abort();
      }
    }
    return null;
  }, [dataAbout.linkUrl]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };

  useEffect(() => {
    const convert = async () => {
      try {
        const fileExtension = dataAbout.linkUrl.split('.').pop() as string;
        const result = await getImage();
        if (result) {
          const blob =
            result instanceof Blob
              ? result
              : new Blob([result._data], {
                  type: fileExtension,
                  lastModified: result.lastModified,
                });
          const base64String = await blobToBase64(blob);
          setPreview(base64String as string);
        }
      } catch (error) {
        //
      }
    };
    const getAbout = async () => {
      try {
        const fetch = await http();
        const response = await fetch.get(`/news/${data.id}`);
        setDataAbout(response.data);
        convert();
      } catch (error) {
        console.log(error.response.data);
      }
    };

    getAbout();
  }, [getImage, dataAbout.linkUrl, data]);
  return (
    <ScrollView>
      <Text style={styles.textTitle}>{dataAbout.title}</Text>
      <Text style={styles.textSubTitle}>{dataAbout.subtitle}</Text>
      <View style={{display: 'flex', flexDirection: 'row', gap: 4}}>
        <Text style={styles.textDate}>{dataAbout.name}</Text>
        <Text style={styles.textDate}>-</Text>
        <Text style={styles.textDate}>{formatDate(dataAbout.createdAt)}</Text>
      </View>
      <Image
        style={styles.image}
        source={{
          uri: preview,
        }}
      />
      <RenderHtml contentWidth={width} source={{html: dataAbout.content}} />
    </ScrollView>
  );
};

export default MediaDetail;

const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 200,
  },
  textTitle: {
    color: TEXT_DARK,
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
  },
  textSubTitle: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: '500',
  },
  textDate: {
    color: TEXT_DARK,
    fontSize: 16,
    marginBottom: 8,
  },
});
