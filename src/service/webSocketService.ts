import io from 'socket.io-client';
import { Task } from '../data/index.js';
import { Ids as Keys } from '../TaskManager.js';

const BASE_URL = process.env.REACT_APP_BASE_URL || "";
console.log("checkkkk", BASE_URL);


const socket = io(BASE_URL , {
  withCredentials: true,
});

const subscribeToAddNewTaskUpdates = (task: { content: string }, key: Keys) => {
  socket.emit("addNewTask", task, key);
}

const subscribeToUpdateNewTaskUpdates = (task: Task) => {
  socket.emit("updateTask", task);
}

const subscribeToUpdateTasksUpdates = (sKey: Keys, sInd: number, tKey: Keys, tId: string, tInd: number) => {
  socket.emit("updateTasks", sKey, sInd, tKey, tId, tInd);
}

const subscribeToDeleteTask = (id: string, key: Keys, taskIdInd: number) => {
  socket.emit("deleteTask", id, key, taskIdInd);
}

const emitTaskUpdate = () => {
  socket.emit('updatedTasks');
};

const subscribeToTaskUpdates = (callback: (tasks: any) => void) => {
  socket.on('tasksUpdated', (updatedTasks: any) => {
    callback(updatedTasks);
  });
};


export {
  subscribeToAddNewTaskUpdates, 
  subscribeToUpdateNewTaskUpdates, 
  subscribeToUpdateTasksUpdates,
  subscribeToTaskUpdates,
  emitTaskUpdate, subscribeToDeleteTask
};
