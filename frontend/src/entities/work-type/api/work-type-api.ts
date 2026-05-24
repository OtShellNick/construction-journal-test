import { baseApi } from '@/shared/api';
import { workTypeListSchema } from '../model/work-type.schema';
import type { WorkType } from '../model/work-type.schema';

export const workTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkTypes: builder.query<WorkType[], void>({
      query: () => 'work-types',
      transformResponse: (res: unknown) => workTypeListSchema.parse(res),
      providesTags: [{ type: 'WORK_TYPES', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetWorkTypesQuery } = workTypeApi;
