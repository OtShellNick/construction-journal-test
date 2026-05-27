import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
});

/**
 * Базовый RTK Query API-экземпляр для всех эндпоинтов приложения.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['WORK_TYPES', 'ENTRIES'],
  endpoints: () => ({}),
});
