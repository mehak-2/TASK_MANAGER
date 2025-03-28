import { createSlice, PayloadAction } from '@reduxjs/toolkit'


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
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      state.tasks.push({
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      })
    },
    editTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload.id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...action.payload.updates
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    },
    toggleComplete: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload)
      if (task) {
        task.completed = !task.completed
      }
    },
    setFilter: (state, action: PayloadAction<Partial<TasksState['filters']>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      }
    },
    reorderTasks: (state, action: PayloadAction<{ sourceIndex: number; targetIndex: number }>) => {
      const { sourceIndex, targetIndex } = action.payload
      const [removed] = state.tasks.splice(sourceIndex, 1)
      state.tasks.splice(targetIndex, 0, removed)
      
      state.filters.sortBy = 'manual'
    },
    sortTasks: (state, action: PayloadAction<string>) => {
      const sortType = action.payload
      state.tasks = [...state.tasks].sort((a, b) => {
        switch (sortType) {
          case 'date':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case 'priority': {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          }
          case 'status': {
            return a.completed === b.completed ? 0 : a.completed ? 1 : -1
          }
          default:
            return 0
        }
      })
    },
  }
})


export const {
  addTask,
  editTask,
  deleteTask,
  toggleComplete,
  setFilter,
  reorderTasks,
  sortTasks
} = tasksSlice.actions

export const selectTasks = (state: { tasks: TasksState }) => {
  const { tasks, filters } = state.tasks
  
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
    filteredTasks = [...filteredTasks].sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
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

export default tasksSlice.reducer 