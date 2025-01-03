"use client";
import React, { useEffect, useState } from "react";
import {
  BookingData,
  formatDate,
  generateDateRange,
  initializeBookingData,
  SESSIONS,
  Seat,
} from "@/helpers/helpers";
import { DateSelector } from "./DateSelector";
import { TimeSelector } from "./TimeSelector";
import { HallScheme } from "./HallScheme";

export default function BookingPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const dates = generateDateRange();

  useEffect(() => {
    try {
      const data = initializeBookingData();
      setBookingData(data);
      setSelectedDate(dates[7]);
    } catch (e) {
      const error = e instanceof Error ? e : new Error("Unknown error");
      throw new Error("error", { cause: error });
    }
  }, []);

  const isBookingAvailable = (date: string, time: string): boolean => {
    const sessionDate = new Date(`${date}T${time}`);
    return sessionDate > new Date();
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleSeatClick = (rowId: string, seat: Seat): void => {
    if (
      !selectedDate ||
      !selectedTime ||
      !isBookingAvailable(selectedDate, selectedTime)
    ) {
      return;
    }

    if (seat.status === "free" && bookingData) {
      const newData = JSON.parse(JSON.stringify(bookingData));
      const seatToUpdate = newData[selectedDate].sessions[selectedTime].seats[
        rowId
      ].find((s: Seat) => s.id === seat.id);
      if (seatToUpdate) {
        seatToUpdate.status = "booked";
        setBookingData(newData);
        localStorage.setItem("bookings", JSON.stringify(newData));
      }
    }
  };

  if (!bookingData || !selectedDate) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Бронирование билетов
      </h1>

      <DateSelector
        dates={dates}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        formatDate={formatDate}
      />

      <TimeSelector
        sessions={SESSIONS}
        selectedTime={selectedTime}
        selectedDate={selectedDate}
        onTimeSelect={setSelectedTime}
        isBookingAvailable={isBookingAvailable}
      />

      {selectedTime && (
        <div>
          <h2 className="text-xl mb-2">Выберите места:</h2>
          <HallScheme
            bookingData={bookingData}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            isBookingAvailable={isBookingAvailable}
            onSeatClick={handleSeatClick}
          />
        </div>
      )}
    </div>
  );
}
