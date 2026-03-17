import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200"
          >
            <div className="p-8 text-center">
              <h3 className="text-xl font-medium text-stone-900 mb-3 font-serif">
                確認刪除此計畫？
              </h3>
              <p className="text-sm text-stone-500 mb-8 font-serif">
                若刪除此計畫將無法復原！
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-serif text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-serif text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
