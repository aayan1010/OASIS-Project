"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { workOrders, workOrderColumns, type WorkOrder, type WorkOrderStatus } from "../../../mocks/maintenance";
import KanbanCard from "./KanbanCard";

export default function KanbanBoard() {
  const [items, setItems] = useState<WorkOrder[]>(workOrders);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<WorkOrderStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setOverColumn(null);
      return;
    }
    const overId = over.id as string;
    // Check if hovering over a column
    const column = workOrderColumns.find((c) => c.id === overId);
    if (column) {
      setOverColumn(column.id);
      return;
    }
    // Check if hovering over a card - find its column
    const card = items.find((i) => i.id === overId);
    if (card) {
      setOverColumn(card.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverColumn(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = items.find((i) => i.id === activeId);
    if (!activeItem) return;

    // Check if dropped on a column
    const targetColumn = workOrderColumns.find((c) => c.id === overId);
    if (targetColumn) {
      if (activeItem.status !== targetColumn.id) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === activeId ? { ...i, status: targetColumn.id } : i
          )
        );
      }
      return;
    }

    // Dropped on a card - find its column
    const overItem = items.find((i) => i.id === overId);
    if (overItem) {
      if (activeItem.status !== overItem.status) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === activeId ? { ...i, status: overItem.status } : i
          )
        );
      }
    }
  };

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workOrderColumns.map((column) => {
          const columnItems = items.filter((i) => i.status === column.id);
          const isOver = overColumn === column.id;
          return (
            <div
              key={column.id}
              className={`flex flex-col bg-background-100 rounded-xl border transition-colors ${
                isOver
                  ? "border-primary-300 bg-primary-50/30"
                  : "border-background-200/70"
              }`}
              style={{ minHeight: "400px" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-background-200/70">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${column.color}`}></div>
                  <span className="text-sm font-semibold text-foreground-800">
                    {column.label}
                  </span>
                </div>
                <span className="text-xs font-medium text-foreground-400 bg-background-200/70 px-2 py-0.5 rounded-full">
                  {columnItems.length}
                </span>
              </div>

              <div className="flex-1 p-3 space-y-3">
                <SortableContext
                  items={columnItems.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {columnItems.map((wo) => (
                    <KanbanCard key={wo.id} workOrder={wo} />
                  ))}
                </SortableContext>
              </div>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="opacity-90">
            <KanbanCard workOrder={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}