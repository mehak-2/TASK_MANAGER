import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { addTask, toggleComplete, selectTasks, setFilter } from '../redux/slices/tasksSlice'

function Example() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectTasks)
} 