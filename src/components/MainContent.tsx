import React, { useState, useEffect } from 'react';
import { HabitPlan } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';

interface MainContentProps {
  activePlan: HabitPlan | null;
  onToggleDay: (planId: string, dayIndex: number) => void;
  onSaveNote: (planId: string, dayIndex: number, note: string) => void;
}

export const MainContent: React.FC<MainContentProps> = ({ activePlan, onToggleDay, onSaveNote }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Update currentNote when activePlan or selectedDayIndex changes
  useEffect(() => {
    if (activePlan) {
      setCurrentNote(activePlan.dailyNotes[selectedDayIndex] || '');
      setIsEditing(false); // Reset editing mode when changing days
    }
  }, [activePlan, selectedDayIndex]);

  // Auto-adjust height whenever currentNote changes or entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.focus();
    }
  }, [currentNote, isEditing]);

  if (!activePlan) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-white/50 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
            <span className="text-4xl grayscale opacity-50">👣</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 tracking-tight">新增或選擇一個計畫開始你的旅程</h2>
          <p className="text-base text-stone-400 font-light leading-relaxed">
            習慣的養成並非一觸而就，而是每日微小足跡的累積。
          </p>
        </div>
      </div>
    );
  }

  const completedCount = activePlan.completedDays.filter(Boolean).length;

  const handleSave = () => {
    onSaveNote(activePlan.id, selectedDayIndex, currentNote);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <motion.div 
        key={activePlan.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto py-20 px-12"
      >
        {/* Header */}
        <header className="mb-20">
          <div className="text-6xl mb-8 drop-shadow-sm">{activePlan.icon}</div>
          <h1 className="text-5xl font-bold text-stone-900 tracking-tight mb-6">
            {activePlan.name}
          </h1>
          {activePlan.description && (
            <p className="text-xl text-stone-400 font-light leading-relaxed max-w-2xl">
              {activePlan.description}
            </p>
          )}
        </header>

        {/* Tracking Card Section */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest">21 Days Journey</h3>
              <span className="text-sm italic text-stone-500">Day {completedCount} / 21</span>
            </div>

            <div className="glass-card rounded-[3rem] p-16">
              <div className="grid grid-cols-7 gap-y-12 gap-x-6">
                {activePlan.completedDays.map((isCompleted, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        onToggleDay(activePlan.id, index);
                        setSelectedDayIndex(index);
                      }}
                      onMouseEnter={() => setSelectedDayIndex(index)}
                      className="relative group focus:outline-none"
                    >
                      <motion.div
                        animate={isCompleted ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className={`text-3xl transition-all duration-500 ${
                          isCompleted 
                            ? 'grayscale-0 opacity-100' 
                            : 'grayscale opacity-20 hover:opacity-40'
                        } ${selectedDayIndex === index ? 'scale-110' : ''}`}
                      >
                        {activePlan.icon}
                      </motion.div>
                      
                      {/* Completion Indicator Dot */}
                      {isCompleted && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-2 h-2 bg-stone-900 rounded-full"
                        />
                      )}
                    </button>
                    <span className={`text-[10px] uppercase transition-colors ${selectedDayIndex === index ? 'text-stone-900 font-bold' : 'text-stone-300'}`}>
                      D{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Notes Section */}
        <div className="mt-20 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest">today's notes</h3>
            <span className="text-xs text-stone-400 uppercase tracking-widest">Day {selectedDayIndex + 1}</span>
          </div>
          
          <div 
            className={`group relative rounded-[2rem] p-10 transition-all cursor-text ${
              isEditing 
                ? 'glass-card ring-1 ring-stone-200/50' 
                : 'bg-white/30 hover:bg-white/50 border border-transparent hover:border-white/20'
            }`}
            onClick={() => !isEditing && setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <textarea
                  ref={textareaRef}
                  placeholder="在這裡寫下今日的心得..."
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  onBlur={handleSave}
                  rows={2}
                  className="w-full min-h-[3rem] text-sm font-light text-stone-600 border-none focus:ring-0 placeholder:text-stone-200 p-0 resize-none leading-relaxed transition-all overflow-hidden bg-transparent"
                  style={{ height: 'auto' }}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end mt-4"
                >
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSave();
                    }}
                    className="px-5 py-2 bg-stone-900 text-white rounded-full text-[10px] tracking-widest hover:bg-stone-800 transition-all uppercase"
                  >
                    儲存
                  </button>
                </motion.div>
              </>
            ) : (
              <div className="min-h-[3rem]">
                {currentNote ? (
                  <p className="text-sm font-light text-stone-600 leading-relaxed whitespace-pre-wrap">
                    {currentNote}
                  </p>
                ) : (
                  <p className="text-sm font-light text-stone-200 italic">
                    在這裡寫下今日的心得...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
