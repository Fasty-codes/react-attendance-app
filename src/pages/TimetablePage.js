import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './TodosPage.css';

const TodosPage = () => {
  const { user } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState('');

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(`todos_${user.id}`)) || [];
    setTodos(storedTodos);
  }, [user.id]);

  useEffect(() => {
    localStorage.setItem(`todos_${user.id}`, JSON.stringify(todos));
  }, [todos, user.id]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  
  const startEditing = (todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoText(todo.text);
  };

  const saveEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editingTodoText } : todo
      )
    );
    setEditingTodoId(null);
    setEditingTodoText('');
  };
  
  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingTodoId(null);
      setEditingTodoText('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div className="todos-container">
      <div className="todos-header">
        <h1>My Todos</h1>
        <p>Stay organized and on top of your tasks.</p>
      </div>

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button type="submit" className="add-todo-btn"><i className='bx bx-plus'></i></button>
      </form>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo, index) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''} ${editingTodoId === todo.id ? 'editing' : ''}`}>
              {editingTodoId === todo.id ? (
                <input
                  type="text"
                  value={editingTodoText}
                  onChange={(e) => setEditingTodoText(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                  onBlur={() => saveEdit(todo.id)}
                  className="todo-edit-input"
                  autoFocus
                />
              ) : (
                <>
                  <div className="todo-content">
                    <span className="todo-number">{index + 1}.</span>
                    <span className="todo-checkbox" onClick={() => toggleTodo(todo.id)}>
                      {todo.completed && <i className='bx bx-check'></i>}
                    </span>
                    <span className="todo-text" onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
                  </div>
                  <div className="todo-actions">
                    <button onClick={() => startEditing(todo)} className="edit-todo-btn">
                      <i className='bx bx-pencil'></i>
                    </button>
                    <button onClick={() => deleteTodo(todo.id)} className="delete-todo-btn">
                      <i className='bx bx-trash'></i>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <div className="empty-todos-message">
            <p>No tasks here. Add a new one to get started!</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default TimeTablePage; 
