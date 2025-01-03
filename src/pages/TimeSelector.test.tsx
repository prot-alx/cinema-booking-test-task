import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { TimeSelector, TimeSelectorProps } from "./TimeSelector";

describe("TimeSelector", () => {
  const defaultProps: TimeSelectorProps = {
    sessions: ["10:00", "12:00", "14:00"],
    selectedTime: "",
    selectedDate: "2025-01-01",
    onTimeSelect: jest.fn(),
    isBookingAvailable: jest.fn(() => true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders title", () => {
    render(<TimeSelector {...defaultProps} />);
    expect(screen.getByText("Выберите время:")).toBeInTheDocument();
  });

  test("renders all time slots", () => {
    render(<TimeSelector {...defaultProps} />);

    defaultProps.sessions.forEach((time) => {
      expect(screen.getByText(time)).toBeInTheDocument();
    });
  });

  test("calls onTimeSelect when available time is clicked", () => {
    render(<TimeSelector {...defaultProps} />);

    const timeButton = screen.getByText("10:00");
    fireEvent.click(timeButton);

    expect(defaultProps.onTimeSelect).toHaveBeenCalledWith("10:00");
  });

  test("highlights selected time", () => {
    render(<TimeSelector {...defaultProps} selectedTime="10:00" />);

    const selectedButton = screen.getByText("10:00");
    expect(selectedButton).toHaveClass("bg-blue-500");
    expect(selectedButton).toHaveClass("text-white");
  });

  test("disables unavailable times", () => {
    // Мокаем isBookingAvailable чтобы возвращал true только для определенного времени
    const isBookingAvailable = jest.fn((date, time) => time === "14:00");

    render(
      <TimeSelector {...defaultProps} isBookingAvailable={isBookingAvailable} />
    );

    // Проверяем, что недоступные времена заблокированы
    const unavailableButton = screen.getByText("10:00");
    expect(unavailableButton).toBeDisabled();
    expect(unavailableButton).toHaveClass("bg-gray-100");
    expect(unavailableButton).toHaveClass("text-gray-400");
    expect(unavailableButton).toHaveClass("cursor-not-allowed");

    // Проверяем, что доступное время активно
    const availableButton = screen.getByText("14:00");
    expect(availableButton).not.toBeDisabled();
    expect(availableButton).toHaveClass("bg-gray-200");
  });

  test("applies correct styles for different states", () => {
    const { rerender } = render(<TimeSelector {...defaultProps} />);

    // Проверяем стиль обычной доступной кнопки
    const timeButton = screen.getByText("10:00");
    expect(timeButton).toHaveClass("bg-gray-200");
    expect(timeButton).toHaveClass("hover:bg-gray-300");

    // Проверяем стиль выбранной кнопки
    rerender(<TimeSelector {...defaultProps} selectedTime="10:00" />);
    expect(timeButton).toHaveClass("bg-blue-500");
    expect(timeButton).toHaveClass("text-white");

    // Проверяем стиль недоступной кнопки
    rerender(
      <TimeSelector {...defaultProps} isBookingAvailable={() => false} />
    );
    expect(timeButton).toHaveClass("bg-gray-100");
    expect(timeButton).toHaveClass("text-gray-400");
    expect(timeButton).toHaveClass("cursor-not-allowed");
  });

  test("does not call onTimeSelect when clicking disabled time", () => {
    render(<TimeSelector {...defaultProps} isBookingAvailable={() => false} />);

    const timeButton = screen.getByText("10:00");
    fireEvent.click(timeButton);

    expect(defaultProps.onTimeSelect).not.toHaveBeenCalled();
  });
});
