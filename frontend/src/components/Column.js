// src/components/Column.js
import React from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import '../App.css';

const Column = ({ status, tasks, moveTask, updateTaskStatus, deleteTask, startTimer, pauseTimer, resetTimer, editTask }) => {
  const [, drop] = useDrop({
    accept: 'task',
    drop: (item) => updateTaskStatus(item.id, status),
  });

  return (
    <div ref={drop} className="column">
      <h2>{status}</h2>
      {tasks.map((task, index) => (
        <Task 
          key={task.id} 
          task={task} 
          index={index} 
          moveTask={moveTask} 
          updateTaskStatus={updateTaskStatus} 
          deleteTask={deleteTask} 
          startTimer={startTimer} 
          pauseTimer={pauseTimer} 
          resetTimer={resetTimer}
          editTask={editTask}
        />
      ))}
    </div>
  );
};

export default Column;
