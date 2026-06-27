import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUSES = ['todo', 'in-progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) setForm({ title: task.title, description: task.description || '', status: task.status, priority: task.priority });
  }, [task]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.title.length > 100) e.title = 'Title too long';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = { low: 'bg-green-50 text-green-700 border-green-200', medium: 'bg-amber-50 text-amber-700 border-amber-200', high: 'bg-red-50 text-red-700 border-red-200' };
  const statusLabels = { 'todo': 'Todo', 'in-progress': 'In progress', 'done': 'Done' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-900">{task ? 'Edit task' : 'New task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Title</label>
            <input
              autoFocus
              type="text"
              value={form.title}
              onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setErrors(p => ({ ...p, title: '' })); }}
              placeholder="Task title"
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-colors
                ${errors.title ? 'border-red-300' : 'border-gray-200 focus:border-gray-400'}`}
            />
            {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Description <span className="text-gray-300">(optional)</span></label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Add some details…"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-gray-400 bg-white outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-gray-400 bg-white outline-none transition-colors"
              >
                {STATUSES.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-gray-400 bg-white outline-none transition-colors"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving…' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
