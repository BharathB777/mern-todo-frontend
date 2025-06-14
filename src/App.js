import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    const res = await axios.get('https://mern-todo-app-zg6z.onrender.com/todos');
    setTodos(res.data);
    setLoading(false);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await axios.post('https://mern-todo-app-zg6z.onrender.com/todos', { text: newTodo });
    setNewTodo('');
    fetchTodos();
  };

  const toggleComplete = async (id, completed) => {
    await axios.put(`https://mern-todo-app-zg6z.onrender.com/todos/${id}`, { completed: !completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`https://mern-todo-app-zg6z.onrender.com/todos/${id}`);
    fetchTodos();
  };

  return (
    <div
      style={{
        ...styles.container,
        background: darkMode
          ? 'linear-gradient(to right, #141e30, #243b55)'
          : 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        color: darkMode ? '#fff' : '#333'
      }}
    >
      <h2 style={styles.title}>📝 Todo List</h2>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => setDarkMode(!darkMode)} style={styles.modeButton}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a task..."
        />
        <button style={styles.addButton} onClick={addTodo}>Add</button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>⏳ Loading...</p>
      ) : (
        <ul style={styles.todoList}>
          {todos.map((todo) => (
            <li key={todo._id} style={styles.todoItem}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo._id, todo.completed)}
              />
              <span
                style={{
                  ...styles.todoText,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: darkMode && todo.completed ? '#bbb' : undefined
                }}
              >
                {todo.text}
              </span>
              <button style={styles.deleteButton} onClick={() => deleteTodo(todo._id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    transition: '0.3s ease'
  },
  title: {
    textAlign: 'center'
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    gap: '10px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '60%'
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  modeButton: {
    marginBottom: '20px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#555',
    color: '#fff',
    cursor: 'pointer'
  },
  todoList: {
    listStyle: 'none',
    padding: 0,
    maxWidth: '600px',
    margin: '40px auto 0'
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '10px 15px',
    marginBottom: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  todoText: {
    flex: 1,
    marginLeft: '10px',
    fontSize: '16px'
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    border: 'none',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default App;
