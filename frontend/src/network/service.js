import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:4001/v1'
    : 'http://127.0.0.1:4001/v1';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTask = async () => {
   let user = await AsyncStorage.getItem('user');
   let userParse = user ? JSON.parse(user) : ''
  try {
    const response = await axiosInstance.get(`/task?_id=${userParse?._id}`);
    console.log(response?.data);
    return response?.data;
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

export const createTask = async (title, remarks, userId) => {
  try {
    const response = await axiosInstance.post('/task', {
      title,
      remarks,
      userId,
    });
    console.log(response?.data);
    return response?.data
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete('/task', {
      data: { taskId },
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, title, remarks, completed) => {
  try {
    const response = await axiosInstance.put('/task', {
      taskId,
      title,
      remarks,
      completed,
    });
    console.log(response?.data);
    return response?.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const signUp = async (name, zipCode, email, address, password) => {
  try {
    const response = await axiosInstance.post('/signUp', {
      name,
      zipCode,
      email,
      address,
      password,
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await axiosInstance.post('/signIn', {
      email,
      password,
    });
    const { token } = response.data;
    await AsyncStorage.setItem('token', token);
    return response?.data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const getUserDetails = async (_id) => {
  try {
    const response = await axiosInstance.get('/user', {
      params: { _id },
    });
    console.log(response.data);
    return response?.data;
  } catch (error) {
    console.error('Error getting user details:', error);
    throw error;
  }
};
