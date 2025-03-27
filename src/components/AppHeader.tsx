import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material'
import {
  Menu as MenuIcon,
  LightMode,
  DarkMode,
} from '@mui/icons-material'
import { useState } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { toggleTheme } from '../redux/slices/themeSlice'
import { useNavigate } from 'react-router-dom'

export function AppHeader() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    handleClose()
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
              <MenuItem onClick={() => handleNavigation('/')}>View Tasks</MenuItem>
              <MenuItem onClick={() => handleNavigation('/add')}>Add Task</MenuItem>
              
            </Menu>
          </>
        )}
        
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
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