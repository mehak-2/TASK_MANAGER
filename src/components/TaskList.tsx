import { useCallback } from 'react'
import { Box, Typography } from '@mui/material'
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
    <Box>
      {tasks.map((task: TaskType, index: number) => (
        <Task 
          key={task.id} 
          task={task} 
          index={index}
          moveTask={moveTask}
        />
      ))}
    </Box>
  )
} 