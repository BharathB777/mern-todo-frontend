import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://mern-todo-app-zg6z.onrender.com'; // ✅ Render backend URL

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/todos`, { text: newTodo });
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`${API_BASE_URL}/todos/${id}`, { completed: !completed });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>📝 Todo List</h2>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter a task..."
      />
      <button onClick={addTodo}>Add</button>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo._id} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo._id, todo.completed)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                marginLeft: 10,
                flex: 1
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
