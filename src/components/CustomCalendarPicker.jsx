"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check } from "lucide-react";

const TIME_SLOTS = [
  "12:00 AM",
  "1:00 AM",
  "2:00 AM",
  "3:00 AM",
  "4:00 AM",
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CustomCalendarPicker({
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  bookingTime,
  onBookingTimeChange,
  minDate,
}) {
  // Parsing initial view date from checkIn or today
  const todayStr = minDate || new Date().toISOString().split("T")[0];
  const initialDate = checkIn ? new Date(checkIn) : new Date(todayStr);

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear() || new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth() || new Date().getMonth());
  const [selectingTarget, setSelectingTarget] = useState("checkIn"); // "checkIn" | "checkOut"

  // Month navigation
  const handlePrevMonth = () => {
    const today = new Date(todayStr);
    const minMonth = today.getMonth();
    const minYear = today.getFullYear();

    if (currentYear > minYear || (currentYear === minYear && currentMonth > minMonth)) {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Calendar days calculation
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const formatDateStr = (year, month, day) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const handleDateClick = (day) => {
    const dateStr = formatDateStr(currentYear, currentMonth, day);

    if (dateStr < todayStr) return; // Ignore past dates

    if (selectingTarget === "checkIn") {
      onCheckInChange(dateStr);
      // If checkOut is before or equal to new checkIn, automatically set checkOut to checkIn + 1 day
      if (!checkOut || checkOut <= dateStr) {
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        onCheckOutChange(nextDay.toISOString().split("T")[0]);
      }
      // Auto-focus checkOut tab next for seamless flow
      setSelectingTarget("checkOut");
    } else {
      // Selecting Check-out
      if (dateStr <= checkIn) {
        // If user picked a date on/before check-in, set it as new checkIn and advance checkOut
        onCheckInChange(dateStr);
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        onCheckOutChange(nextDay.toISOString().split("T")[0]);
      } else {
        onCheckOutChange(dateStr);
      }
    }
  };

  // Check if prev month navigation should be disabled
  const today = new Date(todayStr);
  const isPrevDisabled = currentYear === today.getFullYear() && currentMonth === today.getMonth();

  return (
    <div className="bg-[#141210] border border-[#D4AF37]/35 rounded-xl p-3.5 sm:p-4.5 space-y-4 shadow-xl">
      {/* 1. Top Target Selector Tabs: Check-In vs Check-Out */}
      <div className="grid grid-cols-2 gap-2 bg-[#0E0D0C] p-1 rounded-lg border border-[#D4AF37]/20">
        <button
          type="button"
          onClick={() => setSelectingTarget("checkIn")}
          className={`py-2 px-3 rounded-md text-xs font-mono flex flex-col items-start gap-0.5 transition-all cursor-pointer ${
            selectingTarget === "checkIn"
              ? "bg-[#D4AF37] text-[#100F0E] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              : "text-[#D6B892]/80 hover:text-[#F7F5F2] hover:bg-[#1A1816]"
          }`}
        >
          <span className="text-[9.5px] uppercase tracking-wider opacity-80 flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span>Check-In Date</span>
          </span>
          <span className="font-semibold text-xs sm:text-sm font-sans truncate">{checkIn || "Select Date"}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectingTarget("checkOut")}
          className={`py-2 px-3 rounded-md text-xs font-mono flex flex-col items-start gap-0.5 transition-all cursor-pointer ${
            selectingTarget === "checkOut"
              ? "bg-[#D4AF37] text-[#100F0E] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              : "text-[#D6B892]/80 hover:text-[#F7F5F2] hover:bg-[#1A1816]"
          }`}
        >
          <span className="text-[9.5px] uppercase tracking-wider opacity-80 flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span>Check-Out Date</span>
          </span>
          <span className="font-semibold text-xs sm:text-sm font-sans truncate">{checkOut || "Select Date"}</span>
        </button>
      </div>

      {/* 2. Month Navigation Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm sm:text-base text-[#F7F5F2] font-semibold">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
          <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/30">
            {selectingTarget === "checkIn" ? "Pick Check-in" : "Pick Check-out"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            aria-label="Previous Month"
            className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
              isPrevDisabled
                ? "border-[#D4AF37]/10 text-white/20 cursor-not-allowed"
                : "border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#100F0E]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next Month"
            className="w-7 h-7 rounded-md border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#100F0E] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Days Grid Header */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10.5px] uppercase tracking-wider text-[#D6B892]/60 pb-1 border-b border-[#D4AF37]/15">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="py-0.5">{d}</div>
        ))}
      </div>

      {/* 4. Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
        {/* Leading empty day slots */}
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-8 sm:h-9" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const dateStr = formatDateStr(currentYear, currentMonth, day);
          const isPast = dateStr < todayStr;
          const isCheckIn = dateStr === checkIn;
          const isCheckOut = dateStr === checkOut;
          const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;

          let btnClass = "h-8 sm:h-9 rounded-md transition-all flex items-center justify-center relative cursor-pointer ";

          if (isPast) {
            btnClass += "text-[#D6B892]/20 cursor-not-allowed";
          } else if (isCheckIn) {
            btnClass += "bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-bold shadow-[0_0_15px_rgba(212,175,55,0.6)] scale-105 z-10";
          } else if (isCheckOut) {
            btnClass += "bg-[#D4AF37]/30 border border-[#D4AF37] text-[#F7F5F2] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-105 z-10";
          } else if (isInRange) {
            btnClass += "bg-[#D4AF37]/15 text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/25";
          } else {
            btnClass += "text-[#F7F5F2] hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]";
          }

          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={() => handleDateClick(day)}
              className={btnClass}
            >
              <span>{day}</span>
              {isCheckIn && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#100F0E]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 5. Horizontal Scrollable Arrival Time Selector (Directly Below the Date Grid) */}
      <div className="pt-3 border-t border-[#D4AF37]/20 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>CHECK-IN / ARRIVAL TIME</span>
          </label>
          <span className="text-[10.5px] font-mono font-bold text-[#D4AF37] bg-[#1c1917] px-2 py-0.5 rounded border border-[#D4AF37]/30 flex items-center gap-1">
            <Check className="w-3 h-3 text-[#D4AF37]" />
            <span>{bookingTime}</span>
          </span>
        </div>

        {/* Horizontal scrollable time pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x py-1 -mx-1 px-1">
          {TIME_SLOTS.map((time) => {
            const isSelected = bookingTime === time;
            return (
              <button
                key={time}
                type="button"
                onClick={() => onBookingTimeChange(time)}
                className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-[#C9A86A] via-[#D4AF37] to-[#C9A86A] text-[#100F0E] font-bold shadow-[0_0_15px_rgba(212,175,55,0.5)] border border-[#D4AF37] scale-105"
                    : "bg-[#1c1917] hover:bg-[#252220] text-[#D6B892] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
