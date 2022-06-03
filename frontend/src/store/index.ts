import { combineReducers, configureStore } from '@reduxjs/toolkit'

// Reducers
import landingReducer from '../landing/state/landingSlice'
import { apiSlice } from './services'

// React Persist
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'vonage-demo',
    storage,
    version: 1,
    blacklist: ['api']
}

const persistedReducer = persistReducer(persistConfig, combineReducers({
    landing: landingReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
}))

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});
export const persistor = persistStore(store)