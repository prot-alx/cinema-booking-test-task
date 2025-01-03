export interface Seat {
  id: number;
  seat: number;
  status: "free" | "booked";
}

export interface Hall {
  [key: string]: Seat[];
}

export interface Session {
  seats: Hall;
}

export interface DaySchedule {
  sessions: {
    [key: string]: Session;
  };
}

export interface BookingData {
  [key: string]: DaySchedule;
}

export interface DateSelectorProps {
  dates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  formatDate: (date: Date) => string;
}

export const HALL_TEMPLATE: Hall = {
  row1: [
    { id: 1, seat: 1, status: "free" },
    { id: 2, seat: 2, status: "free" },
    { id: 3, seat: 3, status: "free" },
    { id: 4, seat: 4, status: "free" },
    { id: 5, seat: 5, status: "free" },
    { id: 6, seat: 6, status: "free" },
  ],
  row2: [
    { id: 7, seat: 1, status: "free" },
    { id: 8, seat: 2, status: "free" },
    { id: 9, seat: 3, status: "free" },
    { id: 10, seat: 4, status: "free" },
    { id: 11, seat: 5, status: "free" },
    { id: 12, seat: 6, status: "free" },
  ],
  row3: [
    { id: 13, seat: 1, status: "free" },
    { id: 14, seat: 2, status: "free" },
    { id: 15, seat: 3, status: "free" },
    { id: 16, seat: 4, status: "free" },
    { id: 17, seat: 5, status: "free" },
    { id: 18, seat: 6, status: "free" },
  ],
  row4: [
    { id: 19, seat: 1, status: "free" },
    { id: 20, seat: 2, status: "free" },
    { id: 21, seat: 3, status: "free" },
    { id: 22, seat: 4, status: "free" },
    { id: 23, seat: 5, status: "free" },
    { id: 24, seat: 6, status: "free" },
  ],
  row5: [
    { id: 25, seat: 1, status: "free" },
    { id: 26, seat: 2, status: "free" },
    { id: 27, seat: 3, status: "free" },
    { id: 28, seat: 4, status: "free" },
    { id: 29, seat: 5, status: "free" },
    { id: 30, seat: 6, status: "free" },
  ],
};

export const SESSIONS = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

export type SessionTime = (typeof SESSIONS)[number];

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function generateDateRange(): string[] {
  const today = new Date();
  const dates: string[] = [];

  for (let i = 7; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  dates.push(today.toISOString().split("T")[0]);

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
}

export function initializeBookingData(): BookingData {
  const storedData = JSON.parse(
    localStorage.getItem("bookings") ?? "{}"
  ) as BookingData;
  const availableDates = generateDateRange();
  const newData: BookingData = {};

  availableDates.forEach((date) => {
    if (storedData[date]) {
      newData[date] = storedData[date];
    } else {
      newData[date] = {
        sessions: SESSIONS.reduce(
          (acc, time) => ({
            ...acc,
            [time]: { seats: JSON.parse(JSON.stringify(HALL_TEMPLATE)) },
          }),
          {} as Record<string, Session>
        ),
      };
    }
  });

  const today = new Date();
  const oldestAllowedDate = new Date(today);
  oldestAllowedDate.setDate(today.getDate() - 7);

  Object.keys(storedData).forEach((date) => {
    const dateObj = new Date(date);
    if (dateObj < oldestAllowedDate) {
      delete storedData[date];
    }
  });

  localStorage.setItem("bookings", JSON.stringify(newData));
  return newData;
}
