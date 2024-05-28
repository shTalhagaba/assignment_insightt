import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('user');
        if (token) {
          // Parse token to get user object
          const user = JSON.parse(token);
          if (user.name) {
            setTimeout(() => {
              navigation.replace('TaskList');
            }, 1000);
          } else {
            setTimeout(() => {
              navigation.replace('Login');
            }, 1000);
          }
        } else {
          setTimeout(() => {
            navigation.replace('Login');
          }, 1000);
        }
      } catch (error) {
        console.error('Error getting token:', error);
        setTimeout(() => {
          navigation.replace('Login');
        }, 1000);
      }
    };
    checkUserToken();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={{alignItems: 'center'}}>
        <Text>This is the SplashScreen</Text>
      </View>
    </View>
  );
};
export default SplashScreen;
