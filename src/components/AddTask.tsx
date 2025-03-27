import { useState } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { addTask } from '../redux/slices/tasksSlice'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

export function AddTask() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
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
      setFormData({ title: '', description: '', priority: 'medium', completed: false })
      setOpen(false)
    }
  }
  
  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: theme.spacing(2),
          right: theme.spacing(2)
        }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add New Task
        </DialogTitle>
        <DialogContent>
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.title.trim()}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
} 