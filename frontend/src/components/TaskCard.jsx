import { Trash2, Pencil } from 'lucide-react';

const priorityStyles = {
  high:   'bg-red-50 text-red-700',
  medium: 'bg-amber-50 text-amber-700',
  low:    'bg-green-50 text-green-700',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const date = new Date(task.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className={`group bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2 hover:border-gray-300 transition-colors ${task.status === 'done' ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <p className={`text-xs font-medium text-gray-800 leading-snug flex-1 ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(task)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded">
            <Pencil size={12} />
          </button>
          <button onClick={() => onDelete(task._id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-0.5">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${priorityStyles[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <span className="text-[10px] text-gray-300">{date}</span>
      </div>
    </div>
  );
}
