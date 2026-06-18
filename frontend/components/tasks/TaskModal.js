'use client';
import { useState } from 'react';
import { taskApi } from '@/lib/api';
import { X, Calendar, Tag, Flag, Layers, AlignLeft, Type, Send, MessageSquare, Plus, Trash2, ListChecks } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const STATUSES = [
  { v:'todo',        l:'To Do',       cls:'bg-slate-500/20  text-slate-400  border-slate-500/30'   },
  { v:'in-progress', l:'In Progress', cls:'bg-cyan-500/20   text-cyan-400   border-cyan-500/30'    },
  { v:'completed',   l:'Completed',   cls:'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
];
const PRIORITIES = [
  { v:'low',    l:'Low',    cls:'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { v:'medium', l:'Medium', cls:'bg-amber-500/20   text-amber-400   border-amber-500/30'  },
  { v:'high',   l:'High',   cls:'bg-rose-500/20    text-rose-400    border-rose-500/30'   },
];
const CATEGORIES = ['work','personal','health','finance','education','other'];

const inputCls = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border tf-input-field';

export default function TaskModal({ task, defaultStatus='todo', onClose, onSaved }) {
  const isEdit = !!task;
  const [form, setForm] = useState({
    title:           task?.title       || '',
    description:     task?.description || '',
    status:          task?.status      || defaultStatus,
    priority:        task?.priority    || 'medium',
    category:        task?.category    || 'other',
    dueDate:         task?.dueDate ? format(new Date(task.dueDate),'yyyy-MM-dd') : '',
    tags:            task?.tags?.join(', ') || '',
  });
  const [activeTab,    setActiveTab]    = useState('details');
  const [loading,      setLoading]      = useState(false);
  const [comment,      setComment]      = useState('');
  const [addingComment,setAddingComment]= useState(false);

  // Subtasks state
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      const data = {
        ...form,
        tags:    form.tags ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : [],
        dueDate: form.dueDate || null,
        subtasks: isEdit ? undefined : subtasks, // Only send subtasks on create
      };
      if (isEdit) { await taskApi.update(task._id, data); toast.success('Task updated!'); }
      else        { await taskApi.create(data); toast.success('Task created! ✨'); }
      onSaved();
    } catch(err) { toast.error(err.response?.data?.message||'Something went wrong'); }
    finally { setLoading(false); }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setAddingComment(true);
    try { await taskApi.addComment(task._id, comment); toast.success('Comment added!'); setComment(''); onSaved(); }
    catch { toast.error('Failed to add comment'); }
    finally { setAddingComment(false); }
  };

  // Subtask handlers
  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    if (isEdit) {
      try {
        const res = await taskApi.addSubtask(task._id, newSubtask.trim());
        setSubtasks(res.data.data.subtasks);
        setNewSubtask('');
      } catch { toast.error('Failed to add subtask'); }
    } else {
      setSubtasks([...subtasks, { _id: Date.now().toString(), text: newSubtask.trim(), completed: false }]);
      setNewSubtask('');
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    if (isEdit) {
      setTogglingId(subtaskId);
      try {
        const res = await taskApi.toggleSubtask(task._id, subtaskId);
        setSubtasks(res.data.data.subtasks);
      } catch { toast.error('Failed'); }
      finally { setTogglingId(null); }
    } else {
      setSubtasks(subtasks.map(s => s._id === subtaskId ? { ...s, completed: !s.completed } : s));
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (isEdit) {
      try {
        const res = await taskApi.deleteSubtask(task._id, subtaskId);
        setSubtasks(res.data.data.subtasks);
      } catch { toast.error('Failed'); }
    } else {
      setSubtasks(subtasks.filter(s => s._id !== subtaskId));
    }
  };

  const completedSubtasks = subtasks.filter(s => s.completed).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:p-5 tf-overlay modal-container"
      onClick={e => e.target===e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg sm:max-w-lg max-h-[96dvh] sm:max-h-[92vh] flex flex-col rounded-3xl border tf-border shadow-[0_32px_80px_var(--shadow-strong)] animate-scale-in overflow-hidden tf-modal modal-inner">

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b tf-border flex-shrink-0">
          <h2 className="tf-text-1 font-bold text-base">{isEdit ? 'Edit Task' : '✨ Create New Task'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl tf-text-2 hover:text-white hover:bg-[var(--bg-hover)] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs (edit only) */}
        {isEdit && (
          <div className="flex gap-1 px-5 sm:px-6 pt-3 flex-shrink-0">
            {[{id:'details',l:'Details'},{id:'subtasks',l:`Subtasks (${completedSubtasks}/${subtasks.length})`},{id:'comments',l:`Comments${task?.comments?.length?` (${task.comments.length})`:''}`}].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${activeTab===t.id ? 'text-violet-300 border border-violet-500/30 bg-violet-500/[0.15]' : 'tf-text-3 hover:text-slate-300'}`}>
                {t.l}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* — Details Tab — */}
          {activeTab === 'details' && (
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              {/* Title — Prominent, always visible */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold tf-text-3 uppercase tracking-wider">
                  <Type className="w-3 h-3" /> Title <span className="text-rose-400">*</span>
                </label>
                <input id="task-title" type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
                  placeholder="What needs to be done?"
                  autoFocus
                  className={`${inputCls} text-base font-semibold`}/>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold tf-text-3 uppercase tracking-wider">
                  <AlignLeft className="w-3 h-3" /> Description
                </label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                  placeholder="Add more details…" rows={3}
                  className={`${inputCls} resize-none`}/>
              </div>

              {/* Status + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold tf-text-3 uppercase tracking-wider">
                    <Layers className="w-3 h-3" /> Status
                  </label>
                  <div className="space-y-1.5">
                    {STATUSES.map(s => (
                      <button key={s.v} type="button" onClick={()=>setForm({...form,status:s.v})}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all
                          ${form.status===s.v ? s.cls : 'tf-border tf-text-3 hover:tf-border-hover'}`}
                        style={form.status!==s.v ? { background:'var(--bg-hover)' } : {}}>
                        {s.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold tf-text-3 uppercase tracking-wider">
                    <Flag className="w-3 h-3" /> Priority
                  </label>
                  <div className="space-y-1.5">
                    {PRIORITIES.map(p => (
                      <button key={p.v} type="button" onClick={()=>setForm({...form,priority:p.v})}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all
                          ${form.priority===p.v ? p.cls : 'tf-border tf-text-3 hover:tf-border-hover'}`}
                        style={form.priority!==p.v ? { background:'var(--bg-hover)' } : {}}>
                        {p.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold tf-text-3 uppercase tracking-wider">
                  <Layers className="w-3 h-3" /> Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={()=>setForm({...form,category:cat})}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border
                        ${form.category===cat
                          ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                          : 'tf-border tf-text-3 hover:border-violet-500/25'}`}
                      style={form.category!==cat ? { background:'var(--bg-hover)' } : {}}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date + Tags */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold tf-text-3 uppercase tracking-wider">
                    <Calendar className="w-3 h-3" /> Due Date
                  </label>
                  <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}
                    className={inputCls} style={{ colorScheme:'var(--date-scheme)' }}/>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold tf-text-3 uppercase tracking-wider">
                    <Tag className="w-3 h-3" /> Tags
                  </label>
                  <input type="text" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}
                    placeholder="tag1, tag2…"
                    className={inputCls}/>
                </div>
              </div>

              {/* Subtasks (create mode) */}
              {!isEdit && (
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold tf-text-3 uppercase tracking-wider">
                    <ListChecks className="w-3 h-3" /> Subtasks
                  </label>
                  {subtasks.length > 0 && (
                    <div className="space-y-1">
                      {subtasks.map(s => (
                        <div key={s._id} className="flex items-center gap-2 px-3 py-2 rounded-lg border tf-border" style={{ background:'var(--bg-hover)' }}>
                          <input type="checkbox" checked={s.completed} onChange={() => handleToggleSubtask(s._id)} className="subtask-check" />
                          <span className={`flex-1 text-sm ${s.completed ? 'line-through tf-text-3' : 'tf-text-1'}`}>{s.text}</span>
                          <button type="button" onClick={() => handleDeleteSubtask(s._id)} className="tf-text-3 hover:text-rose-400 transition-colors p-0.5">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input type="text" value={newSubtask} onChange={e=>setNewSubtask(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),handleAddSubtask())}
                      placeholder="Add a subtask…" className={`flex-1 ${inputCls} !py-2`}/>
                    <button type="button" onClick={handleAddSubtask} disabled={!newSubtask.trim()}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-white flex-shrink-0 transition-all disabled:opacity-40"
                      style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0 shadow-violet-sm hover:shadow-violet-md"
                style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isEdit ? 'Save Changes' : '✨ Create Task')}
              </button>
            </form>
          )}

          {/* — Subtasks Tab (edit mode) — */}
          {activeTab==='subtasks' && isEdit && (
            <div className="p-5 sm:p-6 space-y-4">
              {/* Progress */}
              {subtasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="tf-text-2 font-medium">{completedSubtasks} of {subtasks.length} completed</span>
                    <span className="text-violet-400 font-bold">{subtasks.length > 0 ? Math.round((completedSubtasks/subtasks.length)*100) : 0}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'var(--bg-elevated)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width:`${subtasks.length > 0 ? (completedSubtasks/subtasks.length)*100 : 0}%`, background:'linear-gradient(135deg,#7c3aed,#06b6d4)' }} />
                  </div>
                </div>
              )}

              {/* Subtask list */}
              <div className="space-y-1.5">
                {subtasks.length === 0 ? (
                  <div className="text-center py-8">
                    <ListChecks className="w-8 h-8 tf-text-3 mx-auto mb-2" />
                    <p className="tf-text-3 text-sm">No subtasks yet.</p>
                  </div>
                ) : subtasks.map(s => (
                  <div key={s._id} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border tf-border transition-all hover:border-violet-500/20"
                    style={{ background:'var(--bg-hover)' }}>
                    <input type="checkbox" checked={s.completed}
                      onChange={() => handleToggleSubtask(s._id)}
                      disabled={togglingId === s._id}
                      className="subtask-check" />
                    <span className={`flex-1 text-sm transition-all ${s.completed ? 'line-through tf-text-3' : 'tf-text-1'}`}>
                      {s.text}
                    </span>
                    <button onClick={() => handleDeleteSubtask(s._id)}
                      className="tf-text-3 hover:text-rose-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                      style={{ opacity: 1 }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add subtask */}
              <div className="flex gap-2">
                <input type="text" value={newSubtask} onChange={e=>setNewSubtask(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handleAddSubtask()}
                  placeholder="Add a subtask…"
                  className={`flex-1 ${inputCls}`}/>
                <button onClick={handleAddSubtask} disabled={!newSubtask.trim()}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-white flex-shrink-0 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* — Comments Tab — */}
          {activeTab==='comments' && isEdit && (
            <div className="p-5 sm:p-6 space-y-4">
              <div className="space-y-3">
                {task?.comments?.length > 0 ? task.comments.map(c => (
                  <div key={c._id} className="flex items-start gap-3 p-3.5 rounded-xl border tf-border"
                    style={{ background:'var(--bg-hover)' }}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {c.userName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="tf-text-1 text-xs font-semibold">{c.userName}</span>
                        <span className="tf-text-3 text-[11px]">{format(new Date(c.createdAt),'MMM d, h:mm a')}</span>
                      </div>
                      <p className="tf-text-2 text-sm leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 tf-text-3 mx-auto mb-2" />
                    <p className="tf-text-3 text-sm">No comments yet.</p>
                  </div>
                )}
              </div>
              {/* Comment input */}
              <div className="flex gap-2">
                <input type="text" value={comment} onChange={e=>setComment(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handleComment()}
                  placeholder="Write a comment…"
                  className={`flex-1 ${inputCls}`}/>
                <button onClick={handleComment} disabled={addingComment||!comment.trim()}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-white flex-shrink-0 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background:'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
