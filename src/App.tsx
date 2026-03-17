import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { FootprintsBackground } from './components/FootprintsBackground';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { Sidebar, HabitPlan } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { AddPlanModal } from './components/AddPlanModal';

const INITIAL_PLANS: HabitPlan[] = [
  { id: '1', name: '每日冥想 10 分鐘', icon: '🧘', description: '在靜謐中找回內心的平靜。', completedDays: Array(21).fill(false), dailyNotes: Array(21).fill('') },
  { id: '2', name: '早起閱讀', icon: '📖', description: '晨間的文字是靈魂的養分。', completedDays: Array(21).fill(false), dailyNotes: Array(21).fill('') },
  { id: '3', name: '多喝水', icon: '💧', description: '維持身體的純淨與活力。', completedDays: Array(21).fill(false), dailyNotes: Array(21).fill('') },
];

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [plans, setPlans] = useState<HabitPlan[]>(INITIAL_PLANS);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSaveNewPlan = (newPlanData: Omit<HabitPlan, 'id' | 'completedDays' | 'dailyNotes'>) => {
    const newPlan: HabitPlan = {
      ...newPlanData,
      id: Date.now().toString(),
      completedDays: Array(21).fill(false),
      dailyNotes: Array(21).fill(''),
    };
    setPlans([...plans, newPlan]);
    setActivePlanId(newPlan.id);
  };

  const handleToggleDay = (planId: string, dayIndex: number) => {
    setPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id === planId) {
        const newCompletedDays = [...plan.completedDays];
        newCompletedDays[dayIndex] = !newCompletedDays[dayIndex];
        return { ...plan, completedDays: newCompletedDays };
      }
      return plan;
    }));
  };

  const handleSaveNote = (planId: string, dayIndex: number, note: string) => {
    setPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id === planId) {
        const newDailyNotes = [...plan.dailyNotes];
        newDailyNotes[dayIndex] = note;
        return { ...plan, dailyNotes: newDailyNotes };
      }
      return plan;
    }));
  };

  const handleRenamePlan = (id: string, newName: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const handleTogglePin = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p));
  };

  const handleDeletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    if (activePlanId === id) {
      setActivePlanId(null);
    }
  };

  const activePlan = plans.find(p => p.id === activePlanId) || null;

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <motion.main 
          key="landing"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white"
        >
          <AtmosphericBackground />
          <FootprintsBackground />
          
          <div className="relative z-10 text-center px-6 w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="space-y-12"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 text-[10px] font-bold tracking-[0.3em] text-stone-500 uppercase mb-4">
                The Art of Consistency
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1A1A1A] tracking-[0.15em] leading-relaxed whitespace-nowrap overflow-hidden">
                「將你這21天走過的足跡，
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 font-medium">
                  踏實安放在這裡。
                </span>
                」
              </h1>
              
              <p className="text-sm md:text-base text-stone-400 font-light max-w-xl mx-auto leading-relaxed tracking-wide">
                Beautifully crafted habit tracking for those who appreciate the journey as much as the destination.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="pt-4"
              >
                <button 
                  onClick={() => setView('dashboard')}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#1A1A1A] text-white rounded-2xl text-[11px] tracking-[0.2em] transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  GET STARTED
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </motion.div>
            </motion.div>
          </div>

          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            className="absolute bottom-12 left-0 w-full text-center"
          >
            <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-stone-600">
              Footprints &copy; 2026 — Built with Intention
            </p>
          </motion.footer>
        </motion.main>
      ) : (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex h-screen w-full overflow-hidden bg-white"
        >
          <AtmosphericBackground />
          <Sidebar 
            plans={plans} 
            activePlanId={activePlanId} 
            onSelectPlan={setActivePlanId}
            onAddPlan={() => setIsAddModalOpen(true)}
            onRenamePlan={handleRenamePlan}
            onTogglePin={handleTogglePin}
            onDeletePlan={handleDeletePlan}
          />
          <MainContent 
            activePlan={activePlan} 
            onToggleDay={handleToggleDay} 
            onSaveNote={handleSaveNote}
          />

          <AddPlanModal 
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSaveNewPlan}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
