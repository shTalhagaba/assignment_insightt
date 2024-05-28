import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {signIn} from '../network/service';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    // You can uncomment the following validation checks if needed
    if (email === '' && password === '') {
      Alert.alert('Error', 'Please Enter email & password !!');
    } else if (email === '') {
      Alert.alert('Error', 'Please Enter email !!');
    } else if (password === '') {
      Alert.alert('Error', 'Please Enter password !!');
    } else {
      try {
        const response = await signIn(email, password);
        if (response?.token) {
          await AsyncStorage.setItem('token', response.token);
          await AsyncStorage.setItem('user', JSON.stringify(response.user));
          Alert.alert(
            'Login Successful',
            `Welcome back, ${response?.user?.name}!`,
          );
          navigation.replace('TaskList');
        }
      } catch (error) {
        Alert.alert('Login Failed', error?.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Login Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.btn}>
        <Text style={styles.btnTxt}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.description}>
        Please login to access your tasks. If you don't have an account, sign up
        now!
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Signup')}
        style={styles.btn}>
        <Text style={styles.btnTxt}>Signup</Text>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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

export default LoginScreen;
