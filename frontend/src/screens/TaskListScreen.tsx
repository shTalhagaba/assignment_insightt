import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TouchableOpacity} from 'react-native';
import { deleteTask, getTask, updateTask } from '../network/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from '../navigation';
import { useIsFocused } from '@react-navigation/native';

const TaskListScreen: React.FC = ({navigation}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [isFocused]);

  const fetchTasks = async () => {
    try {
      const response = await getTask();
      setTasks(response?.Tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSignOut = async () => {
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('user', '');
    navigation.replace('Login');
    // Your sign out logic here
    console.log('User signed out');
  };

  const handleAddTask = () => {
    navigation.navigate('AddNewTask');
  };

  const handleDoneUndo = async (item: any) => {
    try {
      const updatedTask = await updateTask(item?._id,item?.title , item?.remarks, !item?.completed);
      console.log('Task updated successfully:', updatedTask?.message);
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  const handleDeleteTask = async (taskId: any) => {
    try {
      await deleteTask(taskId);
      console.log('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (taskItem: any) => {
    navigation.navigate('AddNewTask', { taskItem: taskItem });
  }

  const renderItem = ({item}: {item: Task}) => (
    <View style={styles.taskContainer}>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskRemarks}>{item.remarks}</Text>
      </View>
      <View style={styles.taskButtons}>
        <Button title={item?.completed ? 'Undo' : 'Done'} onPress={() => handleDoneUndo(item)} color={'#4385F5'} />
        <TouchableOpacity onPress={() => handleEditTask(item)} style={styles.button}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteTask(item._id)} style={[styles.button, {backgroundColor: 'red'}]}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Task List</Text>
        <Button title="Sign Out" onPress={handleSignOut} color={'#4385F5'}  />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
      <View style={styles.addTaskButtonContainer}>
        <Button title="Add New Task" onPress={handleAddTask} color={'#4385F5'}  />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addTaskButtonContainer: {
    marginTop: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskDetails: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskRemarks: {
    fontSize: 16,
    color: '#666',
  },
  taskButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    margin: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4385F5',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TaskListScreen;
