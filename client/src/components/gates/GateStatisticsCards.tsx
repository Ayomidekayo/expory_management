import {
  CheckCircle2,
  Clock3,
  DoorOpen,
  Route,
} from "lucide-react";
import { motion } from "framer-motion";

import type { GateStatistics } from "../../api/gate-movement.api";

interface Props {
  statistics?: GateStatistics;
  isLoading?: boolean;
}

export default function GateStatisticsCards({
  statistics,
  isLoading,
}: Props) {
  const cards = [
    {
      label: "Total Movements",
      value: statistics?.total ?? 0,
      icon: Route,
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      accent: "from-blue-500 to-cyan-400",
      valueColor: "text-slate-900 dark:text-white",
    },
    {
      label: "Pending",
      value: statistics?.pending ?? 0,
      icon: Clock3,
      iconBg: "bg-amber-50 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      accent: "from-amber-500 to-orange-400",
      valueColor: "text-amber-700 dark:text-amber-400",
    },
    {
      label: "Cleared",
      value: statistics?.cleared ?? 0,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      accent: "from-emerald-500 to-teal-400",
      valueColor: "text-emerald-700 dark:text-emerald-400",
    },
    {
      label: "Crossed",
      value: statistics?.crossed ?? 0,
      icon: DoorOpen,
      iconBg: "bg-violet-50 dark:bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
      accent: "from-violet-500 to-purple-400",
      valueColor: "text-violet-700 dark:text-violet-400",
    },
    {
      label: "Terminal Gate",
      value: statistics?.terminalGate ?? 0,
      icon: Route,
      iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      accent: "from-indigo-500 to-blue-400",
      valueColor: "text-indigo-700 dark:text-indigo-400",
    },
    {
      label: "ECOWAS Gate",
      value: statistics?.ecowasGate ?? 0,
      icon: Route,
      iconBg: "bg-rose-50 dark:bg-rose-500/10",
      iconColor: "text-rose-600 dark:text-rose-400",
      accent: "from-rose-500 to-pink-400",
      valueColor: "text-rose-700 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.label}
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: index * 0.07,
              ease: "easeOut",
            }}
            whileHover={{
              y: -5,
              transition: {
                duration: 0.2,
              },
            }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Gradient Accent */}
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`}
            />

            {/* Background Glow */}
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br ${card.accent} opacity-[0.06] blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.12]`}
            />

            <div className="relative flex items-center justify-between gap-4">
              {/* Content */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>

                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                    }}
                    className="mt-3 h-8 w-16 rounded-lg bg-slate-200 dark:bg-slate-700"
                  />
                ) : (
                  <motion.p
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.07 + 0.15,
                    }}
                    className={`mt-2 text-3xl font-bold tracking-tight ${card.valueColor}`}
                  >
                    {card.value.toLocaleString()}
                  </motion.p>
                )}
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotate: 3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
              >
                <Icon size={21} strokeWidth={2} />
              </motion.div>
            </div>

            {/* Bottom Accent */}
            <div className="relative mt-5">
              <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: isLoading ? "0%" : "100%",
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.07 + 0.25,
                    ease: "easeOut",
                  }}
                  className={`h-full rounded-full bg-gradient-to-r ${card.accent} opacity-70`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}