import React from 'react';

export interface TimeSelectorProps {
  sessions: string[];
  selectedTime: string;
  selectedDate: string;
  onTimeSelect: (time: string) => void;
  isBookingAvailable: (date: string, time: string) => boolean;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  sessions,
  selectedTime,
  selectedDate,
  onTimeSelect,
  isBookingAvailable,
}) => {
  const getTimeButtonClass = (
    isSelected: boolean,
    isAvailable: boolean
  ): string => {
    if (isSelected) return "bg-blue-500 text-white";
    if (isAvailable) return "bg-gray-200 hover:bg-gray-300";
    return "bg-gray-100 text-gray-400 cursor-not-allowed";
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl mb-2">Выберите время:</h2>
      <div className="flex gap-2 flex-wrap">
        {sessions.map((time) => {
          const available = isBookingAvailable(selectedDate, time);
          return (
            <button
              key={time}
              onClick={() => onTimeSelect(time)}
              disabled={!available}
              className={`px-4 py-2 rounded ${getTimeButtonClass(
                time === selectedTime,
                available
              )}`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};
