import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import ColumnTab from './components/Column';
import {emitTaskUpdate, subscribeToDeleteTask, subscribeToTaskUpdates, subscribeToUpdateTasksUpdates} from "./service/webSocketService";
import { Column, Task, TasksProp } from './data';

export type Ids = "todo" | "inprogress" | "completed";

interface TaskManagerProps {
  tasks: TasksProp;
  setTasks: Dispatch<SetStateAction<TasksProp>>;
  setEditText: (Task: Task) => void;
}

const reorderColumnList = (sourceCol: Column, startInd: number, endInd: number) => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startInd, 1);
  newTaskIds.splice(endInd, 0, removed);
  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  }
  return newColumn;
}

const TaskManager: React.FC<TaskManagerProps> = ({tasks, setTasks, setEditText}) => {

  const onDragEnd = (result: DropResult) => {
    const destination = result.destination;
    const source = result.source;
    const sKey: Ids = source.droppableId as Ids;
    const dKey: Ids = destination?.droppableId as Ids;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const sourceCol = tasks.columns[sKey];
    const destinationCol = tasks.columns[dKey];

    if (sourceCol?.id === destinationCol?.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...tasks,
        columns: {
          ...tasks.columns,
          [newColumn.id]: newColumn,
        }
      };
      
      setTasks(newState);
      subscribeToUpdateTasksUpdates(
        newColumn.id, 
        source.index, 
        newColumn.id,
        newColumn.taskIds[destination.index],
        destination.index
      );
      return;
    }

    const startTaskIds = Array.from(sourceCol.taskIds);

    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(destinationCol?.taskIds);

    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };

    const newState = {
      ...tasks,
      columns: {
        ...tasks.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };

    setTasks(newState);
    subscribeToUpdateTasksUpdates(
      newStartCol.id,
      source.index,
      newEndCol.id, 
      newEndCol.taskIds[destination.index],
      destination.index
    );
  };

  const onDelete = (id: string, key: Ids) => {
    const cloneTasks = JSON.parse(JSON.stringify(tasks));
    const data = cloneTasks.columns[key].taskIds.filter((val: string) => val !== id);
    const taskIdInd = cloneTasks.columns[key].taskIds.findIndex((val: string) => val === id);
    cloneTasks.columns[key].taskIds = data;
    setTasks(cloneTasks);
    subscribeToDeleteTask(id, key, taskIdInd);
  }

  useEffect(() => {
    emitTaskUpdate();
    subscribeToTaskUpdates((updatedTasks) => {
      setTasks(updatedTasks);
    });
    return () => {

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='grids'>
        {tasks?.columnOrder?.map((cId: Ids) => {
          const column = tasks?.columns[cId];
          const cTasks = column.taskIds.map((cId: string) => tasks.tasks.find((tId) => cId === tId.id)) as Task[];

          return <ColumnTab 
            key={column.id} 
            column={column} 
            tasks={cTasks}
            onDelete={onDelete} 
            setEditText={setEditText}
          />
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskManager;