import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

const GlobalSyncProgress = () => {
  const { isSyncing, syncStatus } = useAudio();

  const isComplete = !isSyncing && syncStatus.total > 0 && syncStatus.current >= syncStatus.total;
  const show = isSyncing || isComplete;

  if (!show) return null;

  const percentage = syncStatus.total > 0 ? Math.round((syncStatus.current / syncStatus.total) * 100) : 0;

  return (
    <AnimatePresence>
      {(isSyncing || isComplete) && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: 20 }}
          className="fixed bottom-24 right-6 z-50 pointer-events-none"
        >
          <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl flex items-center gap-4 min-w-[280px] pointer-events-auto">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" className="stroke-white/5" strokeWidth="4" fill="none" />
                <motion.circle 
                  cx="24" cy="24" r="20" 
                  className={isComplete ? "stroke-green-500" : "stroke-brand"}
                  strokeWidth="4" 
                  fill="none" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: syncStatus.current / syncStatus.total }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {isComplete ? (
                  <CheckCircle2 className="text-green-500" size={16} />
                ) : (
                  <span className="text-[10px] font-black text-white">{percentage}%</span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                {isComplete ? 'Importação Finalizada' : 'Sincronizando Spotify'}
                {!isComplete && <Loader2 className="animate-spin text-brand" size={10} />}
              </h5>
              <p className="text-[10px] text-zinc-500 font-medium">
                {isComplete 
                  ? `${syncStatus.total} músicas sincronizadas` 
                  : `${syncStatus.current} de ${syncStatus.total} músicas`}
              </p>
              {!isComplete && (
                <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-brand"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSyncProgress;
