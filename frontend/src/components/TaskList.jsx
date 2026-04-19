import TaskItem from './TaskItem';

export default function TaskList({ tasks, loading, filter, onToggle, onDelete }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 rounded-xl bg-white/5 animate-pulse"
            style={{ opacity: 1 - i * 0.2 }}
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    const messages = {
      all: { emoji: '✨', text: 'Nenhuma tarefa por aqui!', sub: 'Adicione sua primeira tarefa acima.' },
      active: { emoji: '🎯', text: 'Nenhuma tarefa ativa.', sub: 'Tudo concluído — ótimo trabalho!' },
      completed: { emoji: '📋', text: 'Nenhuma tarefa concluída.', sub: 'Complete algumas tarefas para vê-las aqui.' },
    };
    const msg = messages[filter] || messages.all;

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-5xl mb-4">{msg.emoji}</span>
        <p className="text-white/60 font-medium">{msg.text}</p>
        <p className="text-white/30 text-sm mt-1">{msg.sub}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="animate-fadeIn"
        >
          <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
