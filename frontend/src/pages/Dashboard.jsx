import { useState, useEffect, useCallback } from 'react';
import { Plus, LogOut, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const COLUMNS = [
  { key: 'todo',        label: 'Todo',        dot: 'bg-gray-300' },
  { key: 'in-progress', label: 'In progress',  dot: 'bg-blue-400' },
  { key: 'done',        label: 'Done',         dot: 'bg-green-500' },
];

const PRIORITIES = ['all', 'high', 'medium', 'low'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');      // status filter
  const [priority, setPriority] = useState('all');  // priority filter
  const [modal, setModal] = useState(null);         // null | 'new' | task object

  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (priority !== 'all') params.priority = priority;
      const res = await api.get('/tasks', { params });
      setTasks(res.data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    }
  }, [filter, priority]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSave = async (form) => {
    try {
      if (modal && modal._id) {
        const res = await api.put(`/tasks/${modal._id}`, form);
        setTasks(prev => prev.map(t => t._id === modal._id ? res.data.task : t));
        toast.success('Task updated');
      } else {
        const res = await api.post('/tasks', form);
        setTasks(prev => [res.data.task, ...prev]);
        toast.success('Task created');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const tasksByStatus = (status) => tasks.filter(t => t.status === status);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-44 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col py-5 px-3 gap-1">
        <div className="text-sm font-medium text-gray-900 px-2 pb-5">TaskFlow</div>

        <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs font-medium text-gray-900 bg-gray-100">
          <LayoutGrid size={14} /> Board
        </button>
        <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
          <List size={14} /> All tasks
        </button>

        <div className="mt-auto border-t border-gray-100 pt-3 flex items-center gap-2 px-1">
          <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600 flex-shrink-0">
            {initials}
          </div>
          <span className="text-xs text-gray-400 truncate flex-1">{user?.name}</span>
          <button onClick={handleLogout} className="text-gray-300 hover:text-gray-500 transition-colors" title="Log out">
            <LogOut size={13} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-sm font-medium text-gray-900">Board</h1>
          <button
            onClick={() => setModal('new')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus size={13} /> New task
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 px-6 pb-3 border-b border-gray-200">
          {['all', 'todo', 'in-progress', 'done'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                filter === s
                  ? 'text-gray-900 border border-gray-300 font-medium'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {s === 'all' ? 'All' : s === 'in-progress' ? 'In progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1">
            {PRIORITIES.map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                  priority === p
                    ? 'text-gray-900 border border-gray-300 font-medium'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban columns */}
        <div className="flex-1 grid grid-cols-3 overflow-hidden divide-x divide-gray-200">
          {COLUMNS.map(col => {
            const colTasks = tasksByStatus(col.key);
            return (
              <div key={col.key} className="flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{col.label}</span>
                  </div>
                  <span className="text-[11px] text-gray-300">{colTasks.length}</span>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-2">
                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-gray-300">No tasks</div>
                  )}
                  {colTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={setModal}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setModal('new')}
                  className="mx-3 mb-3 py-2 text-xs text-gray-300 border border-dashed border-gray-200 rounded-lg hover:text-gray-500 hover:border-gray-300 transition-colors"
                >
                  + Add task
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal */}
      {modal && (
        <TaskModal
          task={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
