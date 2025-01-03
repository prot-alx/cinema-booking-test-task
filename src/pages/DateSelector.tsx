import React from 'react';

export interface DateSelectorProps {
  dates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  formatDate: (date: Date) => string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  dates,
  selectedDate,
  onDateSelect,
  formatDate,
}) => (
  <div className="mb-6">
    <h2 className="text-xl mb-2">Выберите дату:</h2>
    <div className="flex gap-2 flex-wrap pb-2">
      {dates.map((date) => (
        <button
          key={date}
          onClick={() => onDateSelect(date)}
          className={`px-4 py-2 rounded whitespace-nowrap ${
            date === selectedDate
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {formatDate(new Date(date))}
        </button>
      ))}
    </div>
  </div>
);
