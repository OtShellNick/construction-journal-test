import '@/entities/entry/api/entry-api';
import '@/entities/work-type/api/work-type-api';

import { Component, StrictMode } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { logError } from '@/shared/lib/logger';
import { StoreProvider } from './providers/store-provider';
import App from '../App';

/**
 * Граничный компонент для перехвата ошибок рендеринга React.
 */
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logError('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center text-destructive">
          Произошла непредвиденная ошибка. Перезагрузите страницу.
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Корневой компонент приложения: инициализирует провайдеры и обработчик ошибок.
 */
export function AppRoot() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
