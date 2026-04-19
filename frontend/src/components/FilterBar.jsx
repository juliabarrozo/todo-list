const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: 'Ativas' },
  { key: 'completed', label: 'Concluídas' },
];

export default function FilterBar({ filter, setFilter, pendingCount }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <p className="text-sm text-white/50">
        {pendingCount === 0
          ? 'Nenhuma tarefa pendente 🎉'
          : `${pendingCount} tarefa${pendingCount !== 1 ? 's' : ''} pendente${pendingCount !== 1 ? 's' : ''}`}
      </p>

      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`
              px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${filter === key
                ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-500/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
