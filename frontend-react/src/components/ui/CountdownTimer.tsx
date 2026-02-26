import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
interface CountdownTimerProps {
  targetDate: string;
  compact?: boolean;
  className?: string;
}
function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0)
  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: true
  };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60) % 24),
    minutes: Math.floor(diff / (1000 * 60) % 60),
    seconds: Math.floor(diff / 1000 % 60),
    expired: false
  };
}
export function CountdownTimer({
  targetDate,
  compact = false,
  className = ''
}: CountdownTimerProps) {
  const [time, setTime] = useState(getTimeLeft(targetDate));
  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  if (time.expired) {
    return (
      <span className={`text-gray-500 text-sm font-medium ${className}`}>
        Draw completed
      </span>);

  }
  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 text-sm ${className}`}>
        <Clock size={14} className="text-emerald-600" />
        <span className="font-mono font-semibold text-gray-700">
          {time.days}d {String(time.hours).padStart(2, '0')}:
          {String(time.minutes).padStart(2, '0')}:
          {String(time.seconds).padStart(2, '0')}
        </span>
      </div>);

  }
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock size={16} className="text-emerald-600" />
      <div className="flex gap-1.5">
        {[
        {
          val: time.days,
          label: 'd'
        },
        {
          val: time.hours,
          label: 'h'
        },
        {
          val: time.minutes,
          label: 'm'
        },
        {
          val: time.seconds,
          label: 's'
        }].
        map(({ val, label }) =>
        <div
          key={label}
          className="bg-gray-900 text-white rounded-lg px-2 py-1 text-center min-w-[2.5rem]">

            <div className="text-sm font-mono font-bold leading-tight">
              {String(val).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-gray-400 uppercase">{label}</div>
          </div>
        )}
      </div>
    </div>);

}