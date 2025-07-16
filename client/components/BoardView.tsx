import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { Task } from './sampleData';
import TaskDrawer from './TaskDrawer';

interface Props {
  tasks: Task[];
  setTasks: (t: Task[]) => void;
}

const columns = ['todo', 'in_progress', 'done'];
const labels: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function BoardView({ tasks, setTasks }: Props) {
  const [selected, setSelected] = useState<Task | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    setTasks(
      tasks.map(t =>
        t.id === draggableId ? { ...t, status: destination.droppableId as any } : t,
      ),
    );
  };

  const handleSave = (t: Task) => {
    setTasks(tasks.map(task => (task.id === t.id ? t : task)));
  };

  const addTask = (status: string) => {
    const nextId = (tasks.length + 1).toString();
    setTasks([
      ...tasks,
      {
        id: nextId,
        name: 'New Task',
        status: status as any,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        assignees: [],
        manday: 1,
        type: 'feature',
        iteration: '',
      },
    ]);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col);
            return (
              <Droppable droppableId={col} key={col}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 rounded-md p-2 w-64 flex-shrink-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{labels[col]}</h3>
                      <span className="text-xs text-gray-500">{colTasks.length}</span>
                    </div>
                    {colTasks.map((t, idx) => (
                      <Draggable key={t.id} draggableId={t.id} index={idx}>
                        {p => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            onClick={() => setSelected(t)}
                            className="bg-white rounded-md shadow-sm p-2 mb-2 cursor-pointer hover:shadow"
                          >
                            <div className="text-sm font-medium truncate" title={t.name}>
                              {t.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              #{t.id} · {t.manday}pt{t.iteration ? ` · ${t.iteration}` : ''}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <button
                      className="mt-2 text-xs text-blue-600"
                      onClick={() => addTask(col)}
                    >
                      + Add item
                    </button>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
      <TaskDrawer
        task={selected}
        onClose={() => setSelected(null)}
        onSave={t => {
          handleSave(t);
          setSelected(null);
        }}
      />
    </>
  );
}

