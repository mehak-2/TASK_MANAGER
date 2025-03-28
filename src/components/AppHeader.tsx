import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material'
import {
  Menu as MenuIcon,
  LightMode,
  DarkMode,
  Sort,
  FilterList
} from '@mui/icons-material'
import { useState } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { toggleTheme } from '../redux/slices/themeSlice'
import { sortTasks, setFilter } from '../redux/slices/tasksSlice'

export function AppHeader() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [sortBy, setSortBy] = useState('date')
  const [filterStatus, setFilterStatus] = useState('all')

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSortMenu = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleSortClose = () => {
    setSortAnchorEl(null)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleSort = (sortType: string) => {
    setSortBy(sortType)
    dispatch(sortTasks(sortType))
    handleSortClose()
  }

  const handleStatusChange = (value: string) => {
    setFilterStatus(value)
    dispatch(setFilter({ status: value as 'all' | 'completed' | 'active' }))
    if (isMobile) {
      handleFilterClose()
    }
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        {isMobile && (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>View Tasks</MenuItem>
            
            </Menu>
          </>
        )}
        
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {!isMobile && (
            <>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={filterStatus}
                  label="Status"
                  onChange={(e: SelectChangeEvent) => handleStatusChange(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <IconButton
            color="inherit"
            onClick={handleSortMenu}
          >
            <Sort />
          </IconButton>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortClose}
          >
            <MenuItem onClick={() => handleSort('date')}>
              Sort by Date {sortBy === 'date' && '✓'}
            </MenuItem>
            <MenuItem onClick={() => handleSort('priority')}>
              Sort by Priority {sortBy === 'priority' && '✓'}
            </MenuItem>
            <MenuItem onClick={() => handleSort('status')}>
              Sort by Status {sortBy === 'status' && '✓'}
            </MenuItem>
          </Menu>

          {isMobile && (
            <>
              <IconButton
                color="inherit"
                onClick={handleFilterMenu}
              >
                <FilterList />
              </IconButton>
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
              >
                <MenuItem onClick={() => handleStatusChange('all')}>
                  All Tasks
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange('active')}>
                  Active
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange('completed')}>
                  Completed
                </MenuItem>
              </Menu>
            </>
          )}

          <IconButton 
            color="inherit"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
} 