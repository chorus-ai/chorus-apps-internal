import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../hooks/redux'
import { useQuery } from '../../../hooks/useApiQuery'
import { useMutation } from '../../../hooks/useApiMutation'
import * as eventsApi from '../api/events'
import type {
  CadaEvent,
  EventCount,
  SaveAnnotationPayload,
  SaveAdjudicationPayload,
} from '../types'
import {
  setAnnEvents,
  setAdjEvents,
  setAnnEventsCount,
  setAdjEventsCount,
  setAnnotatorProgress,
  updateAnnEvent,
  updateAdjEvent,
  showAlert,
} from '../store/slicer'

export function useAnnotationEvents(pid: number, uid: number) {
  const annEvents = useAppSelector((state) => state.cada.annEvents)
  const dispatch = useAppDispatch()

  const events = annEvents[String(pid)] || null

  const { isLoading, error, refetch } = useQuery(
    async () => {
      const data = await eventsApi.getAnnotationEvents(pid, uid, null, true)
      const sorted: { true: CadaEvent[]; false: CadaEvent[] } = {
        false: data.filter((d) => !d.cadaAnnotations[0]?.completed),
        true: data.filter((d) => d.cadaAnnotations[0]?.completed),
      }

      dispatch(
        setAnnEvents({
          pid: String(pid),
          events: sorted,
        })
      )

      return sorted
    },
    [pid, uid],
    { enabled: !events && pid > 0 && uid > 0 }
  )

  useEffect(() => {
    if (error) {
      dispatch(
        showAlert({
          message: error.message,
          severity: 'warning',
        })
      )
    }
  }, [error, dispatch])

  return { events, isLoading, refetch }
}

export function useAdjudicationEvents(pid: number) {
  const adjEvents = useAppSelector((state) => state.cada.adjEvents)
  const dispatch = useAppDispatch()
  const events = adjEvents[String(pid)]

  const { isLoading, error, refetch } = useQuery(
    async () => {
      const data = await eventsApi.getAdjudicationEvents(pid)

      dispatch(
        setAdjEvents({
          pid: String(pid),
          events: data,
        })
      )

      return data
    },
    [pid],
    { enabled: !events && pid > 0 }
  )

  useEffect(() => {
    if (error) {
      dispatch(
        showAlert({
          message: error.message,
          severity: 'warning',
        })
      )
    }
  }, [error, dispatch])

  return { events: events || [], isLoading, refetch }
}

export function useEventCounts(pid: number, uid: number, role: string) {
  const annEventsCount = useAppSelector((state) => state.cada.annEventsCount)
  const adjEventsCount = useAppSelector((state) => state.cada.adjEventsCount)
  const dispatch = useAppDispatch()

  const annCount = annEventsCount[String(pid)] || null
  const adjCount = adjEventsCount[String(pid)] ?? null

  const { isLoading, error } = useQuery(
    async () => {
      if (role === 'annotator') {
        const data = await eventsApi.getAssignmentsCount(pid, uid)

        const count: EventCount = data.reduce<EventCount>(
          (acc, obj) => {
            acc[String(Number(obj.completed)) as '0' | '1'] = obj.count
            return acc
          },
          { 0: 0, 1: 0 }
        )

        dispatch(
          setAnnEventsCount({
            pid: String(pid),
            count,
          })
        )

        return count
      }

      const data = await eventsApi.getCount(pid, true)

      dispatch(
        setAdjEventsCount({
          pid: String(pid),
          count: data,
        })
      )

      return data
    },
    [pid, uid, role],
    {
      enabled:
        pid > 0 &&
        (role === 'annotator' ? annCount === null : adjCount === null),
    }
  )

  useEffect(() => {
    if (error) {
      dispatch(
        showAlert({
          message: error.message,
          severity: 'warning',
        })
      )
    }
  }, [error, dispatch])

  return { annCount, adjCount, isLoading }
}

export function useAnnotatorProgress(pid: number) {
  const annotatorProgress = useAppSelector((state) => state.cada.annotatorProgress)
  const dispatch = useAppDispatch()
  const progress = annotatorProgress[String(pid)]

  const FILTERED_UIDS = [1, 2, 6, 23]

  const { isLoading, error, refetch } = useQuery(
    async () => {
      const data = await eventsApi.getAnnotatorProgress(Number(pid), FILTERED_UIDS)

      dispatch(
        setAnnotatorProgress({
          pid: String(pid),
          progress: data,
        })
      )

      return data
    },
    [pid],
    { enabled: !progress && pid > 0 }
  )

  useEffect(() => {
    if (error) {
      dispatch(
        showAlert({
          message: error.message,
          severity: 'warning',
        })
      )
    }
  }, [error, dispatch])

  return { progress, isLoading, refetch }
}

export function useAllEvents(pid: number) {
  const { data, isLoading, error, refetch } = useQuery(
    () => eventsApi.getAllPaginated(pid),
    [pid],
    { enabled: pid > 0 }
  )

  return { events: data || [], isLoading, error, refetch }
}

export function useSaveAnnotation() {
  const annEventsCount = useAppSelector((state) => state.cada.annEventsCount)
  const dispatch = useAppDispatch()

  return useMutation(
    async ({
      projectId,
      eventId,
      completed,
      annotation,
      isComplete,
    }: {
      projectId: number
      eventId: number
      completed: boolean
      annotation: SaveAnnotationPayload
      isComplete?: boolean
    }) => {
      const result = await eventsApi.saveAnnotation(annotation)
      const showAlertFlag = isComplete !== undefined ? isComplete : completed

      dispatch(
        updateAnnEvent({
          pid: String(projectId),
          eventId,
          updater: (e) => ({
            ...e,
            cadaAnnotations: e.cadaAnnotations.map((a) => ({
              ...a,
              cadaAnnotationValues: [...a.cadaAnnotationValues, result],
            })),
          }),
          moveToCompleted: completed === false,
        })
      )

      if (completed === false) {
        const counts: EventCount = {
          ...(annEventsCount[String(projectId)] || { 0: 0, 1: 0 }),
        }

        counts[0] = (counts[0] || 0) - 1
        counts[1] = (counts[1] || 0) + 1

        dispatch(
          setAnnEventsCount({
            pid: String(projectId),
            count: counts,
          })
        )
      }

      if (showAlertFlag === true) {
        dispatch(
          showAlert({
            message: 'Annotation updated!',
            severity: 'success',
          })
        )
      }

      return result
    }
  )
}

export function useSaveAdjudication() {
  const dispatch = useAppDispatch()

  return useMutation(
    async ({
      projectId,
      eventId,
      completed,
      adjudication,
    }: {
      projectId: number
      eventId: number
      completed: boolean
      adjudication: SaveAdjudicationPayload
    }) => {
      const result = await eventsApi.saveAdjudication(adjudication)

      dispatch(
        updateAdjEvent({
          pid: String(projectId),
          eventId,
          updater: (e) => ({
            ...e,
            cadaAdjudicationValues: [...(e.cadaAdjudicationValues || []), result],
          }),
        })
      )

      if (completed) {
        dispatch(
          showAlert({
            message: 'Adjudication updated!',
            severity: 'success',
          })
        )
      }

      return result
    }
  )
}

export function useAssignEvents() {
  const dispatch = useAppDispatch()

  return useMutation(
    async ({ uid, eventIds }: { uid: number; eventIds: number[] }) => {
      await eventsApi.assignToUser(uid, eventIds)
    },
    {
      onError: (err) =>
        dispatch(
          showAlert({
            message: err.message,
            severity: 'warning',
          })
        ),
    }
  )
}