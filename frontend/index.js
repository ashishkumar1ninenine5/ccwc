const { useState, useEffect } = React;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');

  async function loadTasks() {
    const res = await fetch(`/tasks?status=${filter}`);
    const data = await res.json();
    setTasks(data);
  }

  async function addTask(e) {
    e.preventDefault();
    await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, due_date: dueDate || null })
    });
    setTitle('');
    setDueDate('');
    // show newly added task by switching back to the "all" tab
    setFilter('all');
  }

  async function toggleTask(id, completed) {
    const t = tasks.find(t => t.id === id);
    await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: t.title, completed, due_date: t.due_date })
    });
    loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, [filter]);

  return (
    <div className="box">
      <h1 className="title is-3">Todo List</h1>
      <form className="field has-addons" onSubmit={addTask}>
        <div className="control is-expanded">
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="New task" />
        </div>
        <div className="control">
          <input className="input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">Add</button>
        </div>
      </form>

      <div className="tabs is-toggle is-small">
        <ul>
          <li className={filter === 'all' ? 'is-active' : ''}><a onClick={() => setFilter('all')}>All</a></li>
          <li className={filter === 'active' ? 'is-active' : ''}><a onClick={() => setFilter('active')}>Active</a></li>
          <li className={filter === 'completed' ? 'is-active' : ''}><a onClick={() => setFilter('completed')}>Completed</a></li>
        </ul>
      </div>

      <p>{tasks.filter(t => !t.completed).length} of {tasks.length} remaining</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} className={`fade-in ${task.completed ? 'completed' : ''}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id, !task.completed)} />
            <span style={{ flex: 1, marginLeft: '0.5rem' }}>
              {task.title}
              {task.due_date && (
                <small style={{ marginLeft: '0.5rem' }}>(due {task.due_date})</small>
              )}
            </span>
            <button className="button is-small is-danger" onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
