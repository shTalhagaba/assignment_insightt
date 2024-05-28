import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { signUp } from '../network/service';

type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Signup'
>;

type Props = {
  navigation: SignupScreenNavigationProp;
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const handleSignup = async () => {
    try {
      const response = await signUp(name, zipCode, email, address, password);
      if (response?.token) {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        Alert.alert('Signup Successful', `Welcome, ${response?.user?.name}!`);
        navigation.replace('TaskList');
      }
    } catch (error) {
      Alert.alert('Signup Failed', error?.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Signup Screen</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Zip Code"
        value={zipCode}
        onChangeText={setZipCode}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleSignup} style={styles.btn}>
        <Text style={styles.btnTxt}>Signup</Text>
      </TouchableOpacity>
      <Text style={styles.description}>
        Please sign up to create an account and start managing your tasks.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.btn}
      >
        <Text style={styles.btnTxt}>Go to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btn: {
    backgroundColor: '#4385F5',
    alignItems: 'center',
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
    height: 40,
    justifyContent: 'center',
    borderRadius: 10,
  },
  btnTxt: {
    fontSize: 16,
    color: 'white',
    fontWeight: '800',
  },
  description: {
    marginTop: 50,
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    marginBottom: 30,
  },
});

export default SignupScreen;
