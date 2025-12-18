/**
 * ZDatePicker - Date selection component
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ZDatePicker.module.css";

export type ZDatePickerProps = {
  /** Selected date value */
  value?: Date | null;
  /** Called when date changes */
  onChange: (date: Date | null) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Disable the picker */
  disabled?: boolean;
  /** Show clear button */
  clearable?: boolean;
  /** Date format display */
  format?: "short" | "medium" | "long";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Error state */
  error?: boolean;
  /** Additional class name */
  className?: string;
  /** ID for form association */
  id?: string;
  /** aria-label */
  "aria-label"?: string;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ZDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false,
  clearable = true,
  format = "medium",
  size = "md",
  error = false,
  className,
  id,
  "aria-label": ariaLabel,
}: ZDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Reset view date when value changes
  useEffect(() => {
    if (value) {
      setViewDate(value);
    }
  }, [value]);

  const formatDate = useCallback(
    (date: Date): string => {
      const options: Intl.DateTimeFormatOptions = {
        short: { month: "numeric", day: "numeric", year: "2-digit" },
        medium: { month: "short", day: "numeric", year: "numeric" },
        long: { month: "long", day: "numeric", year: "numeric" },
      }[format];

      return date.toLocaleDateString("en-US", options);
    },
    [format]
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first of month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) {
      return true;
    }
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) {
      return true;
    }
    return false;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!value) return false;
    return (
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    inputRef.current?.focus();
  };

  const days = getDaysInMonth(viewDate);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${styles[size]} ${className || ""}`}
    >
      <button
        ref={inputRef}
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${styles.trigger} ${isOpen ? styles.open : ""} ${
          error ? styles.error : ""
        } ${disabled ? styles.disabled : ""}`}
        aria-label={ariaLabel || placeholder}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={`${styles.value} ${!value ? styles.placeholder : ""}`}>
          {value ? formatDate(value) : placeholder}
        </span>

        <div className={styles.icons}>
          {clearable && value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClear(e as unknown as React.MouseEvent);
                }
              }}
              className={styles.clearButton}
              aria-label="Clear date"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          )}
          <span className={styles.calendarIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="dialog" aria-label="Choose date">
          <div className={styles.header}>
            <button
              type="button"
              onClick={handlePrevMonth}
              className={styles.navButton}
              aria-label="Previous month"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className={styles.monthYear}>
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className={styles.navButton}
              aria-label="Next month"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className={styles.weekDays} role="row">
            {DAYS.map((day) => (
              <span key={day} className={styles.weekDay} role="columnheader">
                {day}
              </span>
            ))}
          </div>

          <div className={styles.days} role="grid">
            {days.map((date, index) => {
              if (!date) {
                return (
                  <span key={`empty-${index}`} className={styles.emptyDay} />
                );
              }

              const isDisabled = isDateDisabled(date);
              const isSelected = isDateSelected(date);
              const isTodayDate = isToday(date);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => !isDisabled && handleDateSelect(date)}
                  disabled={isDisabled}
                  className={`${styles.day} ${
                    isSelected ? styles.selected : ""
                  } ${isTodayDate ? styles.today : ""} ${
                    isDisabled ? styles.dayDisabled : ""
                  }`}
                  aria-label={formatDate(date)}
                  aria-selected={isSelected}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                if (!isDateDisabled(today)) {
                  handleDateSelect(today);
                }
              }}
              className={styles.todayButton}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZDatePicker;
