import { styled } from '@mui/material/styles'
import { Box, Button, IconButton } from '@mui/material'
import { alpha } from '@mui/material/styles'

export const ActionButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'scale(1.1)'
  }
}))

export const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  color: theme.palette.primary.contrastText,
  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`
  }
}))

export const FlexBox = styled(Box)({
  display: 'flex',
  alignItems: 'center'
}) 