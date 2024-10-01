// src/components/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './components/Column';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const timerRefs = useRef({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('https://new-assignment-todo.onrender.com/api/tasks');
    setTasks(response.data);
  };

  const addTask = async () => {
    const newTask = { title: taskTitle, description: taskDescription, status: 'To Do', timeSpent: 0 };
    const response = await axios.post('https://new-assignment-todo.onrender.com/api/tasks', newTask);
    setTasks((prevTasks) => [...prevTasks, response.data]);
    setTaskTitle('');
    setTaskDescription('');
  };

  const deleteTask = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      await axios.delete(`https://new-assignment-todo.onrender.com/api/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
      Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    const updatedTask = tasks.find(task => task.id === id);
    await axios.patch(`https://new-assignment-todo.onrender.com/api/tasks/${id}`, {
      status: newStatus,
      timeSpent: updatedTask.timeSpent,
    });
    setTasks((prevTasks) => prevTasks.map(task => (task.id === id ? { ...task, status: newStatus } : task)));
  };

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  const startTimer = (id) => {
    if (!timerRefs.current[id]) {
      timerRefs.current[id] = setInterval(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, timeSpent: task.timeSpent + 1 } : task
          )
        );
      }, 1000);
    }
  };

  const pauseTimer = (id) => {
    clearInterval(timerRefs.current[id]);
    delete timerRefs.current[id];
  };

  const resetTimer = (id) => {
    setTasks((prevTasks) => 
      prevTasks.map((task) =>
        task.id === id ? { ...task, timeSpent: 0 } : task
      )
    );
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const editTask = async (id) => {
    const updatedTask = {
      title: editTitle,
      description: editDescription,
    };
    await axios.put(`https://new-assignment-todo.onrender.com/api/tasks/${id}`, updatedTask);
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)));
    setEditingTaskId(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <h1>Todo Application</h1>
        <div className="task-input">
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <div className="status-board">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks.filter(task => task.status === status)}
              moveTask={moveTask}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
              startTimer={startTimer}
              pauseTimer={pauseTimer}
              resetTimer={resetTimer}
              editTask={startEdit}
            />
          ))}
        </div>

        {editingTaskId && (
          <div className="edit-task-modal">
            <h2>Edit Task</h2>
            <input
              type="text"
              placeholder="Edit Task Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Edit Task Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <button onClick={() => editTask(editingTaskId)}>Save</button>
            <button onClick={() => setEditingTaskId(null)}>Cancel</button>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default App;
