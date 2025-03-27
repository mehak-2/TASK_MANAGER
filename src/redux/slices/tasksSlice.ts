import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'


export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

export interface TasksState {
  tasks: Task[]
  filters: {
    status: 'all' | 'completed' | 'active'
    priority: 'all' | 'low' | 'medium' | 'high'
    sortBy: 'date' | 'priority' | 'title' | 'manual'
  }
}

const initialState: TasksState = {
  tasks: [],
  filters: {
    status: 'all',
    priority: 'all',
    sortBy: 'manual'
  }
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state: TasksState, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      state.tasks.push({
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      })
    },
    editTask: (state: TasksState, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload.id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...action.payload.updates
        }
      }
    },
    deleteTask: (state: TasksState, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    },
    toggleComplete: (state: TasksState, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload)
      if (task) {
        task.completed = !task.completed
      }
    },
    setFilter: (state: TasksState, action: PayloadAction<Partial<TasksState['filters']>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      }
    },
    reorderTasks: (state: TasksState, action: PayloadAction<{ sourceIndex: number; targetIndex: number }>) => {
      const { sourceIndex, targetIndex } = action.payload
      const [removed] = state.tasks.splice(sourceIndex, 1)
      state.tasks.splice(targetIndex, 0, removed)
      
      state.filters.sortBy = 'manual'
    },
  }
})


export const {
  addTask,
  editTask,
  deleteTask,
  toggleComplete,
  setFilter,
  reorderTasks
} = tasksSlice.actions


const selectTasksState = (state: { tasks: TasksState }) => state.tasks
const selectTasksList = createSelector(
  [selectTasksState],
  (tasksState: TasksState) => tasksState.tasks
)
const selectFilters = createSelector(
  [selectTasksState],
  (tasksState: TasksState) => tasksState.filters
)

export const selectTasks = createSelector(
  [selectTasksList, selectFilters],
  (tasks: Task[], filters: TasksState['filters']) => {
    let filteredTasks = tasks
      .filter(task => {
        if (filters.status === 'completed') return task.completed
        if (filters.status === 'active') return !task.completed
        return true
      })
      .filter(task => {
        if (filters.priority === 'all') return true
        return task.priority === filters.priority
      })

    if (filters.sortBy && filters.sortBy !== 'manual') {
      filteredTasks = [...filteredTasks].sort((a: Task, b: Task) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case 'priority': {
            const priorityOrder: Record<Task['priority'], number> = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          }
          case 'title':
            return a.title.localeCompare(b.title)
          default:
            return 0
        }
      })
    }

    return filteredTasks
  }
)

export default tasksSlice.reducer 