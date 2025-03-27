import { useCallback } from 'react'
import { Box, Typography, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { selectTasks, reorderTasks } from '../redux/slices/tasksSlice'
import { Task } from './Task'
import type { Task as TaskType } from '../redux/slices/tasksSlice'

export function TaskList() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectTasks)

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    dispatch(reorderTasks({ sourceIndex: dragIndex, targetIndex: hoverIndex }))
  }, [dispatch])

  if (tasks.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <Typography color="text.secondary">
          No tasks found. Add some tasks to get started!
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {tasks.map((task: TaskType, index: number) => (
        <Task 
          key={task.id} 
          task={task} 
          index={index}
          moveTask={moveTask}
        />
      ))}
      <Fab 
        color="primary" 
        aria-label="add task"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => {
          console.log('Add task clicked')
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  )
} 