import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smile } from 'lucide-react';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import { HabitPlan } from './Sidebar';

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<HabitPlan, 'id'>) => void;
}

export const AddPlanModal: React.FC<AddPlanModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('✨');
  const [description, setDescription] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name, icon, description });
    setName('');
    setIcon('✨');
    setDescription('');
    onClose();
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setIcon(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/10 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl z-50 overflow-hidden border border-white/20"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-widest">New Habit Plan</h2>
                <button onClick={onClose} className="text-stone-300 hover:text-stone-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Icon Selection */}
                <div className="flex items-center gap-4 relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-3xl hover:bg-stone-100 transition-colors relative"
                  >
                    {icon}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-stone-100">
                      <Smile className="w-3 h-3 text-stone-400" />
                    </div>
                  </button>
                  
                  {showEmojiPicker && (
                    <div className="absolute top-20 left-0 z-[60] shadow-2xl rounded-xl overflow-hidden">
                      <EmojiPicker 
                        onEmojiClick={onEmojiClick}
                        theme={Theme.LIGHT}
                        width={320}
                        height={400}
                        lazyLoadEmojis={true}
                        searchPlaceHolder="搜尋表情符號..."
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      autoFocus
                      type="text"
                      placeholder="計畫名稱..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-2xl border-none focus:ring-0 placeholder:text-stone-200 p-0"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <textarea
                    placeholder="輸入一段簡短的計畫說明..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 text-sm font-light text-stone-600 border-none focus:ring-0 placeholder:text-stone-200 p-0 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSave}
                    disabled={!name.trim()}
                    className="px-8 py-3 bg-stone-900 text-white rounded-full text-xs tracking-widest hover:bg-stone-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    CREATE PLAN
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
