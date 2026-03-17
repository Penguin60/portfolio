"use client";

import React from "react";
import { Info, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

// 1. Callout Component
export const Callout = ({ children, type = "info" }: { children: React.ReactNode, type?: "info" | "warning" | "success" | "tip" }) => {
  const icons = {
    info: <Info className="text-blue-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    success: <CheckCircle className="text-green-500" size={20} />,
    tip: <Lightbulb className="text-purple-500" size={20} />,
  };

  const bgColors = {
    info: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
    warning: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
    success: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
    tip: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
  };

  return (
    <div className={`my-6 flex gap-4 p-4 rounded-xl border ${bgColors[type]}`}>
      <div className="mt-1 flex-shrink-0">{icons[type]}</div>
      <div className="text-sm leading-relaxed prose-p:my-0">{children}</div>
    </div>
  );
};

// 2. StatCard Component
export const StatCard = ({ label, value, trend }: { label: string, value: string, trend?: string }) => (
  <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-1">
    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{label}</span>
    <span className="text-3xl font-bold font-mono">{value}</span>
    {trend && (
      <span className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {trend} from last month
      </span>
    )}
  </div>
);

// 3. Simple Bar Chart Component
export const SimpleChart = ({ data = [], title }: { data: { label: string, value: number }[], title: string }) => {
  if (!data || data.length === 0) {
    return (
      <div className="my-8 p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 text-sm">
        No data provided for chart: {title}
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="my-8 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <h4 className="text-sm font-bold mb-6 text-center text-zinc-500 uppercase tracking-widest">{title}</h4>
      <div className="flex items-end gap-3 h-48 justify-center">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center flex-1 max-w-[40px] gap-2">
            <div 
              className="w-full bg-zinc-800 dark:bg-zinc-100 rounded-t-lg transition-all hover:bg-zinc-600 dark:hover:bg-zinc-300"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />
            <span className="text-[10px] text-zinc-500 font-bold truncate w-full text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
