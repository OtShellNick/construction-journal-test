/**
 * Логирует информационное сообщение в консоль.
 * @param args - Аргументы для вывода
 */
export function logInfo(...args: unknown[]): void {
  console.log(...args);
}

/**
 * Логирует предупреждение в консоль.
 * @param args - Аргументы для вывода
 */
export function logWarn(...args: unknown[]): void {
  console.warn(...args);
}

/**
 * Логирует ошибку в консоль.
 * @param args - Аргументы для вывода
 */
export function logError(...args: unknown[]): void {
  console.error(...args);
}
