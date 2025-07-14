import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task } from './sampleData';

interface Props {
  tasks: Task[];
  setTasks: (t: Task[]) => void;
}

const columns = ['To Do', 'In Progress', 'Done'];

export default function BoardView({ tasks, setTasks }: Props) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    setTasks(
      tasks.map(t =>
        t.id === draggableId ? { ...t, status: destination.droppableId as any } : t,
      ),
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {columns.map(col => (
          <Droppable droppableId={col} key={col}>
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 bg-gray-100 rounded p-2"
              >
                <h3 className="font-semibold mb-2">{col}</h3>
                {tasks
                  .filter(t => t.status === col)
                  .map((t, idx) => (
                    <Draggable key={t.id} draggableId={t.id} index={idx}>
                      {p => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          className="bg-white rounded p-2 mb-2 shadow"
                        >
                          <div className="text-sm font-medium">{t.name}</div>
                          <div className="text-xs text-gray-500">{t.type}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
