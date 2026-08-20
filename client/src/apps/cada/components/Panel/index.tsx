import { useParams } from 'react-router-dom'
import { Box, LinearProgress } from '@mui/material'

import Annotation from './Annotation'
import Adjudication from './Adjudication'
import { useAppSelector } from '../../../../hooks/redux'
import { useUserProjects } from '../../hooks'

export default function Panel() {
  const { pid, role, type } = useParams<{
    pid: string
    role: string
    type: string
  }>()

  const user = useAppSelector((state) => state.main.user)
  const project = useAppSelector((state) =>
    pid ? state.cada.userProjects[pid] : undefined
  )

  const { isLoading } = useUserProjects(user?.id ?? 0)

  if (!pid) return null

  if (isLoading && !project) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  return role === 'adjudicator' ? (
    <Adjudication />
  ) : (
    <Annotation pid={pid} type={type ?? ''} />
  )
}