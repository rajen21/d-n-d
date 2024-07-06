import { Ids } from "../TaskManager";

export interface Task {
  id: string;
  content: string;
  photo?: string;
}

export interface Column {
  id: Ids;
  title: string;
  taskIds: string[];
}


export interface TasksProp {
  tasks: Task[];
  columns: {
    [key in Ids]: Column;
  }
  columnOrder: Ids[]
}

export type Columns = TasksProp["columns"];

export const initialTasks: TasksProp = {
  tasks:[],
  columns: {
    "todo": {
      id: "todo",
      title: "TO DO",
      taskIds: [],
    },
    "inprogress": {
      id: "inprogress",
      title: "IN PROGRESS",
      taskIds: [],
    },
    "completed": {
      id: "completed",
      title: "COMPLETED",
      taskIds: [],
    }
  },
  columnOrder: ["todo", "inprogress", "completed"],
}