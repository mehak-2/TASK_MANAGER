import { Container, Box } from '@mui/material'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ThemeProvider } from './theme/ThemeProvider'
import { TaskList } from './components/TaskList'
import { AppHeader } from './components/AppHeader'
import { AddTask } from './components/AddTask'

function App() {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <Box sx={{ 
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: 'background-color 0.3s ease'
        }}>
          <AppHeader />
          <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
            <TaskList />
            <AddTask />
          </Container>
        </Box>
      </DndProvider>
    </ThemeProvider>
  )
}

export default App
