import { createSlice } from '@reduxjs/toolkit'
import { LandingState } from './interface'
import { landingExtendedApiSlice } from '../../store/services/landing'


const initialState: LandingState = {
    token: undefined,
    error: undefined
}

const landingSlice = createSlice({
    name: 'landing',
    initialState,
    reducers: {
        logout: state => {
            state.token = undefined;
        }
    },
    extraReducers(builder) {
        builder
            .addMatcher(
                landingExtendedApiSlice.endpoints.login.matchFulfilled,
                (state, { payload }) => {
                    state.token = payload.token
                }
            )
    }
});

export const { logout } = landingSlice.actions
export const landingSelector = (state: any) => state.landing
export default landingSlice.reducer