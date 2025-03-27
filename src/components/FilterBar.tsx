import {
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setFilter } from '../redux/slices/tasksSlice'
import type { SelectChangeEvent } from '@mui/material'
import type { RootState } from '../redux/store'

export function FilterBar() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state: RootState) => state.tasks.filters)

  const handleStatusChange = (_: React.MouseEvent<HTMLElement>, newStatus: 'all' | 'completed' | 'active') => {
    if (newStatus !== null) {
      dispatch(setFilter({ status: newStatus }))
    }
  }

  const handlePriorityChange = (event: SelectChangeEvent) => {
    dispatch(setFilter({ priority: event.target.value as 'all' | 'low' | 'medium' | 'high' }))
  }

  const handleSortChange = (event: SelectChangeEvent) => {
    dispatch(setFilter({ sortBy: event.target.value as 'manual' | 'date' | 'priority' | 'title' }))
  }

  if (isMobile) {
    return (
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Filters & Sort</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Status
              </Typography>
              <ToggleButtonGroup
                value={filters.status}
                exclusive
                onChange={handleStatusChange}
                size="small"
                fullWidth
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="active">Active</ToggleButton>
                <ToggleButton value="completed">Done</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <FormControl size="small" fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                label="Priority"
                onChange={handlePriorityChange}
              >
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="manual">Manual Order</MenuItem>
                <MenuItem value="date">Date Created</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>
    )
  }

} 