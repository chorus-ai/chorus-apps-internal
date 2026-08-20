import { useMemo } from 'react'
import {
  AppBar,
  Typography,
  Button,
  Toolbar,
  Box,
  LinearProgress,
  Chip,
  Tooltip,
} from '@mui/material'
import { FaRobot } from 'react-icons/fa'

import Panel from './Panel'
import { NoContent } from '../../../common/NoContent'
import { Download } from '../../../common/Download'
import { useAppSelector } from '../../../../../hooks/redux'
import { useAnnotationEvents, useEventCounts } from '../../../hooks'

export default function Annotation({ pid }: { pid: string }) {
  const projectId = Number(pid)

  const user = useAppSelector((state) => state.main.user)
  const project = useAppSelector((state) => state.cada.userProjects[pid])

  const { events, isLoading: eventsLoading } = useAnnotationEvents(
    projectId,
    user?.id ?? 0
  )

  const { annCount, isLoading: countsLoading } = useEventCounts(
    projectId,
    user?.id ?? 0,
    'annotator'
  )

  const isLoading = eventsLoading || countsLoading

  const downloadData = useMemo(() => {
    if (!events?.true?.length) return []

    return events.true
      .filter((e) => (e.cadaAnnotations?.[0]?.cadaAnnotationValues?.length ?? 0) > 0)
      .map((e) => {
        const values = [...(e.cadaAnnotations?.[0]?.cadaAnnotationValues ?? [])]
        const latestElement = values.sort((a: any, b: any) => b.id - a.id)[0]

        return {
          user: user?.email,
          file: e.cadaFile.path,
          field: latestElement?.field,
          createAt: latestElement?.createdAt,
          value: latestElement?.value,
        }
      })
  }, [events, user?.email])

  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  if (!project) return null

  if (!events) return null

  const hasAssignments =
    (events.false?.length ?? 0) > 0 || (events.true?.length ?? 0) > 0

  return (
    <>
      {hasAssignments ? (
        <>
          <AppBar component="div" sx={{ pl: 1 }} position="static" elevation={0}>
            <Toolbar>
              <Typography color="inherit" variant="h6" component="h1">
                {project.name} Annotation
              </Typography>

              <div style={{ flex: '1 1 auto' }} />

              <Download data={downloadData} />

              <Button variant="outlined" color="inherit" size="small">
                Report
              </Button>

              <Tooltip title="Afib detection model available">
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  Auto annotate
                  <FaRobot
                    size={15}
                    color="rgb(26, 188, 156)"
                    style={{ marginLeft: 6, marginBottom: 1 }}
                  />
                </Button>
              </Tooltip>

              <Button
                variant="outlined"
                color="inherit"
                size="small"
                sx={{ ml: 1 }}
              >
                Fine tune
                <Tooltip title="Fine tune model with 3 new annotations">
                  <Chip
                    label="3"
                    size="small"
                    sx={{ ml: 1, bgcolor: '#b2bec3' }}
                  />
                </Tooltip>
              </Button>
            </Toolbar>
          </AppBar>

          <AppBar
            component="div"
            sx={{ px: 1, height: 10 }}
            position="static"
            elevation={0}
          />

          <Panel
            events={events}
            events_count={annCount}
            user={user}
            project={project}
          />
        </>
      ) : (
        <NoContent
          text="There are no assignments!"
          subtext="Contact your admin for assignments!"
        />
      )}
    </>
  )
}