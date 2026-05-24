import { baseApi } from '@/shared/api';
import { entrySchema, entryListSchema } from '../model/entry.schema';
import type { Entry, CreateEntryDto, QueryEntryDto } from '../model/entry.schema';

export const entryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEntries: builder.query<Entry[], QueryEntryDto | void>({
      query: (params) => ({
        url: 'entries',
        params: params ?? undefined,
      }),
      transformResponse: (res: unknown) => entryListSchema.parse(res),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'ENTRIES' as const, id: _id })),
              { type: 'ENTRIES' as const, id: 'LIST' },
            ]
          : [{ type: 'ENTRIES' as const, id: 'LIST' }],
    }),

    getEntry: builder.query<Entry, string>({
      query: (id) => `entries/${id}`,
      transformResponse: (res: unknown) => entrySchema.parse(res),
      providesTags: (_result, _error, id) => [{ type: 'ENTRIES', id }],
    }),

    createEntry: builder.mutation<Entry, CreateEntryDto>({
      query: (body) => ({
        url: 'entries',
        method: 'POST',
        body,
      }),
      transformResponse: (res: unknown) => entrySchema.parse(res),
      invalidatesTags: [{ type: 'ENTRIES', id: 'LIST' }],
    }),

    updateEntry: builder.mutation<Entry, { id: string; body: CreateEntryDto }>({
      query: ({ id, body }) => ({
        url: `entries/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: unknown) => entrySchema.parse(res),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ENTRIES', id },
        { type: 'ENTRIES', id: 'LIST' },
      ],
    }),

    deleteEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `entries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ENTRIES', id },
        { type: 'ENTRIES', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEntriesQuery,
  useGetEntryQuery,
  useCreateEntryMutation,
  useUpdateEntryMutation,
  useDeleteEntryMutation,
} = entryApi;
