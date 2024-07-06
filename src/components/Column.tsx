import React, { ChangeEvent, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { subscribeToAddNewTaskUpdates } from "../service/webSocketService";
import { Column, Task } from "../data";
import { Ids } from "../TaskManager";

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onDelete: (val: string, key: Ids) => void;
  setEditText: (Task: Task) => void;
}

const TaskColumn: React.FC<ColumnProps> = ({ column, tasks, onDelete, setEditText }) => {
  const [val, setVal] = useState({ todo: "", inprogress: "", completed: "" });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e?.target;
    setVal((prev) => ({
      ...prev,
      [key?.name]: key?.value,
    }));
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    e.stopPropagation();
    onDelete(id, column.id);
  }

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && val[column.id]) {
      const task = {
        content: val[column.id]
      };
      subscribeToAddNewTaskUpdates(task, column.id);
      setVal((prev) => ({
        ...prev,
        [column.id]: "",
      }));
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <div id="title" className="column-title">
          <span>
            {column.title} {column?.taskIds?.length}
          </span>
        </div>
        <div className="input-task">
          <input
            onKeyDown={onEnter}
            name={column.id}
            value={val?.[column.id]}
            placeholder="+"
            type="text"
            onChange={onInputChange}
          />
        </div>
      </div>
      <Droppable droppableId={column.id}>
        {(dProvider, dSnapshot) => {
          return (
            <div
              className="column-body"
              ref={dProvider.innerRef}
              {...dProvider.droppableProps}
            >
              {tasks.map((task, ind) => {
                return (
                  <Draggable
                    key={task?.content}
                    draggableId={task?.content}
                    index={ind}
                  >
                    {(dragProvider, dragSnapshot) => (
                      <div
                        className="disp-flex justify-between"
                        ref={dragProvider.innerRef}
                        {...dragProvider.draggableProps}
                        {...dragProvider.dragHandleProps}
                        onClick={() => setEditText(task)}
                      >
                        <section>
                          <span>{task?.content}</span>
                          {task?.photo ? (
                            <img className="images" src={task?.photo} alt="img" />
                          ) : null}
                        </section>
                        <button onClick={(e) => handleDelete(e, task?.id)}>
                          X
                        </button>
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
