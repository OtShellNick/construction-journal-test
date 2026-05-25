import '@/entities/entry/api/entry-api';
import '@/entities/work-type/api/work-type-api';

import { Component, StrictMode } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { StoreProvider } from './providers/store-provider';
import App from '../App';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info);
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
