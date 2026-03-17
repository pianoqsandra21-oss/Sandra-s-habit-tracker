import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal, Edit2, Pin, Trash2, PinOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export interface HabitPlan {
  id: string;
  name: string;
  icon: string;
  description?: string;
  completedDays: boolean[];
  dailyNotes: string[];
  isPinned?: boolean;
}

interface SidebarProps {
  plans: HabitPlan[];
  activePlanId: string | null;
  onSelectPlan: (id: string) => void;
  onAddPlan: () => void;
  onRenamePlan: (id: string, newName: string) => void;
  onTogglePin: (id: string) => void;
  onDeletePlan: (id: string) => void;
}

interface MenuPosition {
  top: number;
  left: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  plans, 
  activePlanId, 
  onSelectPlan, 
  onAddPlan,
  onRenamePlan,
  onTogglePin,
  onDeletePlan
}) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDeleteId, setPlanToDeleteId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renamingId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    if (menuOpenId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpenId]);

  const handleMenuAction = (e: React.MouseEvent, action: string, planId: string) => {
    e.stopPropagation();
    if (action === 'rename') {
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        setEditName(plan.name);
        setRenamingId(planId);
      }
    } else if (action === 'pin') {
      onTogglePin(planId);
    } else if (action === 'delete') {
      setPlanToDeleteId(planId);
      setDeleteModalOpen(true);
    }
    setMenuOpenId(null);
  };

  const handleRenameSubmit = (id: string) => {
    if (editName.trim()) {
      onRenamePlan(id, editName.trim());
    }
    setRenamingId(null);
  };

  const handleRenameCancel = () => {
    setRenamingId(null);
  };

  const confirmDelete = () => {
    if (planToDeleteId) {
      onDeletePlan(planToDeleteId);
      setDeleteModalOpen(false);
      setPlanToDeleteId(null);
    }
  };

  const toggleMenu = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    if (menuOpenId === planId) {
      setMenuOpenId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        left: rect.right + 8,
      });
      setMenuOpenId(planId);
    }
  };

  const pinnedPlans = plans.filter(p => p.isPinned);
  const otherPlans = plans.filter(p => !p.isPinned);

  const renderPlanItem = (plan: HabitPlan) => (
    <div key={plan.id} className="relative group w-full overflow-hidden">
      {renamingId === plan.id ? (
        <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/50">
          <span className="text-lg flex-shrink-0">{plan.icon}</span>
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={() => handleRenameSubmit(plan.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit(plan.id);
              if (e.key === 'Escape') handleRenameCancel();
            }}
            className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm font-serif outline-none min-w-0"
          />
        </div>
      ) : (
        <button
          onClick={() => onSelectPlan(plan.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 min-w-0 ${
            activePlanId === plan.id
              ? 'bg-gradient-to-r from-pink-400/30 via-purple-400/30 to-blue-400/30 text-stone-900 font-medium'
              : 'text-stone-500 hover:bg-white/50'
          }`}
        >
          <span className="text-lg flex-shrink-0">{plan.icon}</span>
          <span className="truncate flex-1 text-left min-w-0">{plan.name}</span>
          
          <div
            onClick={(e) => toggleMenu(e, plan.id)}
            className={`p-1 rounded-md hover:bg-stone-300/50 transition-opacity flex-shrink-0 ${
              menuOpenId === plan.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <MoreHorizontal size={14} className="text-stone-500" />
          </div>
        </button>
      )}
    </div>
  );

  const activePlanForMenu = plans.find(p => p.id === menuOpenId);
  const planToDelete = plans.find(p => p.id === planToDeleteId);

  return (
    <aside className="w-64 bg-stone-50/90 backdrop-blur-2xl border-r border-stone-200/50 flex flex-col h-full relative flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-x-hidden">
      {/* Header */}
      <div className="p-6 mb-2">
        <h2 className="text-[10px] font-bold text-stone-400 tracking-[0.2em] uppercase">Footprints</h2>
      </div>

      {/* Plans List */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 space-y-6">
        {/* Pinned Section */}
        {pinnedPlans.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Pinned</h3>
            {pinnedPlans.map(renderPlanItem)}
          </div>
        )}

        {/* All Plans Section */}
        <div className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">All Plans</h3>
          {otherPlans.map(renderPlanItem)}
        </div>
      </nav>

      {/* Floating Context Menu (Portal) */}
      {menuOpenId && createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -10 }}
            transition={{ duration: 0.1 }}
            style={{ 
              position: 'fixed', 
              top: menuPosition.top, 
              left: menuPosition.left,
              zIndex: 9999 
            }}
            className="w-40 bg-white border border-stone-200 rounded-xl shadow-xl py-1 overflow-hidden"
          >
            <button
              onClick={(e) => handleMenuAction(e, 'rename', menuOpenId)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-600 hover:bg-stone-50 transition-colors"
            >
              <Edit2 size={14} />
              <span>重新命名</span>
            </button>
            <button
              onClick={(e) => handleMenuAction(e, 'pin', menuOpenId)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-600 hover:bg-stone-50 transition-colors"
            >
              {activePlanForMenu?.isPinned ? (
                <>
                  <PinOff size={14} />
                  <span>取消釘選</span>
                </>
              ) : (
                <>
                  <Pin size={14} />
                  <span>釘選</span>
                </>
              )}
            </button>
            <div className="h-px bg-stone-100 my-1" />
            <button
              onClick={(e) => handleMenuAction(e, 'delete', menuOpenId)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              <span>刪除</span>
            </button>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation Modal (Portal) */}
      {createPortal(
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          planName={planToDelete?.name || ''}
        />,
        document.body
      )}

      {/* Add Button */}
      <div className="p-4 mt-auto">
        <button
          onClick={onAddPlan}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-400/50 via-purple-400/50 to-blue-400/50 text-white shadow-md hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-xs font-medium"
          title="New Plan"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          建立新計畫
        </button>
      </div>
    </aside>
  );
};

