import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import http from 'helpers/axios';

interface PaymentResponse {
  transaction_id: string;
  transaction_status: string;
  va_numbers: { bank: string; va_number: string }[];
  expiry_time: string;
  callback_notification: string;
}

interface ProcessPaymentProps {
  route: any;
  navigation: any;
}

const ProcessPayment: React.FC<ProcessPaymentProps> = ({ route, navigation }) => {
  const { paymentResponse }: { paymentResponse: PaymentResponse } = route.params;

  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const expiryDate = new Date(paymentResponse.expiry_time);
    const now = new Date();
    const difference = expiryDate.getTime() - now.getTime();

    if (difference > 0) {
      setTimeLeft(difference);
    }

    const countdown = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1000) {
          clearInterval(countdown);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [paymentResponse.expiry_time]);

  const formatTimeLeft = (time: number) => {
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const seconds = Math.floor((time / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const copyToClipboard = () => {
    Clipboard.setString(paymentResponse.va_numbers[0].va_number);
    Alert.alert('Copied', 'Virtual Account Number copied to clipboard');
  };

  const sendCallbackNotification = async () => {
    try {
      const fetch = await http();
      const url = `${paymentResponse.callback_notification}/${paymentResponse.transaction_id}`;
      const response = await fetch.get(url);
  
      const paymentStatus = response.data.transaction_status;
  
      if (paymentStatus !== 'pending') {
        Alert.alert('Status Pembayaran', `Status: ${paymentStatus}`, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Registration_sbb', { status: paymentStatus }),
          },
        ]);
      } else {
        Alert.alert('Status Pembayaran', `Status: ${paymentStatus}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send callback notification.');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="card-outline" size={40} color="#4CAF50" />
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Transaction ID</Text>
          <Text style={styles.value}>{paymentResponse.transaction_id}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Status</Text>
          <Text style={[
            styles.value, 
            paymentResponse.transaction_status === 'pending' 
            ? styles.pendingStatus 
            : styles.successStatus
          ]}>
            {paymentResponse.transaction_status}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Bank</Text>
          <Text style={styles.value}>{paymentResponse.va_numbers[0].bank.toUpperCase()}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Virtual Account Number</Text>
          <Text style={styles.value}>{paymentResponse.va_numbers[0].va_number}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Time Left to Pay</Text>
          <Text style={styles.value}>{formatTimeLeft(timeLeft)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
        <Ionicons name="copy-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Copy Virtual Account Number</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.checkButton]} onPress={sendCallbackNotification}>
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={styles.buttonText}>Send Callback Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProcessPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f8',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  pendingStatus: {
    color: '#FFA726',
  },
  successStatus: {
    color: '#4CAF50',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  checkButton: {
    backgroundColor: '#34D399', // Warna berbeda untuk tombol "Send Callback Notification"
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
