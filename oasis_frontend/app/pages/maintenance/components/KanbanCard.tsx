import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { WorkOrder } from "../../../mocks/maintenance";

interface KanbanCardProps {
  workOrder: WorkOrder;
}

const priorityStyles = {
  critical: "bg-accent-100 text-accent-700 border-accent-200",
  high: "bg-accent-50 text-accent-600 border-accent-100",
  medium: "bg-secondary-100 text-secondary-700 border-secondary-200",
  low: "bg-background-100 text-foreground-600 border-background-200",
};

const priorityLabel = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function KanbanCard({ workOrder }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workOrder.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverdue = workOrder.dueDate < "2026-06-20" && workOrder.status !== "closed";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-background-50 rounded-lg border border-background-200/70 p-3 cursor-grab active:cursor-grabbing hover:border-background-300/60 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10px] font-semibold text-foreground-400 uppercase tracking-wider">
          {workOrder.woNumber}
        </span>
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${priorityStyles[workOrder.priority]}`}
        >
          {priorityLabel[workOrder.priority]}
        </span>
      </div>

      <h4 className="text-sm font-medium text-foreground-800 mb-2 line-clamp-2">
        {workOrder.title}
      </h4>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 text-[10px] font-semibold">
          {workOrder.assigneeInitials}
        </div>
        <span className="text-xs text-foreground-500">{workOrder.assignee}</span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <i className="ri-server-line text-foreground-400"></i>
          <span className="text-foreground-500">{workOrder.asset}</span>
        </div>
        {isOverdue && (
          <span className="text-[10px] text-accent-600 font-medium bg-accent-50 px-1.5 py-0.5 rounded">
            Overdue
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-background-100">
        <div className="flex items-center gap-1 text-[10px] text-foreground-400">
          <i className="ri-time-line"></i>
          <span>{workOrder.estimatedHours}h est</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-foreground-400">
          <i className="ri-calendar-line"></i>
          <span>{workOrder.dueDate.slice(5)}</span>
        </div>
      </div>

      {workOrder.actualHours > 0 && (
        <div className="mt-2">
          <div className="w-full h-1 bg-background-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-400 rounded-full"
              style={{
                width: `${Math.min((workOrder.actualHours / workOrder.estimatedHours) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-[10px] text-foreground-400 mt-0.5">
            {workOrder.actualHours}h / {workOrder.estimatedHours}h
          </p>
        </div>
      )}

      {workOrder.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {workOrder.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-background-100 text-foreground-500 px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}