import { useEffect, useMemo, useState } from 'react'
import {
  AppBar,
  Typography,
  Button,
  Toolbar,
  Tabs,
  Tab,
  Box,
  LinearProgress,
} from '@mui/material'

import { useAppSelector } from '../../../../../hooks/redux'
import { useAdjudicationEvents } from '../../../hooks'
import { getAnnotatedEvents } from '../../../utils/adjudication_helper'
import { NoContent } from '../../../common/NoContent'
import { Download } from '../../../common/Download'
import Overview from './Overview'
import Selected from './Selected'

export default function Adjudication({ pid }: { pid: string }) {
  const projectId = Number(pid)

  const [tab, setTab] = useState(0)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const project = useAppSelector((state) => state.cada.userProjects[pid])
  const { events, isLoading } = useAdjudicationEvents(projectId)

  const annotatedRecords = useMemo(() => {
    if (!events || events.length === 0) return {}
    return getAnnotatedEvents(events)
  }, [events])

  useEffect(() => {
    if (selectedIds.length > 0 && tab === 1) return
    if (selectedIds.length === 0 && tab === 1) {
      setTab(0)
    }
  }, [selectedIds, tab])

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(events.map((item) => Number(item.id)).sort((a, b) => a - b))
      return
    }

    setSelectedIds([])
  }

  const handleCheckboxClick = (_event: React.SyntheticEvent, id: number) => {
    setSelectedIds((prev) => {
      const selectedIndex = prev.indexOf(id)

      if (selectedIndex === -1) {
        return [...prev, id].sort((a, b) => a - b)
      }

      if (selectedIndex === 0) {
        return prev.slice(1)
      }

      if (selectedIndex === prev.length - 1) {
        return prev.slice(0, -1)
      }

      return [...prev.slice(0, selectedIndex), ...prev.slice(selectedIndex + 1)]
    })
  }

  const handleClickAdjudicate = () => {
    setTab(1)
  }

  const selectedEvents = useMemo(() => {
    return events
      .filter((e) => selectedIds.includes(Number(e.id)))
      .reduce<{ true: typeof events; false: typeof events }>(
        (acc, event) => {
          if ((event.cadaAdjudicationValues?.length ?? 0) === 0) {
            acc.false.push(event)
          } else {
            acc.true.push(event)
          }
          return acc
        },
        { true: [], false: [] }
      )
  }, [events, selectedIds])

  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  if (!project || !events || events.length === 0) {
    return (
      <NoContent
        text="There are no annotation values!"
        subtext="Have annotators start assignments."
      />
    )
  }

  return (
    <>
      <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
        <Toolbar>
          <Typography color="inherit" variant="h6" component="h1">
            {project.name} Adjudication
          </Typography>

          <div style={{ flex: '1 1 auto' }} />

          <Download data={[]} />

          <Button variant="outlined" color="inherit" size="small">
            Report
          </Button>
        </Toolbar>
      </AppBar>

      <AppBar component="div" sx={{ px: 1 }} position="static" elevation={0}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab disableRipple label="Overview" />
          {selectedIds.length > 0 && (
            <Tab disableRipple label={`${selectedIds.length} selected`} />
          )}
        </Tabs>
      </AppBar>

      {tab === 0 ? (
        <Overview
          events={events}
          selectedIds={selectedIds}
          annotatedRecords={annotatedRecords}
          handleSelectAllClick={handleSelectAllClick}
          handleCheckboxClick={handleCheckboxClick}
          handleClickAdjudicate={handleClickAdjudicate}
        />
      ) : (
        <Selected
          events={selectedEvents}
          selectedIds={selectedIds}
          project={project}
          annotatedRecords={annotatedRecords}
        />
      )}
    </>
  )
}