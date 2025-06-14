import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

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
    toast.success('✅ Todo Added');
    setNewTodo('');
    fetchTodos();
  };

  const toggleComplete = async (id, completed) => {
    await axios.put(`https://mern-todo-app-zg6z.onrender.com/todos/${id}`, { completed: !completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`https://mern-todo-app-zg6z.onrender.com/todos/${id}`);
    toast.error('❌ Todo Deleted');
    fetchTodos();
  };

  const updateTodo = async (id) => {
    await axios.put(`https://mern-todo-app-zg6z.onrender.com/todos/${id}`, { text: editingText });
    toast.info('✏️ Todo Updated');
    setEditingId(null);
    setEditingText('');
    fetchTodos();
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(todos);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setTodos(reordered);
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
      <ToastContainer />
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} style={styles.todoList}>
                {todos.map((todo, index) => (
                  <Draggable key={todo._id} draggableId={todo._id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...styles.todoItem,
                          ...provided.draggableProps.style,
                          animation: `fadeIn 0.4s ease ${index * 0.1}s both`
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleComplete(todo._id, todo.completed)}
                        />
                        {editingId === todo._id ? (
                          <>
                            <input
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              style={styles.editInput}
                            />
                            <button onClick={() => updateTodo(todo._id)} style={styles.saveButton}>💾</button>
                          </>
                        ) : (
                          <span
                            onDoubleClick={() => {
                              setEditingId(todo._id);
                              setEditingText(todo.text);
                            }}
                            style={{
                              ...styles.todoText,
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              color: darkMode && todo.completed ? '#bbb' : undefined,
                              transition: 'all 0.3s ease',
                              cursor: 'pointer'
                            }}
                          >
                            {todo.text}
                          </span>
                        )}
                        <button style={styles.deleteButton} onClick={() => deleteTodo(todo._id)}>❌</button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          button:hover {
            transform: scale(1.05);
            transition: transform 0.2s ease;
          }

          input[type="checkbox"] {
            cursor: pointer;
            transition: transform 0.2s ease;
          }

          input[type="checkbox"]:hover {
            transform: scale(1.1);
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    transition: 'all 0.3s ease'
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
    width: '60%',
    transition: 'border 0.2s ease'
  },
  editInput: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '6px',
    marginRight: '8px',
    flex: 1
  },
  saveButton: {
    backgroundColor: '#3498db',
    border: 'none',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px'
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
    cursor: 'pointer',
    transition: 'all 0.3s ease'
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
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
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
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default App;
