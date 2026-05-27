import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Объединяет классы Tailwind с разрешением конфликтов.
 * @param inputs - Массив значений классов
 * @returns Строка объединённых CSS-классов
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Пустая функция-заглушка. Используется вместо пустых стрелочных функций.
 */
export function noop(): void {}
