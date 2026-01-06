
import React, { useMemo, useState } from 'react';

interface LogData {
  date: string; // YYYY-MM-DD
  value: number;
}

interface HealthChartProps {
  data: LogData[];
  barColor: string; // Tailwind class, e.g. "bg-orange-500"
  textColor: string; // Tailwind class, e.g. "text-orange-500"
  unit: string;
  aggregationType?: 'sum' | 'latest' | 'average';
}

export const HealthChart: React.FC<HealthChartProps> = ({ 
  data, 
  barColor, 
  textColor,
  unit, 
  aggregationType = 'latest' 
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
      
      const dayLogs = data.filter(log => log.date === dateStr);
      let dayValue = 0;

      if (dayLogs.length > 0) {
        if (aggregationType === 'sum') {
          dayValue = dayLogs.reduce((acc, curr) => acc + curr.value, 0);
        } else if (aggregationType === 'average') {
          const total = dayLogs.reduce((acc, curr) => acc + curr.value, 0);
          dayValue = total / dayLogs.length;
        } else {
          // Latest
          // Sort by time if available, otherwise assume input order (latest last)
          dayValue = dayLogs[dayLogs.length - 1].value;
        }
      }

      // Round to 1 decimal place for display
      dayValue = Math.round(dayValue * 10) / 10;
      days.push({ label: dayLabel, date: dateStr, value: dayValue });
    }
    return days;
  }, [data, aggregationType]);

  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 h-64 flex flex-col justify-between relative select-none">
       <div className="flex justify-between items-center mb-4">
         <span className="text-xs font-bold text-zinc-500">Last 7 Days</span>
         <span className={`text-xs font-bold ${textColor}`}>
            {aggregationType === 'sum' ? 'Total' : 'Latest'}: {chartData[chartData.length-1].value} {unit}
         </span>
       </div>
       
       <div className="flex-1 flex items-end justify-between gap-2">
          {chartData.map((d, i) => {
             // Calculate height percentage, ensuring at least a sliver is shown if 0 for visual consistency or hide it. 
             // Apple Health hides 0 bars usually.
             const heightPercentage = d.value > 0 ? (d.value / maxValue) * 100 : 0;
             const isHovered = hoverIndex === i;
             
             return (
               <div 
                 key={i} 
                 className="flex-1 flex flex-col justify-end items-center gap-2 group relative h-full cursor-pointer"
                 onMouseEnter={() => setHoverIndex(i)}
                 onMouseLeave={() => setHoverIndex(null)}
               >
                  {/* Tooltip */}
                  {(isHovered) && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap z-20 border border-zinc-700 shadow-xl animate-fade-in">
                       {d.value} {unit}
                    </div>
                  )}

                  <div className="w-full relative h-full flex flex-col justify-end rounded-md overflow-hidden bg-zinc-800/20">
                    {/* The Bar */}
                    <div 
                        className={`w-full rounded-t-md transition-all duration-500 ease-out ${barColor} ${isHovered ? 'opacity-100' : 'opacity-70'}`}
                        style={{ height: `${Math.max(heightPercentage, heightPercentage > 0 ? 5 : 0)}%` }}
                    ></div>
                  </div>

                  <span className={`text-[9px] font-bold uppercase transition-colors ${i === 6 ? 'text-white' : 'text-zinc-600'}`}>{d.label}</span>
               </div>
             )
          })}
       </div>
       {/* Background Lines */}
       <div className="absolute inset-x-6 bottom-12 top-16 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full h-px bg-zinc-800/50"></div>
          <div className="w-full h-px bg-zinc-800/50"></div>
          <div className="w-full h-px bg-zinc-800/50"></div>
       </div>
    </div>
  );
};
