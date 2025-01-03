import { BookingData, Seat } from "@/helpers/helpers";
import { Legend } from "./Legend";

interface HallSchemeProps {
  bookingData: BookingData;
  selectedDate: string;
  selectedTime: string;
  isBookingAvailable: (date: string, time: string) => boolean;
  onSeatClick: (rowId: string, seat: Seat) => void;
}

export const HallScheme: React.FC<HallSchemeProps> = ({
  bookingData,
  selectedDate,
  selectedTime,
  isBookingAvailable,
  onSeatClick,
}) => {
  const getSeatButtonClass = (status: string, isAvailable: boolean): string => {
    if (status === "booked") return "bg-gray-400 cursor-not-allowed";
    if (isAvailable) return "bg-green-500 hover:bg-green-600 text-white";
    return "bg-gray-300 cursor-not-allowed";
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-100 p-4 rounded">
      <div className="w-full h-8 bg-gray-300 mb-8 text-center text-sm leading-8">
        Экран
      </div>
      <div className="flex flex-col gap-2">
        {Object.entries(
          bookingData[selectedDate].sessions[selectedTime].seats
        ).map(([rowId, seats]) => (
          <div key={rowId} className="flex justify-center gap-2">
            <div className="w-8 text-right leading-8">{rowId.slice(3)}:</div>
            {seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => onSeatClick(rowId, seat)}
                disabled={
                  !isBookingAvailable(selectedDate, selectedTime) ||
                  seat.status === "booked"
                }
                className={`w-8 h-8 rounded ${getSeatButtonClass(
                  seat.status,
                  isBookingAvailable(selectedDate, selectedTime)
                )}`}
              >
                {seat.seat}
              </button>
            ))}
          </div>
        ))}
      </div>
      <Legend />
    </div>
  );
};
