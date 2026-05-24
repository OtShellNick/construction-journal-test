import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  prepareHeaders: (headers) => headers,
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['WORK_TYPES', 'ENTRIES'],
  endpoints: () => ({}),
});
