import { forwardRef, HTMLAttributes, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import styles from "./ZCalendar.module.css";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color?: string;
}

export interface ZCalendarProps extends HTMLAttributes<HTMLDivElement> {
  /** Selected date */
  value?: Date;
  /** On date select */
  onChange?: (date: Date) => void;
  /** Events */
  events?: CalendarEvent[];
  /** Min date */
  minDate?: Date;
  /** Max date */
  maxDate?: Date;
}

export const ZCalendar = forwardRef<HTMLDivElement, ZCalendarProps>(
  (
    {
      value = new Date(),
      onChange,
      events = [],
      minDate,
      maxDate,
      className,
      ...props
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = useState(
      new Date(value.getFullYear(), value.getMonth(), 1)
    );

    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    const prevMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      );
    };

    const nextMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      );
    };

    const handleDateClick = (day: number) => {
      const selectedDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      onChange?.(selectedDate);
    };

    const isDateDisabled = (day: number) => {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    const hasEvent = (day: number) => {
      return events.some((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === day &&
          eventDate.getMonth() === currentMonth.getMonth() &&
          eventDate.getFullYear() === currentMonth.getFullYear()
        );
      });
    };

    const monthNames = [
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
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div ref={ref} className={cn(styles.calendar, className)} {...props}>
        <div className={styles.header}>
          <button onClick={prevMonth} className={styles.navButton}>
            <ChevronLeft />
          </button>
          <span className={styles.monthYear}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button onClick={nextMonth} className={styles.navButton}>
            <ChevronRight />
          </button>
        </div>

        <div className={styles.weekdays}>
          {dayNames.map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.days}>
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className={styles.emptyDay} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isSelected =
              value.getDate() === day &&
              value.getMonth() === currentMonth.getMonth() &&
              value.getFullYear() === currentMonth.getFullYear();
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === currentMonth.getMonth() &&
              new Date().getFullYear() === currentMonth.getFullYear();

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={isDateDisabled(day)}
                className={cn(
                  styles.day,
                  isSelected && styles.selected,
                  isToday && styles.today,
                  hasEvent(day) && styles.hasEvent
                )}
              >
                {day}
                {hasEvent(day) && <div className={styles.eventDot} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

ZCalendar.displayName = "ZCalendar";

export default ZCalendar;
