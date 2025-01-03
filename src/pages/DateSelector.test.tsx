import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateSelector } from './DateSelector';

describe('DateSelector', () => {
  // Базовые пропсы для тестов
  const defaultProps = {
    dates: ['2025-01-01', '2025-01-02', '2025-01-03'],
    selectedDate: '2025-01-01',
    onDateSelect: jest.fn(),
    formatDate: (date: Date) => new Date(date).toLocaleDateString()
  };

  // Перед каждым тестом очищаем моки
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all dates', () => {
    render(<DateSelector {...defaultProps} />);
    
    // Проверяем, что все даты отрендерились
    defaultProps.dates.forEach(date => {
      expect(screen.getByText(new Date(date).toLocaleDateString())).toBeInTheDocument();
    });
  });

  test('highlights selected date', () => {
    render(<DateSelector {...defaultProps} />);
    
    // Находим кнопку с выбранной датой
    const selectedButton = screen.getByText(new Date(defaultProps.selectedDate).toLocaleDateString());
    
    // Проверяем, что у неё правильный класс
    expect(selectedButton).toHaveClass('bg-blue-500');
  });

  test('calls onDateSelect when date is clicked', () => {
    render(<DateSelector {...defaultProps} />);
    
    // Находим и кликаем по дате
    const dateButton = screen.getByText(new Date('2025-01-02').toLocaleDateString());
    fireEvent.click(dateButton);
    
    // Проверяем, что коллбэк был вызван с правильной датой
    expect(defaultProps.onDateSelect).toHaveBeenCalledWith('2025-01-02');
  });

  test('renders title correctly', () => {
    render(<DateSelector {...defaultProps} />);
    expect(screen.getByText('Выберите дату:')).toBeInTheDocument();
  });
});