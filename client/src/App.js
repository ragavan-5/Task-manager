
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const API = "/api/tasks";

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await axios.get(API);
      
      const sorted = res.data.sort(
        (a, b) =>
          a.completed - b.completed ||
          new Date(b.created_at) - new Date(a.created_at)
      );
      setTasks(sorted);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await axios.post(API, { title, description });
      const newTask = res.data;
      setTasks([newTask, ...tasks]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  }

  function startEdit(task) {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const res = await axios.put(`${API}/${editingTask.id}`, {
        title,
        description,
        completed: editingTask.completed,
      });

      const updatedTasks = tasks
        .map((t) => (t.id === editingTask.id ? res.data : t))
        .sort(
          (a, b) =>
            a.completed - b.completed ||
            new Date(b.created_at) - new Date(a.created_at)
        );

      setTasks(updatedTasks);
      setEditingTask(null);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error editing task:", err);
    }
  }

  async function deleteTask(id) {
    try {
      await axios.delete(`${API}/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

 
  async function toggleComplete(task) {
    try {
      const res = await axios.put(`${API}/${task.id}`, {
        title: task.title,
        description: task.description,
        completed: task.completed ? 0 : 1,
      });

    
      const updatedTasks = tasks
        .map((t) => (t.id === task.id ? res.data : t))
        .sort(
          (a, b) =>
            a.completed - b.completed ||
            new Date(b.created_at) - new Date(a.created_at)
        );

      setTasks(updatedTasks);
    } catch (err) {
      console.error("Error toggling complete:", err);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Task Manager</h1>
        <p>Connected with MySQL</p>
      </header>

      <main>
        <form onSubmit={editingTask ? saveEdit : addTask} className="task-form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
          />
          <button type="submit">
            {editingTask ? "Save Edit" : "Add Task"}
          </button>
          {!editingTask && (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setTitle("");
                setDescription("");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <section className="tasks">
          {tasks.length === 0 && (
            <p className="empty">No tasks yet — add one!</p>
          )}

          {tasks.map((task) => (
            <article
              key={task.id}
              className={`task ${task.completed ? "done" : ""}`}
            >
              <div className="task-main">
                <h3>
                  {task.completed ? "✔️ " : ""} {task.title}
                </h3>
                <p>{task.description}</p>
              </div>
              <div className="task-actions">
                <button onClick={() => toggleComplete(task)}>
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button onClick={() => startEdit(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)} className="danger">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer>
        <small>Client: 3000 → API: 5000</small>
      </footer>
    </div>
  );
}

export default App;
