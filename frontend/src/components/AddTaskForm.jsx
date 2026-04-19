import { useState, useRef } from 'react';

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
      return;
    }
    try {
      setLoading(true);
      await onAdd(title.trim());
      setTitle('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Adicionar nova tarefa..."
        disabled={loading}
        className={`
          flex-1 px-4 py-3 rounded-xl text-sm
          bg-white/10 border border-white/20
          text-white placeholder-white/40
          focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent
          transition-all duration-200
          disabled:opacity-50
          ${shake ? 'animate-shake' : ''}
        `}
      />
      <button
        type="submit"
        disabled={loading}
        className="
          px-6 py-3 rounded-xl text-sm font-semibold
          bg-gradient-to-r from-violet-500 to-indigo-500
          hover:from-violet-400 hover:to-indigo-400
          active:scale-95
          text-white shadow-lg shadow-violet-500/30
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          whitespace-nowrap
        "
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Adicionando...
          </span>
        ) : '+ Adicionar'}
      </button>
    </form>
  );
}
