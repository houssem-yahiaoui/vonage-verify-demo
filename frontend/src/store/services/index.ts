import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Constant
import { API } from '../../constant'


export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: API,
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const { token } = (getState() as any).landing
            if (token) {
              headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: [],
    endpoints: builder => ({})
});