import { useState } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { addTask } from '../redux/slices/tasksSlice'
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export function AddTask() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    completed: false
  })
  
  const handleSubmit = () => {
    if (formData.title.trim()) {
      dispatch(addTask(formData))
      navigate('/')
    }
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Task
      </Typography>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 2
        }}
      >
        <TextField
          label="Title"
          fullWidth
          autoFocus
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <TextField
          label="Description"
          multiline
          rows={3}
          fullWidth
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select 
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={() => navigate('/')}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Add Task</Button>
        </Box>
      </Box>
    </Paper>
  )
} 