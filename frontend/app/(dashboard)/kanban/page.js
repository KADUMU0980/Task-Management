'use client';
import { useState, useEffect } from 'react';
import { taskApi } from '@/lib/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical, Zap, ListChecks } from 'lucide-react';
import toast from 'react-hot-toast';
import TaskModal from '@/components/tasks/TaskModal';
import { format } from 'date-fns';

const COLS = [
  { id:'todo',        label:'To Do',       dot:'bg-slate-400',   cnt:'bg-slate-500/20 text-slate-400', border:'var(--border)' },
  { id:'in-progress', label:'In Progress', dot:'bg-cyan-400',    cnt:'bg-cyan-500/20 text-cyan-400',   border:'rgba(6,182,212,0.25)' },
  { id:'completed',   label:'Completed',   dot:'bg-emerald-400', cnt:'bg-emerald-500/20 text-emerald-400', border:'rgba(16,185,129,0.25)' },
];
const P_DOT = { high:'bg-rose-400', medium:'bg-amber-400', low:'bg-emerald-400' };

export default function KanbanPage() {
  const [tasks,     setTasks]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [defStatus, setDefStatus] = useState('todo');
  const [editTask,  setEditTask]  = useState(null);

  const fetch = async () => {
    try { const r = await taskApi.getAll({ limit: 200 }); setTasks(r.data.data); }
    catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const colTasks = (id) => tasks.filter(t => t.status === id).sort((a,b) => (a.order||0)-(b.order||0));

  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const newStatus = destination.droppableId;
    setTasks(prev => prev.map(t => t._id === draggableId ? { ...t, status: newStatus } : t));
    try {
      await taskApi.updateStatus(draggableId, newStatus);
      if (newStatus === 'completed') toast.success('Task completed! 🎉');
    } catch { toast.error('Failed to move'); fetch(); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-[3px] border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="tf-text-3 text-sm">{tasks.length} tasks · drag to change status</p>
        <button onClick={() => { setDefStatus('todo'); setEditTask(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-violet-sm hover:-translate-y-0.5 transition-all"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Board — horizontal scroll on mobile */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1" style={{ minHeight: '60vh' }}>
          {COLS.map(col => {
            const ct = colTasks(col.id);
            return (
              <div key={col.id} className="flex flex-col rounded-2xl border flex-shrink-0 w-[85vw] sm:w-80 lg:flex-1 tf-surface"
                style={{ borderColor: col.border, minWidth: 0 }}>
                {/* Column header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: col.border }}>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${col.dot} shadow-[0_0_6px_currentColor]`} />
                    <span className="tf-text-1 font-semibold text-sm">{col.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${col.cnt}`}>{ct.length}</span>
                    <button onClick={() => { setDefStatus(col.id); setEditTask(null); setShowModal(true); }}
                      className="w-6 h-6 flex items-center justify-center rounded-lg tf-text-3 hover:tf-text-1 hover:bg-[var(--bg-hover)] transition-all">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <Droppable droppableId={col.id}>
                  {(prov, snap) => (
                    <div ref={prov.innerRef} {...prov.droppableProps}
                      className={`flex-1 p-3 space-y-2.5 transition-colors rounded-b-2xl ${snap.isDraggingOver ? 'bg-violet-500/[0.05]' : ''}`}
                      style={{ minHeight: 120 }}>
                      {ct.length === 0 && !snap.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center h-28 tf-text-3">
                          <Zap className="w-7 h-7 mb-2" />
                          <p className="text-xs">Drop tasks here</p>
                        </div>
                      )}
                      {ct.map((task, i) => {
                        const subtaskCount = task.subtasks?.length || 0;
                        const subtaskDone = task.subtasks?.filter(s => s.completed).length || 0;
                        return (
                          <Draggable key={task._id} draggableId={task._id} index={i}>
                            {(p, s) => (
                              <div ref={p.innerRef} {...p.draggableProps}
                                className={`rounded-xl p-3.5 border transition-all cursor-grab active:cursor-grabbing select-none
                                  ${s.isDragging ? 'shadow-[0_16px_48px_var(--shadow-strong)] border-violet-500/50 rotate-1 scale-[1.03]' : 'hover:tf-border-hover'}`}
                                style={{ background: 'var(--bg-elevated)', borderColor: s.isDragging ? 'rgba(124,58,237,0.5)' : 'var(--border)', ...p.draggableProps.style }}
                                onClick={() => { setEditTask(task); setShowModal(true); }}>
                                <div className="flex items-start gap-2">
                                  <div {...p.dragHandleProps} className="tf-text-3 hover:tf-text-2 transition-colors mt-0.5 flex-shrink-0">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold leading-snug mb-2 ${task.status==='completed'?'line-through tf-text-3':'tf-text-1'}`}>
                                      {task.title}
                                    </p>
                                    {task.description && <p className="tf-text-3 text-xs line-clamp-2 mb-2">{task.description}</p>}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${P_DOT[task.priority]}`} />
                                        <span className="tf-text-3 text-xs capitalize">{task.priority}</span>
                                        <span className="tf-text-3">·</span>
                                        <span className="tf-text-3 text-xs capitalize">{task.category}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {subtaskCount > 0 && (
                                          <span className="text-[10px] text-violet-400 flex items-center gap-0.5">
                                            <ListChecks className="w-3 h-3" /> {subtaskDone}/{subtaskCount}
                                          </span>
                                        )}
                                        {task.dueDate && (
                                          <span className="tf-text-3 text-xs">{format(new Date(task.dueDate),'MMM d')}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {prov.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {showModal && (
        <TaskModal task={editTask} defaultStatus={defStatus}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSaved={() => { setShowModal(false); setEditTask(null); fetch(); }} />
      )}
    </div>
  );
}
