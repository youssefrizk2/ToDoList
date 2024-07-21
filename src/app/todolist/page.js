"use client";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp, updateDoc,doc,onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import styles from "./todo.module.css";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5ZxMHwxMFzE4nkB_-Gi5CQ4HRMQNC31s",
  authDomain: "todolist-4a421.firebaseapp.com",
  projectId: "todolist-4a421",
  storageBucket: "todolist-4a421.appspot.com",
  messagingSenderId: "296963303477",
  appId: "1:296963303477:web:2ad61bb9327edcba40e97c",
  measurementId: "G-V0P7BMCJDR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const q = query(collection(db, "tasks"), where("isDone", "==", false));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() !== '') {
      await addDoc(collection(db, "tasks"), {
        task: newTask,
        isDone: false,
        date: serverTimestamp()
      });
      setNewTask(''); // Clear the input field after adding a task
    }
  };

  const handleDoneTask = async (id) => {
    const taskDoc = doc(db, "tasks", id);
    await updateDoc(taskDoc, {
      isDone: true
    });
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.titlediv}>
        <h1 className={styles.title}>To-Do-List</h1>
      </div>
      <div className={styles.todo}>
        <input
          type="text"
          placeholder="Add a new task"
          className={styles.tasktext}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className={styles.button} onClick={handleAddTask}>Add</button>
      </div>
      <div className={styles.taskList}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.task}>
            {task.task}
            <button className={styles.delete} onClick={() => handleDoneTask(task.id)}>Done</button>
          </div>
        ))}
      </div>
    </div>
  );
}