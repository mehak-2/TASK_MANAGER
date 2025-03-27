import { Container, Box } from '@mui/material'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider'
import { TaskList } from './components/TaskList'
import { AppHeader } from './components/AppHeader'
import { AddTask } from './components/AddTask'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DndProvider backend={HTML5Backend}>
          <Box sx={{ 
            minHeight: '100vh',
            bgcolor: 'background.default',
            transition: 'background-color 0.3s ease'
          }}>
            <AppHeader />
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
              <Routes>
                <Route path="/" element={<TaskList />} />
                <Route path="/add" element={<AddTask />} />
              
              </Routes>
            </Container>
          </Box>
        </DndProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
