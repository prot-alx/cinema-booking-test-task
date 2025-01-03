import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { HallScheme, HallSchemeProps } from "./HallScheme";
import { BookingData } from "@/helpers/helpers";

// Мокаем компонент Legend, так как нас интересует только HallScheme
jest.mock("./Legend", () => ({
  Legend: () => <div data-testid="legend" />,
}));

describe("HallScheme", () => {
  // Подготавливаем тестовые данные
  const mockBookingData: BookingData = {
    "2025-01-01": {
      sessions: {
        "10:00": {
          seats: {
            row1: [
              { id: 1, seat: 1, status: "free" as const },
              { id: 2, seat: 2, status: "booked" as const },
            ],
            row2: [
              { id: 3, seat: 1, status: "free" as const },
              { id: 4, seat: 2, status: "free" as const },
            ],
          },
        },
      },
    },
  };

  const defaultProps: HallSchemeProps = {
    bookingData: mockBookingData,
    selectedDate: "2025-01-01",
    selectedTime: "10:00",
    isBookingAvailable: jest.fn(() => true),
    onSeatClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders screen title", () => {
    render(<HallScheme {...defaultProps} />);
    expect(screen.getByText("Экран")).toBeInTheDocument();
  });

  test("renders all rows and seats", () => {
    render(<HallScheme {...defaultProps} />);

    // Проверяем номера рядов
    expect(screen.getByText("1:")).toBeInTheDocument();
    expect(screen.getByText("2:")).toBeInTheDocument();

    // Проверяем все места
    expect(screen.getAllByRole("button")).toHaveLength(4); // Всего 4 места
  });

  test("shows correct seat status styles", () => {
    render(<HallScheme {...defaultProps} />);

    const seats = screen.getAllByRole("button");

    // Свободное место
    expect(seats[0]).toHaveClass("bg-green-500");

    // Забронированное место
    expect(seats[1]).toHaveClass("bg-gray-400");
  });

  test("disables booked seats", () => {
    render(<HallScheme {...defaultProps} />);

    const bookedSeat = screen.getAllByRole("button")[1];
    expect(bookedSeat).toBeDisabled();
  });

  test("calls onSeatClick when clicking available seat", () => {
    render(<HallScheme {...defaultProps} />);

    // Кликаем по свободному месту
    const availableSeat = screen.getAllByRole("button")[0];
    fireEvent.click(availableSeat);

    // Проверяем, что колбэк был вызван с правильными параметрами
    expect(defaultProps.onSeatClick).toHaveBeenCalledWith("row1", {
      id: 1,
      seat: 1,
      status: "free",
    });
  });

  test("disables all seats when booking is not available", () => {
    render(<HallScheme {...defaultProps} isBookingAvailable={() => false} />);

    const seats = screen.getAllByRole("button");
    seats.forEach((seat) => {
      expect(seat).toBeDisabled();
      expect(seat).toHaveClass("cursor-not-allowed");
    });
  });

  test("renders Legend component", () => {
    render(<HallScheme {...defaultProps} />);
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  test("applies correct classes based on seat status", () => {
    const { rerender } = render(<HallScheme {...defaultProps} />);

    // Проверяем стили для доступного сеанса
    let seats = screen.getAllByRole("button");
    expect(seats[0]).toHaveClass("bg-green-500"); // свободное место
    expect(seats[1]).toHaveClass("bg-gray-400"); // забронированное место

    // Проверяем стили для недоступного сеанса
    rerender(<HallScheme {...defaultProps} isBookingAvailable={() => false} />);

    seats = screen.getAllByRole("button");
    // Свободные места должны стать серыми
    expect(seats[0]).toHaveClass("bg-gray-300");
    expect(seats[2]).toHaveClass("bg-gray-300");
    // Забронированные места должны остаться тёмно-серыми
    expect(seats[1]).toHaveClass("bg-gray-400");
  });
});
