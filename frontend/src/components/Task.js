// src/components/Task.js
import React, { memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { MdOutlineTimer } from "react-icons/md";
import { IoIosPlayCircle } from "react-icons/io";
import { MdPauseCircle } from "react-icons/md";
import { LuTimerReset } from "react-icons/lu";

import '../App.css';

const ItemTypes = {
  TASK: 'task',
};

const Task = memo(({ 
  task, 
  index, 
  moveTask, 
  updateTaskStatus, 
  deleteTask, 
  startTimer, 
  pauseTimer, 
  resetTimer, 
  editTask 
}) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item) {
      if (item.index !== index) {
        moveTask(item.index, index);
        item.index = index; // Update the index of the dragged task
      }
    },
  });

  const handleStart = () => {
    updateTaskStatus(task.id, 'In Progress'); // Update status to "In Progress"
    startTimer(task.id); // Start the timer
  };

  const handleDone = () => {
    updateTaskStatus(task.id, 'Done'); // Update status to "Done"
    pauseTimer(task.id); // Pause the timer when marking as done
  };

  return (
    <div ref={ref} className={`task ${isDragging ? 'dragging' : ''}`}>
      <div className='title-status-con'>
        <h3 className='title'>{task.title}</h3>
        <p className={task.status[0]}>{task.status}</p>
      </div>
      <p className='des'>{task.description}</p>
      <p className='time'><MdOutlineTimer size={20}/> : {task.timeSpent} sec</p>
      <div className="task-timer">
        <button className='timer-btn' onClick={() => startTimer(task.id)}><IoIosPlayCircle className='timer-icon'/></button>
        <button className='timer-btn' onClick={() => pauseTimer(task.id)}><MdPauseCircle className='timer-icon'/></button>
        <button className='timer-btn' onClick={() => resetTimer(task.id)}><LuTimerReset className='timer-icon'/></button>
        </div>

        <div className='task-actions'>
        {task.status === 'To Do' && (
          <button onClick={handleStart}>Start</button>
        )}
        {task.status === 'In Progress' && (
          <button onClick={handleDone}>Done</button>
        )}
        
        <button onClick={() => editTask(task)}>Edit</button>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </div>
  );
});

export default Task;
