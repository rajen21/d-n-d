import { ChangeEvent, useState } from "react";

import "./App.css";
import TaskManager from "./TaskManager";
import { initialTasks, Task, TasksProp } from "./data";
import { subscribeToUpdateNewTaskUpdates } from "./service/webSocketService";
import Modal from "./components/Modal";

const initialTaskState: Task = {
  id: '',
  content: '',
  photo: undefined, // or leave it out if you prefer
};

function App() {
  const [tasks, setTasks] = useState<TasksProp>(initialTasks);
  const [editText, setEditText] = useState<Task>(initialTaskState);
  const [contentErr, setContentErr] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e?.target;
    if (val.value) {
      setContentErr(false);
    }
    setEditText((prev) => ({
      ...prev,
      [val.name]: val.value
    }));
  };

  const onSubmit = (setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!editText.content) {
      setContentErr(true);
      return;
    };
    setState(true);
    let {id, ...data} = {...editText};
    if (editText.content) data = { ...data, content: editText.content };
    if (editText.photo) data = { ...data, photo: editText.photo };

    setTasks((prev) => {
      const prevData = JSON.parse(JSON.stringify(prev));
      const ind = prevData.tasks.findIndex((val: Task) => val.id === editText?.id);
      prevData.tasks[ind] = { ...prevData.tasks[ind], ...data };
      return prevData;
    });
    subscribeToUpdateNewTaskUpdates({ id: editText.id, ...data });
    setEditText(initialTaskState);
    setState(false);
  }

  const onCancel = () => {
    setEditText(initialTaskState);
  }

  return (
    <div className="App">
      <main className="disp-flex align-center justify-center height-100">
        <TaskManager
          tasks={tasks}
          setTasks={setTasks}
          setEditText={setEditText}
        />
        {editText.id ? 
          <Modal 
            contentErr={contentErr} 
            editText={editText} 
            onCancel={onCancel} 
            onChange={onChange} 
            onSubmit={onSubmit} 
          />
           : null
        }
      </main>
    </div>
  );
}

export default App;
