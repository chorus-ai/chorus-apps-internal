import { useEffect, useState } from 'react'
import {
  AppBar,
  Typography,
  Grid,
  Toolbar,
  Tabs,
  Tab,
  Box,
  LinearProgress,
} from '@mui/material'
import { useParams } from 'react-router-dom'

import Overview from './Overview'
import Selected from './Selected'
import AnnotatorProgress from './AnnotatorProgress'
import { useAdjudicationEvents } from '../../../hooks'
import { useAppSelector } from '../../../../../hooks/redux'
import { NoContent } from '../../../common/NoContent'

export default function Adjudication() {
  const { pid } = useParams<{ pid: string }>()
  const projectId = Number(pid ?? 0)

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [tab, setTab] = useState(0)

  const { events, isLoading } = useAdjudicationEvents(projectId)
  const project = useAppSelector((state) =>
    pid ? state.cada.userProjects[pid] : undefined
  )

  useEffect(() => {
    if (tab === 2 && selectedIds.length === 0) {
      setTab(0)
    }
  }, [tab, selectedIds.length])

  const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const handleClickAdjudicate = () => {
    if (selectedIds.length > 0) {
      setTab(2)
    }
  }

  if (!pid || projectId <= 0) {
    return (
      <NoContent
        text="Invalid project"
        subtext="A valid project id is required."
      />
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <div>
      <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid size="grow">
              <Typography color="inherit" variant="h6" component="h1">
                {project?.name ?? 'Project'} Adjudication
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label="Overview" />
          <Tab label="Progress" />
          {selectedIds.length > 0 && <Tab disableRipple label={`${selectedIds.length} selected`} />}
        </Tabs>
      </AppBar>

      {tab === 0 && (
        <Overview
          project={project}
          events={events || []}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          handleClickAdjudicate={handleClickAdjudicate}
        />
      )}

      {tab === 1 && <AnnotatorProgress pid={pid} />}

      {tab === 2 && selectedIds.length > 0 && (
        <Selected
          project={project}
          events={(events || []).filter((e) => selectedIds.includes(Number(e.id)))}
        />
      )}
    </div>
  )
}