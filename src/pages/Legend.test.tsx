import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import { Legend } from "./Legend";

describe("Legend", () => {
  test("renders status indicators with correct text", () => {
    render(<Legend />);

    // Проверяем наличие текста статусов
    expect(screen.getByText("Свободно")).toBeInTheDocument();
    expect(screen.getByText("Занято")).toBeInTheDocument();
  });

  test("renders indicators with correct colors", () => {
    render(<Legend />);

    // Находим индикаторы по цветам
    const freeIndicator = screen.getByText("Свободно").previousSibling;
    const bookedIndicator = screen.getByText("Занято").previousSibling;

    // Проверяем правильные цвета
    expect(freeIndicator).toHaveClass("bg-green-500");
    expect(bookedIndicator).toHaveClass("bg-gray-400");
  });
});
