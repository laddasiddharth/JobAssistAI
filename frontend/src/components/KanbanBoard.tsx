import React from 'react';
import { DndContext, type DragEndEvent, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import ApplicationCard, { type ApplicationData } from './ApplicationCard';

const COLUMNS = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'] as const;

interface KanbanBoardProps {
  applications: ApplicationData[];
  onStatusChange: (id: string, newStatus: string) => void;
  onApplicationClick: (id: string) => void;
}

// Droppable Column Component
const KanbanColumn: React.FC<{ id: string; title: string; applications: ApplicationData[]; onApplicationClick: (id: string) => void }> = ({ id, title, applications, onApplicationClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[250px] max-w-[300px] flex-1 bg-gray-50 rounded-lg p-4 ${isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}
    >
      <h2 className="mb-4 font-bold text-gray-700">
        {title} <span className="ml-2 text-sm font-normal text-gray-500">({applications.length})</span>
      </h2>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {applications.map((app) => (
          <DraggableCard key={app._id} application={app} onClick={onApplicationClick} />
        ))}
      </div>
    </div>
  );
};

// Draggable Card Component
const DraggableCard: React.FC<{ application: ApplicationData; onClick: (id: string) => void }> = ({ application, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application._id,
    data: { application },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 999 : undefined,
        opacity: isDragging ? 0.8 : 1,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
      {/* We stop propagation on the card click to prevent drag events from firing when just trying to open the details */}
      <div onPointerDown={(e) => e.stopPropagation()} onClick={() => onClick(application._id)}>
        <ApplicationCard application={application} onClick={() => {}} />
      </div>
    </div>
  );
};

// Main Board Component
const KanbanBoard: React.FC<KanbanBoardProps> = ({ applications, onStatusChange, onApplicationClick }) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const applicationId = active.id as string;
    const newStatus = over.id as string;

    const application = applications.find((app) => app._id === applicationId);

    if (application && application.status !== newStatus) {
      onStatusChange(applicationId, newStatus);
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 pb-4 overflow-x-auto min-h-[60vh]">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            id={status}
            title={status}
            applications={applications.filter((app) => app.status === status)}
            onApplicationClick={onApplicationClick}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
