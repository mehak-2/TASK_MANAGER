import { useState, useRef } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { deleteTask, toggleComplete, editTask, Task as TaskType } from '../redux/slices/tasksSlice'
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Chip, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material'
import { useDrag, useDrop } from 'react-dnd'
import { alpha } from '@mui/material/styles'

interface TaskProps {
  task: TaskType
  index: number
  moveTask: (dragIndex: number, hoverIndex: number) => void
}



const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error'
} as const

export function Task({ task, index, moveTask }: TaskProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const [editOpen, setEditOpen] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const handleToggleComplete = () => {
    dispatch(toggleComplete(task.id))
  }

  const handleDelete = () => {
    dispatch(deleteTask(task.id))
  }

  const handleEdit = () => {
    dispatch(editTask({ id: task.id, updates: editedTask }))
    setEditOpen(false)
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  const [, drop] = useDrop(() => ({
    accept: 'task',
    hover: (item: { id: string, index: number }, monitor) => {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveTask(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  }))

  drag(drop(ref))

  

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  return (
    <>
      <Card 
        ref={ref}
        sx={{
          mb: 2,
          opacity: isDragging ? 0.4 : (task.completed ? 0.7 : 1),
          cursor: 'move',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.text.primary, 0.15)}`,
            transform: 'translateY(-2px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: (theme) => theme.palette[priorityColors[task.priority]].main,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8
          }
        }}
      >
        <CardContent>
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'flex-start' : 'center'}
            gap={isMobile ? 1 : 2}
          >
            <Box display="flex" alignItems="center" gap={1} flex={1}>
              <IconButton 
                onClick={handleToggleComplete}
                size={isMobile ? 'small' : 'medium'}
              >
                {task.completed ? <CheckCircleIcon color="success" /> : <UncheckedIcon />}
              </IconButton>
              <Box>
                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    wordBreak: 'break-word'
                  }}
                >
                  {task.title}
                </Typography>
                {!isMobile && (
                  <>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ maxWidth: '500px' }}
                    >
                      {task.description}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            <Box 
              display="flex" 
              alignItems="center" 
              gap={1}
              width={isMobile ? '100%' : 'auto'}
              justifyContent={isMobile ? 'space-between' : 'flex-end'}
            >
              <Chip
                label={task.priority}
                color={priorityColors[task.priority]}
                size={isMobile ? 'small' : 'medium'}
              />
              
              {isMobile ? (
                <>
                  <IconButton onClick={handleMenuOpen}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => {
                      handleEdit()
                      handleMenuClose()
                    }}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleDelete()
                      handleMenuClose()
                    }}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <IconButton onClick={() => setEditOpen(true)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
          
          {isMobile && (
            <>
              {task.description && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mt: 1, ml: 5 }}
                >
                  {task.description}
                </Typography>
              )}
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ mt: 0.5, ml: 5, display: 'block' }}
              >
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editedTask.priority}
                label="Priority"
                onChange={(e) => setEditedTask({ 
                  ...editedTask, 
                  priority: e.target.value as TaskType['priority']
                })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
} 