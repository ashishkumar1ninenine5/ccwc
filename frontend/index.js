const { useState, useEffect } = React;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  async function loadTasks() {
    const res = await fetch('/tasks');
    const data = await res.json();
    setTasks(data);
  }

  async function addTask(e) {
    e.preventDefault();
    await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    setTitle('');
    loadTasks();
  }

  async function toggleTask(id, completed) {
    const t = tasks.find(t => t.id === id);
    await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: t.title, completed })
    });
    loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={addTask}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id, !task.completed)} />
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
