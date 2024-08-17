import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TEXT_DARK,
} from 'assets/const/FontColor';
import http from 'helpers/axios';
import {blobToBase64} from 'utils/image.utils';
import {useFocus} from 'helpers/useFocus';
import Input from 'base/components/Input';
import Select from 'base/components/Select';
import Button from 'base/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

const windowWidth = Dimensions.get('window').width;

interface FieldForm {
  identityName: string;
  identityNumber: string;
  username: string;
  isRelation: string;
  email: string;
  phoneNumber: string;
  birthPlace: string;
  birthDate: Date;
  address: string;
  nationality: string;
  religion: string;
  weight: string;
  height: string;
  bio: string;
  status: string;
  id: string;
  backName?: string;
  backNumber?: string;
}

interface DataProfile {
  id: string;
  address: string;
  birthDate: Date;
  birthPlace: string;
  position: string;
  height: string;
  email: string;
  identityName: string;
  identityNumber: string;
  linkUrl: string;
  phoneNumber: string;
  nationality: string;
  religion: string;
  users: {
    fullname: string;
    username: string;
  };
  weight: string;
  coaches?: {
    bio: string;
  };
  players?: {
    bio: string;
  };
  management?: {
    bio: string;
  };
}

interface AboutProfileProps {
  navigation: any;
  route?: any;
}

const Registration_sbb: React.FC<AboutProfileProps> = ({navigation, route}) => {
  const [preview, setPreview] = useState<string>(
    'https://cloud-atg.moph.go.th/quality/sites/default/files/default_images/default.png',
  );
  const [isRegistrationDisabled, setIsRegistrationDisabled] =
    useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [fieldForm, setFieldForm] = useState<FieldForm>({
    identityName: '',
    identityNumber: '',
    username: '',
    isRelation: '',
    email: '.',
    phoneNumber: '',
    birthPlace: '',
    birthDate: new Date(),
    address: '',
    nationality: '',
    religion: '',
    weight: '',
    height: '',
    bio: '',
    status: '',
    id: '',
  });

  const [dataProfile, setDataProfile] = useState<DataProfile>({
    id: '',
    address: '',
    birthDate: new Date(),
    birthPlace: '',
    position: '',
    height: '',
    email: '',
    identityName: '',
    identityNumber: '',
    linkUrl: '',
    phoneNumber: '',
    nationality: '',
    religion: '',
    users: {
      fullname: '',
      username: '',
    },
    weight: '',
  });

  const OPTIONS_NATIONALITY = ['WNI', 'WNA'];
  const OPTIONS_RELIGION = ['ISLAM', 'KRISTEN', 'HINDU', 'BUDDHA', 'KONGHUCU'];
  const [idUser, setIdUser] = useState<string | null>('');
  const [statusMember, setStatusMember] = useState<string>('');
  const [isTransaction, setIsTransaction] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const {focusCount, isFocused} = useFocus();
  const [isPaymentModalVisible, setPaymentModalVisible] =
    useState<boolean>(false);
  const [supportedBanks, setSupportedBanks] = useState<string[]>([]);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date !== undefined) {
      setFieldForm(prevState => ({
        ...prevState,
        birthDate: date,
      }));
    }
    setShowPicker(false);
  };

  const handleChange = (field: keyof FieldForm, value: string | Date) => {
    setFieldForm(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const togglePaymentModal = () => {
    setPaymentModalVisible(!isPaymentModalVisible);
  };

  const handlePaymentMethodSelect = async (bank: string) => {
    console.log(`Selected payment method: ${bank}`);
    togglePaymentModal(); // close the modal after selection
    try {
      const fetch = await http();
      const response = await fetch.post('/transactions/payment', {
        bank: bank,
      });
      console.log('Payment Response:', response.data);
      navigation.navigate('ProcessPayment', {
        paymentResponse: response.data,
        navigation,
      });
    } catch (error) {
      console.log('Payment Error:', error);
    }
  };

  const fetchSupportedBanks = async () => {
    try {
      const fetch = await http();
      const response = await fetch.get('/transactions/supported-banks');
      console.log('banks = ', response.data);
      if (response.data) {
        setSupportedBanks(response.data);
      } else {
        console.log('No supported banks available.');
        setSupportedBanks([]);
      }
    } catch (error) {
      console.log('Error fetching supported banks:', error);
    }
  };

  const onSubmit = async () => {
    const fetch = await http();
    if (statusMember === 'INACTIVE' && !isEdit) {
      setIsEdit(true);
      return;
    }
    if (statusMember === 'INACTIVE' && isEdit) {
      try {
        const response = await fetch.post('/transactions', {
          ...fieldForm,
          id: idUser,
        });
        navigation.navigate('CheckTransaction');
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      return;
    }
    if (isEdit) {
      setIsEdit(false);
      try {
        await fetch.put(`/members/${idUser}`, {
          ...fieldForm,
        });

        setSuccess(true);
      } catch (error) {
        console.log(error);

        setSuccess(false);
      }
    } else {
      setIsEdit(true);
    }
  };

  const getIdProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      setIdUser(value);
    } catch (error) {
      console.error(error);
    }
  };

  const getImage = useCallback(async () => {
    if (dataProfile.linkUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000000);
      const fetch = await http();
      try {
        const result = await fetch.get(
          `/files/${dataProfile.linkUrl.replace('/', '%2f')}`,
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
  }, [dataProfile.linkUrl]);

  useEffect(() => {
    getIdProfile();
    fetchSupportedBanks(); // Fetch the supported banks on component mount
    const convert = async () => {
      try {
        const fileExtension = dataProfile?.linkUrl?.split('.').pop() as string;
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
        console.error(error);
      }
    };
    const getProfile = async () => {
      try {
        const fetch = await http();
        const response = await fetch.get(`/members/${idUser}`);
        const transaction = await fetch.get(`/transactions/member/${idUser}`);
        setStatusMember(response.data.status);
        setIsTransaction(!!transaction.data);
        setDataProfile(response.data);
        setFieldForm(prevState => ({
          ...prevState,
          status: response.data?.status,
        }));
        if (response.data.coaches) {
          setFieldForm(prevState => ({
            ...prevState,
            bio: response.data?.coaches.bio,
            isRelation: 'COACHES',
          }));
        }
        if (response.data.players) {
          setFieldForm(prevState => ({
            ...prevState,
            bio: response.data?.players.bio,
            isRelation: 'PLAYERS',
          }));
        }
        if (response.data.management) {
          setFieldForm(prevState => ({
            ...prevState,
            bio: response.data?.management.bio,
            isRelation: 'MANAGEMENTS',
          }));
        }

        convert();
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
    if (focusCount === 1 && isFocused) {
      getProfile();
    }
    if (focusCount > 1 && isFocused) {
      getProfile();
    }
  }, [getImage, dataProfile?.linkUrl, idUser, focusCount, isFocused]);

  useEffect(() => {
    if (route?.params?.status) {
      const receivedStatus = route.params.status;
      console.log('Received status:', receivedStatus);

      setFieldForm(prevState => ({
        ...prevState,
        status: receivedStatus,
      }));

      // Jika status bukan 'pending', disable tombol
      if (receivedStatus != 'pending') {
        setIsRegistrationDisabled(false);
      } else {
        setIsRegistrationDisabled(true);
      }
    } else {
      // Jika tidak ada status, pastikan tombol tidak disabled
      setIsRegistrationDisabled(true);
    }
  }, [route?.params?.status]);

  return (
    <ScrollView style={styles.container}>
      {success && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Profile Berhasil diupdate</Text>
        </View>
      )}
      {statusMember !== 'INACTIVE' && (
        <Image
          style={styles.image}
          source={{
            uri: preview,
          }}
        />
      )}
      {(statusMember !== 'INACTIVE' || isEdit) && (
        <View style={styles.formContainer}>
          <Input
            onChangeText={handleChange}
            type="text"
            name="identityName"
            defaultValue={dataProfile.identityName}
            disabled={isEdit}
          />
          <Input
            onChangeText={handleChange}
            type="text"
            name="identityNumber"
            defaultValue={dataProfile.identityNumber}
            disabled={isEdit}
          />
          {statusMember !== 'INACTIVE' && (
            <Input
              onChangeText={handleChange}
              type="text"
              name="username"
              defaultValue={dataProfile.users?.username}
              disabled={isEdit}
            />
          )}
          <Input
            onChangeText={handleChange}
            type="text"
            name="email"
            defaultValue={dataProfile.email}
            disabled={isEdit}
          />
          <Input
            onChangeText={handleChange}
            type="text"
            name="phoneNumber"
            defaultValue={dataProfile.phoneNumber}
            disabled={isEdit}
          />
          <Input
            onChangeText={handleChange}
            type="text"
            name="birthPlace"
            defaultValue={dataProfile.birthPlace}
            disabled={isEdit}
          />
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerLabel}>birthDate</Text>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.datePickerButton}>
              <Text>{fieldForm.birthDate.toDateString()}</Text>
            </TouchableOpacity>
          </View>
          {showPicker && (
            <RNDateTimePicker
              mode="date"
              value={fieldForm.birthDate || dataProfile.birthDate}
              onChange={handleDateChange}
              style={styles.datePicker}
            />
          )}
          <Input
            onChangeText={handleChange}
            type="text"
            name="address"
            defaultValue={dataProfile.address}
            disabled={isEdit}
          />
          <Select
            handleChange={handleChange}
            title="nationality"
            defaultValue={dataProfile.nationality}
            value={fieldForm.nationality}
            disabled={isEdit}
            options={OPTIONS_NATIONALITY}
          />
          <Select
            handleChange={handleChange}
            title="religion"
            defaultValue={dataProfile.religion}
            value={fieldForm.religion}
            disabled={isEdit}
            options={OPTIONS_RELIGION}
          />
          <Input
            onChangeText={handleChange}
            type="text"
            name="weight"
            defaultValue={dataProfile.weight}
            disabled={isEdit}
          />
          <Input
            onChangeText={handleChange}
            type="text"
            name="height"
            defaultValue={dataProfile.height}
            disabled={isEdit}
          />
          <Input
            onChangeText={handleChange}
            type="text"
            name="bio"
            defaultValue={fieldForm.bio}
            disabled={isEdit}
          />
          {(fieldForm.backName || statusMember === 'INACTIVE') && (
            <Input
              onChangeText={handleChange}
              type="text"
              name="backName"
              defaultValue={fieldForm?.backName}
              disabled={isEdit}
            />
          )}
          {(fieldForm?.backNumber || statusMember === 'INACTIVE') && (
            <Input
              onChangeText={handleChange}
              type="text"
              name="backNumber"
              defaultValue={fieldForm?.backNumber}
              disabled={isEdit}
            />
          )}
        </View>
      )}
      <View style={styles.submitButtonContainer}>
        {isEdit && (
          <Button
            action={togglePaymentModal}
            title="payment"
            text="Select Payment Method"
            variant="secondary"
          />
        )}
        <Button
          action={onSubmit}
          title="submit"
          text="Registration"
          variant="primary"
          disabled={!isEdit ? false : isRegistrationDisabled} // Disable tombol jika isRegistrationDisabled true
        />
      </View>

      <Modal
        isVisible={isPaymentModalVisible}
        onBackdropPress={togglePaymentModal}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Payment Method</Text>
          {supportedBanks.map(bank => (
            <TouchableOpacity
              key={bank}
              onPress={() => handlePaymentMethodSelect(bank)}>
              <Text style={styles.modalOption}>{bank}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Registration_sbb;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  successMessage: {
    backgroundColor: SECONDARY_COLOR,
    padding: 10,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    color: PRIMARY_COLOR,
  },
  image: {
    borderRadius: 8,
    width: windowWidth - 60,
    height: windowWidth - 60,
    alignSelf: 'center',
    marginVertical: 16,
  },
  formContainer: {
    marginBottom: 24,
  },
  datePickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    borderColor: TEXT_DARK,
  },
  datePickerLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: TEXT_DARK,
  },
  datePickerButton: {
    borderWidth: 0.5,
    paddingHorizontal: 12,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
  },
  datePicker: {
    height: 20,
  },
  submitButtonContainer: {
    marginTop: 24,
    marginBottom: 34,
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: windowWidth - 60,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalOption: {
    fontSize: 16,
    marginVertical: 10,
  },
});
