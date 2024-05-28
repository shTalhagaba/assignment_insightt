import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {createTask, updateTask} from '../network/service';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AddNewTaskScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddNewTask'
>;

type Props = {
  navigation: AddNewTaskScreenNavigationProp;
  route: {params: {taskItem: Task | undefined}};
};

interface Task {
  _id: string;
  title: string;
  remarks: string;
}

const AddNewTaskScreen: React.FC<Props> = ({navigation, route}) => {
  const {taskItem} = route.params || {};
  const [title, setTitle] = useState<string>(taskItem?.title || '');
  const [remarks, setRemarks] = useState<string>(taskItem?.remarks || '');

  const handleSaveTask = async () => {
    const user = await AsyncStorage.getItem('user');
    try {
      if (!title.trim()) {
        Alert.alert('Error', 'Please enter a title for the task.');
        return;
      }

      if (!remarks.trim()) {
        Alert.alert('Error', 'Please enter remarks for the task.');
        return;
      }

      if (taskItem) {
        await updateTask(taskItem._id, title, remarks, true);
        Alert.alert('Task Updated', 'Task has been updated successfully.');
      } else {
        let task = await createTask(title, remarks, user?._id);
        if (task?.task) {
          Alert.alert('Task Added', 'New task has been added successfully.');
        }
      }

      navigation.navigate('TaskList');
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save the task. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{taskItem ? 'Update' : 'Add New'} Task</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Remarks"
        value={remarks}
        onChangeText={setRemarks}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSaveTask} style={styles.btn}>
        <Text style={styles.btnTxt}>Save Task</Text>
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
});

export default AddNewTaskScreen;
