import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './slices/tasksSlice'
import themeReducer from './slices/themeSlice'
import { loadFromStorage, saveToStorage } from '../utils/localStorage'
import type { TasksState } from './slices/tasksSlice'
import type { ThemeState } from './slices/themeSlice'

interface RootState {
  tasks: TasksState
  theme: ThemeState
}

// Load and transform initial state from localStorage
const persistedState = loadFromStorage()
const initialState: RootState = {
  tasks: {
    tasks: persistedState.tasks || [],
    filters: {
      status: (persistedState.filters?.status as TasksState['filters']['status']) || 'all',
      priority: (persistedState.filters?.priority as TasksState['filters']['priority']) || 'all',
      sortBy: (persistedState.filters?.sortBy as TasksState['filters']['sortBy']) || 'date'
    }
  },
  theme: {
    mode: persistedState.theme || 'light'
  }
}

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    theme: themeReducer
  },
  preloadedState: initialState
})

// Save to localStorage whenever state changes
store.subscribe(() => {
  const state = store.getState()
  saveToStorage({
    tasks: state.tasks.tasks,
    filters: state.tasks.filters,
    theme: state.theme.mode
  })
})

export type { RootState }
export type AppDispatch = typeof store.dispatch 