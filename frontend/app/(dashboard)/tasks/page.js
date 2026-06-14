'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { taskApi } from '@/lib/api';
import {
  Plus, Search, Filter, Trash2, Edit2, CheckCircle2,
  Circle, AlertCircle, RefreshCw, X, Zap,
  ChevronDown, ListChecks
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format, isPast, isToday } from 'date-fns';
import TaskModal from '@/components/tasks/TaskModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';

const STATUS_LABEL = { 'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Completed' };
const STATUSES   = ['all', 'todo', 'in-progress', 'completed'];
const PRIORITIES = ['all', 'high', 'medium', 'low'];
const CATEGORIES = ['all', 'work', 'personal', 'health', 'finance', 'education', 'other'];
const SORTS      = ['createdAt', 'dueDate', 'priority', 'title'];

export default function TasksPage() {
  const [tasks,       setTasks]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [filters,     setFilters]     = useState({ status: 'all', priority: 'all', category: 'all', sortBy: 'createdAt', sortOrder: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [showModal,   setShowModal]   = useState(false);
  const [editTask,    setEditTask]    = useState(null);

  // Quick Add
  const [quickTitle,  setQuickTitle]  = useState('');
  const [quickAdding, setQuickAdding] = useState(false);
  const quickRef = useRef(null);

  // Bulk selection
  const [selectedIds,  setSelectedIds]  = useState(new Set());
  const [bulkMode,     setBulkMode]     = useState(false);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const p = {};
      if (search)                     p.search   = search;
      if (filters.status   !== 'all') p.status   = filters.status;
      if (filters.priority !== 'all') p.priority = filters.priority;
      if (filters.category !== 'all') p.category = filters.category;
      p.sortBy    = filters.sortBy;
      p.sortOrder = filters.sortOrder;
      const res = await taskApi.getAll(p);
      setTasks(res.data.data);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, [search, filters]);

  useEffect(() => {
    const t = setTimeout(fetchTasks, 300);
    return () => clearTimeout(t);
  }, [fetchTasks]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); openCreate(); }
      if (e.key === '/') { e.preventDefault(); quickRef.current?.focus(); }
      if (e.key === 'Escape') { setBulkMode(false); setSelectedIds(new Set()); setBulkMenuOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await taskApi.delete(id); toast.success('Deleted'); fetchTasks(); }
    catch { toast.error('Failed to delete'); }
  };

  const cycleStatus = async (task) => {
    const next = { 'todo': 'in-progress', 'in-progress': 'completed', 'completed': 'todo' };
    try { await taskApi.updateStatus(task._id, next[task.status]); fetchTasks(); }
    catch { toast.error('Failed'); }
  };

  const openEdit   = (t) => { setEditTask(t); setShowModal(true); };
  const openCreate = ()  => { setEditTask(null); setShowModal(true); };

  const handleQuickAdd = async () => {
    if (!quickTitle.trim()) return;
    setQuickAdding(true);
    try {
      await taskApi.create({ title: quickTitle.trim(), status: 'todo', priority: 'medium', category: 'other' });
      toast.success('Task added! ✨');
      setQuickTitle('');
      fetchTasks();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setQuickAdding(false); }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };
  const selectAll = () => {
    if (selectedIds.size === tasks.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(tasks.map(t => t._id)));
  };
  const handleBulkAction = async (action, value) => {
    if (selectedIds.size === 0) return;
    try {
      await taskApi.bulk([...selectedIds], action, value);
      toast.success(`${action === 'delete' ? 'Deleted' : 'Updated'} ${selectedIds.size} tasks`);
      setSelectedIds(new Set());
      setBulkMode(false);
      setBulkMenuOpen(false);
      fetchTasks();
    } catch { toast.error('Bulk action failed'); }
  };

  const StatusIcon = ({ status }) =>
    status === 'completed'  ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
    : status === 'in-progress' ? <RefreshCw className="w-5 h-5 text-cyan-400" />
    : <Circle className="w-5 h-5 tf-text-3" />;

  const activeFilterCount = [filters.status, filters.priority, filters.category].filter(v => v !== 'all').length;

  return (
    <div className="space-y-3 sm:space-y-4">

      {/* ── Quick Add Bar ── */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Zap className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400 pointer-events-none" />
          <input
            ref={quickRef}
            type="text"
            placeholder="Quick add — type & press Enter"
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQuickAdd()}
            disabled={quickAdding}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl text-sm outline-none transition-all border tf-input-field font-medium"
          />
        </div>
        <button
          onClick={handleQuickAdd}
          disabled={quickAdding || !quickTitle.trim()}
          className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50 shadow-violet-sm flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}
        >
          {quickAdding
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Search + Actions bar ── */}
      <div className="flex gap-2 sm:gap-3">
        {/* Search */}
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 tf-text-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl text-sm outline-none transition-all border tf-input-field"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Bulk toggle */}
          <button
            onClick={() => { setBulkMode(!bulkMode); setSelectedIds(new Set()); setBulkMenuOpen(false); }}
            title="Bulk select"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border text-sm font-medium transition-all
              ${bulkMode ? 'text-violet-300 border-violet-500/40 bg-violet-500/15' : 'tf-text-2 tf-border hover:tf-border-hover tf-surface'}`}
          >
            <ListChecks className="w-4 h-4" />
            <span className="hidden sm:inline">Bulk</span>
          </button>

          {/* Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            title="Filters"
            className={`relative flex items-center gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-sm font-medium transition-all
              ${showFilters ? 'text-violet-300 border-violet-500/40 bg-violet-500/15' : 'tf-text-2 tf-border hover:tf-border-hover tf-surface'}`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* New Task */}
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-violet-sm"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">New</span>
            <span className="hidden sm:inline"> Task</span>
            <span className="kbd hidden lg:inline-flex ml-1">N</span>
          </button>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      {showFilters && (
        <div className="rounded-2xl border tf-border p-3.5 sm:p-4 animate-fade-up tf-surface">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { label: 'Status',   key: 'status',   opts: STATUSES   },
              { label: 'Priority', key: 'priority', opts: PRIORITIES  },
              { label: 'Category', key: 'category', opts: CATEGORIES  },
              { label: 'Sort By',  key: 'sortBy',   opts: SORTS       },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[10px] font-semibold tf-text-3 uppercase tracking-wider mb-1.5">{f.label}</label>
                <select
                  value={filters[f.key]}
                  onChange={e => setFilters({ ...filters, [f.key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border tf-input-field capitalize"
                >
                  {f.opts.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={() => { setFilters({ status: 'all', priority: 'all', category: 'all', sortBy: 'createdAt', sortOrder: 'desc' }); setSearch(''); }}
              className="text-xs tf-text-3 hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Reset all
            </button>
          </div>
        </div>
      )}

      {/* ── Bulk Action Bar ── */}
      {bulkMode && (
        <div className="flex items-center gap-2 sm:gap-3 p-3 rounded-xl border border-violet-500/30 animate-fade-up" style={{ background: 'var(--bg-elevated)' }}>
          <button onClick={selectAll} className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors whitespace-nowrap">
            {selectedIds.size === tasks.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-xs tf-text-3 whitespace-nowrap">{selectedIds.size} selected</span>
          <div className="flex-1" />
          {selectedIds.size > 0 && (
            <div className="relative">
              <button
                onClick={() => setBulkMenuOpen(!bulkMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-300 bg-violet-500/20 border border-violet-500/30 hover:bg-violet-500/30 transition-all"
              >
                Actions <ChevronDown className="w-3 h-3" />
              </button>
              {bulkMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border tf-border shadow-xl z-20 p-1.5 tf-card animate-scale-in">
                  <p className="px-2 py-1 text-[10px] font-semibold tf-text-3 uppercase">Change Status</p>
                  {['todo', 'in-progress', 'completed'].map(s => (
                    <button key={s} onClick={() => handleBulkAction('status', s)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs tf-text-2 hover:bg-[var(--bg-hover)] transition-all capitalize">
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                  <div className="border-t tf-border my-1" />
                  <p className="px-2 py-1 text-[10px] font-semibold tf-text-3 uppercase">Change Priority</p>
                  {['low', 'medium', 'high'].map(p => (
                    <button key={p} onClick={() => handleBulkAction('priority', p)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs tf-text-2 hover:bg-[var(--bg-hover)] transition-all capitalize">
                      {p}
                    </button>
                  ))}
                  <div className="border-t tf-border my-1" />
                  <button onClick={() => handleBulkAction('delete')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-all font-semibold">
                    🗑️ Delete Selected
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Count ── */}
      <p className="tf-text-3 text-xs">{tasks.length} task{tasks.length !== 1 ? 's' : ''} found</p>

      {/* ── Task List ── */}
      {loading ? (
        <LoadingSpinner className="h-40" />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No tasks found"
          desc="Create your first task to get started!"
          ctaLabel="Create Task"
          onCta={openCreate}
        />
      ) : (
        <div className="space-y-2 sm:space-y-2.5">
          {tasks.map(task => {
            const overdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed' && !isToday(new Date(task.dueDate));
            const subtaskCount = task.subtasks?.length || 0;
            const subtaskDone  = task.subtasks?.filter(s => s.completed).length || 0;
            return (
              <div
                key={task._id}
                className={`group rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card
                  ${task.status === 'completed' ? 'opacity-60' : ''}
                  ${bulkMode && selectedIds.has(task._id) ? 'border-violet-500/40 bg-violet-500/[0.05]' : ''}`}
                style={{ background: 'var(--bg-surface)', borderColor: bulkMode && selectedIds.has(task._id) ? undefined : 'var(--border)' }}
                onClick={bulkMode ? () => toggleSelect(task._id) : undefined}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  {bulkMode ? (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(task._id)}
                      onChange={() => toggleSelect(task._id)}
                      className="subtask-check mt-0.5 flex-shrink-0"
                    />
                  ) : (
                    <button onClick={() => cycleStatus(task)} className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform">
                      <StatusIcon status={task.status} />
                    </button>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold leading-snug ${task.status === 'completed' ? 'line-through tf-text-3' : 'tf-text-1'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="tf-text-3 text-xs mt-0.5 sm:mt-1 line-clamp-1">{task.description}</p>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
                      <Badge variant="status"   value={task.status}   />
                      <Badge variant="priority" value={task.priority} />
                      <Badge variant="category" value={task.category} />

                      {subtaskCount > 0 && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300 flex items-center gap-1">
                          <ListChecks className="w-3 h-3" /> {subtaskDone}/{subtaskCount}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className={`text-[11px] flex items-center gap-1 font-medium ${overdue ? 'text-rose-400' : 'tf-text-3'}`}>
                          {overdue && <AlertCircle className="w-3 h-3" />}
                          {isToday(new Date(task.dueDate)) ? 'Due today' : format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover Actions */}
                  {!bulkMode && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                      <button
                        onClick={() => openEdit(task)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg tf-text-3 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg tf-text-3 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSaved={() => { setShowModal(false); setEditTask(null); fetchTasks(); }}
        />
      )}
    </div>
  );
}
