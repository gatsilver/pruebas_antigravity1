import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";

export const getMonthDays = (date: Date) => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 }); // Starts on Monday
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });

    return eachDayOfInterval({ start, end });
};

export const formatDate = (date: Date, formatStr: string) => {
    return format(date, formatStr, { locale: es });
};

export const nextMonth = (date: Date) => addMonths(date, 1);
export const prevMonth = (date: Date) => subMonths(date, 1);

export const areSameDay = (date1: Date, date2: Date) => isSameDay(date1, date2);
export const isCurrentMonth = (day: Date, currentMonth: Date) => isSameMonth(day, currentMonth);
