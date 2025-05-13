import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Routine } from '@/types';

interface SortableRoutineProps {
  routine: Routine;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const SortableRoutine: React.FC<SortableRoutineProps> = ({ routine, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: routine.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-4 mb-2 bg-card-bg rounded-lg shadow-sm border border-card-border"
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={routine.completed}
          onChange={() => onToggle(routine.id)}
          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className={`text-lg ${routine.completed ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
          {routine.name}
        </span>
      </div>
      <button
        onClick={() => onDelete(routine.id)}
        className="text-text-tertiary hover:text-progress-danger"
      >
        삭제
      </button>
    </div>
  );
};

export default SortableRoutine; 