import '@/entities/entry/api/entry-api';
import '@/entities/work-type/api/work-type-api';

import { StrictMode } from 'react';
import { StoreProvider } from './providers/store-provider';
import App from '../App';

export function AppRoot() {
  return (
    <StrictMode>
      <StoreProvider>
        <App />
      </StoreProvider>
    </StrictMode>
  );
}
