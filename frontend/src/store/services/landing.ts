import {
    apiSlice
} from './index'

export const landingExtendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: payload => ({
                url: '/federated/user',
                method: 'POST',
                body: payload
            }),
            invalidatesTags: []
        }),
        getAccountMetadata: builder.query({
            query: (id) => ({
                url: `/federated/${id}/metadata`,
                method: 'GET'
            }),
            providesTags: []
        }),
        addPhoneNumber: builder.mutation({
            query: payload => ({
                url: `/federated/${payload.id}/phone-number`,
                method: 'PATCH',
                body: payload
            }),
            invalidatesTags: []
        }),
        verify2FA: builder.mutation({
            query: payload => ({
                url: `/federated/verify-2fa`,
                method: 'POST',
                body: payload
            }),
            invalidatesTags: []
        }),
    })
})

export const {
    useLoginMutation,
    useAddPhoneNumberMutation,
    useGetAccountMetadataQuery,
    useVerify2FAMutation
} = landingExtendedApiSlice