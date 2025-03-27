// Local Storage utility functions
export const STORAGE_KEY = 'taskManager'

export interface StorageState {
  tasks: any[]
  filters: {
    status: string
    priority: string
    sortBy: string
  }
  theme: 'light' | 'dark'
}

export const loadFromStorage = (): Partial<StorageState> => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)
    if (!serializedState) return {}
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Error loading from localStorage:', err)
    return {}
  }
}

export const saveToStorage = (state: Partial<StorageState>) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, serializedState)
  } catch (err) {
    console.error('Error saving to localStorage:', err)
  }
} 