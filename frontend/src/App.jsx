import { useTasks } from './hooks/useTasks';
import AddTaskForm from './components/AddTaskForm';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';

export default function App() {
  const {
    tasks, filter, setFilter,
    loading, error,
    addTask, toggleTask, removeTask,
    pendingCount, refetch,
  } = useTasks();

  return (
    <div className="min-h-screen bg-[#0f0c29] relative overflow-hidden flex items-start justify-center px-4 py-12">
      {/* Orbes de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-purple-700/10 blur-3xl" />
      </div>

      {/* Card principal */}
      <div className="relative w-full max-w-xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Suas tarefas
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Lista de{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Tarefas
            </span>
          </h1>
          <p className="text-sm text-white/40 mt-2">Organize seu dia com estilo ✦</p>
        </div>

        {/* Painel glass */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* Adicionar tarefa */}
          <div className="p-5 border-b border-white/10">
            <AddTaskForm onAdd={addTask} />
          </div>

          {/* Filtros */}
          <div className="px-5 py-3 border-b border-white/10">
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              pendingCount={pendingCount}
            />
          </div>

          {/* Lista */}
          <div className="p-5 min-h-[200px]">
            {error ? (
              <div className="flex flex-col items-center py-10 gap-4">
                <span className="text-4xl">⚠️</span>
                <p className="text-red-400 text-sm text-center">{error}</p>
                <button
                  onClick={refetch}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-sm transition-all"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                loading={loading}
                filter={filter}
                onToggle={toggleTask}
                onDelete={removeTask}
              />
            )}
          </div>

          {/* Footer */}
          {tasks.length > 0 && !loading && (
            <div className="px-5 py-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-white/25">
                {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''} no total
              </span>
              <span className="text-xs text-white/25">
                {tasks.filter(t => t.completed).length} concluída{tasks.filter(t => t.completed).length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
