import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { baseApi } from '@/shared/api';

const combinedReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});

/**
 * Глобальное Redux-хранилище приложения.
 */
export const store = configureStore({
  reducer: combinedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
});

/** Тип корневого состояния хранилища. */
export type RootState = ReturnType<typeof combinedReducer>;

/** Тип функции dispatch хранилища. */
export type AppDispatch = typeof store.dispatch;

/**
 * Типизированный хук useDispatch для приложения.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Типизированный хук useSelector для приложения.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
