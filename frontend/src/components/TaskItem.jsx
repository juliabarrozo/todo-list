import { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(task.id, task.completed); }
    finally { setToggling(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await onDelete(task.id); }
    catch { setDeleting(false); }
  };

  return (
    <div
      className={`
        group flex items-center gap-4 px-4 py-3 rounded-xl
        bg-white/5 border border-white/10
        hover:bg-white/10 hover:border-white/20
        transition-all duration-200
        ${deleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      `}
    >
      {/* Checkbox customizado */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
        className={`
          w-6 h-6 rounded-full border-2 flex-shrink-0
          flex items-center justify-center
          transition-all duration-300
          ${task.completed
            ? 'bg-gradient-to-r from-violet-500 to-indigo-500 border-transparent'
            : 'border-white/30 hover:border-violet-400'
          }
          ${toggling ? 'opacity-50' : ''}
        `}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Título */}
      <span
        className={`
          flex-1 text-sm leading-relaxed transition-all duration-300
          ${task.completed
            ? 'line-through text-white/30'
            : 'text-white/80'
          }
        `}
      >
        {task.title}
      </span>

      {/* Data */}
      <span className="text-xs text-white/25 flex-shrink-0 hidden sm:block">
        {new Date(task.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit', month: 'short'
        })}
      </span>

      {/* Botão deletar */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Deletar tarefa"
        className="
          opacity-0 group-hover:opacity-100
          w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
          text-white/30 hover:text-red-400 hover:bg-red-400/10
          transition-all duration-200
          disabled:opacity-30
        "
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
        </svg>
      </button>
    </div>
  );
}
