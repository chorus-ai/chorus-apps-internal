import * as usersApi from '../api/users'
import * as projectsApi from '../api/projects'
import * as eventsApi from '../api/events'
import type { UserAddPayload } from '../api/users'
import {
  setUsers,
  setProjects,
  showAlert,
  clearAlert,
  setUserProjectRoles,
  setAnnEvents,
  updateAnnEvent,
  setAnnEventsCount,
  setAdjEvents,
  updateAdjEvent,
  setAnnotatorProgress,
} from '.'
import type { CadaEvent, EventCount } from '../types'

type Dispatch = (action: unknown) => void
type GetState = () => { cada: { users: { id: number }[]; projects: { id: number }[]; userProjectRoles: Record<string, unknown[]>; annEventsCount: Record<string, EventCount> } }

export const getProjects = () => async (dispatch: Dispatch) => {
  try {
    const data = await projectsApi.getAll()
    dispatch(setProjects(data))
  } catch (err: any) {
    dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
    setTimeout(() => dispatch(clearAlert()), 3000)
  }
}

export const getUsers = (payload: { fid?: number }) => async (dispatch: Dispatch) => {
  try {
    const data = await usersApi.search(payload)
    dispatch(setUsers(data))
  } catch (err: any) {
    dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
    setTimeout(() => dispatch(clearAlert()), 3000)
  }
}

export const addUser = (payload: UserAddPayload) => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const newUser = await usersApi.add(payload)
    const users = getState().cada.users
    dispatch(setUsers([...users, newUser] as any))
    dispatch(showAlert({ message: 'New user added!', severity: 'success' }))
    setTimeout(() => dispatch(clearAlert()), 3000)
  } catch (err: any) {
    dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
    setTimeout(() => dispatch(clearAlert()), 3000)
  }
}

export const updateUser = (payload: UserAddPayload) => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const newUser = await usersApi.add(payload)
    const users = getState().cada.users
    dispatch(setUsers([...users, newUser] as any))
    dispatch(showAlert({ message: 'User updated!', severity: 'success' }))
    setTimeout(() => dispatch(clearAlert()), 3000)
  } catch (err: any) {
    dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
    setTimeout(() => dispatch(clearAlert()), 3000)
  }
}

export const removeUser = (userId: number) => async (dispatch: Dispatch, getState: GetState) => {
  try {
    await usersApi.remove(userId)
    const users = getState().cada.users
    dispatch(setUsers(users.filter((u) => u.id !== userId) as any))
    dispatch(showAlert({ message: 'User removed!', severity: 'success' }))
    setTimeout(() => dispatch(clearAlert()), 3000)
  } catch (err: any) {
    dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
    setTimeout(() => dispatch(clearAlert()), 3000)
  }
}

export const removeProjectUser = (payload: { cadaProjectId: number; userId: number; role: string; id: number }) => async (dispatch: Dispatch, getState: GetState) => {
  try {
    await projectsApi.removeUserRole(payload.cadaProjectId, payload.userId, payload.role)
    const userProjectRoles = getState().cada.userProjectRoles
    const currentRoles = (userProjectRoles[String(payload.userId)] || []) as Array<{ id: number; cadaProjectUsers: Array<{ id: number }> }>
    const nextRoles = currentRoles.map((project) => ({
      ...project,
      cadaProjectUsers: project.cadaProjectUsers.filter((pUser) => pUser.id !== payload.id),
    }))
    dispatch(setUserProjectRoles({ userId: String(payload.userId), roles: nextRoles as any }))
    dispatch(showAlert({ message: 'Project user removed!', severity: 'success' }))
    setTimeout(() => dispatch(clearAlert()), 3000)
  } catch (err: any) {
    dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
    setTimeout(() => dispatch(clearAlert()), 3000)
  }
}

export const getAnnotationEvents =
  (pid: unknown, userId: unknown, sinceId: unknown = '', showCompleted = false) =>
  async (dispatch: Dispatch) => {
    try {
      const data = await eventsApi.getAnnotationEvents(
        Number(pid),
        Number(userId),
        sinceId ? String(sinceId) : null,
        showCompleted
      )

      const sorted = {
        false: data.filter((d: CadaEvent) => !d.cadaAnnotations?.[0]?.completed),
        true: data.filter((d: CadaEvent) => d.cadaAnnotations?.[0]?.completed),
      }

      dispatch(setAnnEvents({ pid: String(pid), events: sorted }))
    } catch (err: any) {
      dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
      setTimeout(() => dispatch(clearAlert()), 3000)
    }
  }

export const updateAnnotation =
  (projectId: unknown, eventId: unknown, completed: unknown, annotation: unknown, isComplete: unknown = undefined) =>
  async (dispatch: Dispatch, getState: GetState) => {
    const showAlertFlag = isComplete !== undefined ? isComplete : completed
    try {
      const result = await eventsApi.saveAnnotation(annotation as any)

      dispatch(
        updateAnnEvent({
          pid: String(projectId),
          eventId: Number(eventId),
          updater: (e: CadaEvent) => ({
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
        const annEventsCount = getState().cada.annEventsCount
        const counts: EventCount = {
          ...(annEventsCount[String(projectId)] || { 0: 0, 1: 0 }),
        }
        counts[0] = (counts[0] || 0) - 1
        counts[1] = (counts[1] || 0) + 1
        dispatch(setAnnEventsCount({ pid: String(projectId), count: counts }))
      }

      if (showAlertFlag === true) {
        dispatch(showAlert({ message: 'Annotation updated!', severity: 'success' }))
        setTimeout(() => dispatch(clearAlert()), 3000)
      }
    } catch (err: any) {
      dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
      setTimeout(() => dispatch(clearAlert()), 3000)
    }
  }

export const getAdjudicationEvents =
  (projectId: unknown) =>
  async (dispatch: Dispatch) => {
    try {
      const data = await eventsApi.getAdjudicationEvents(Number(projectId))
      dispatch(setAdjEvents({ pid: String(projectId), events: data }))
    } catch (err: any) {
      dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
      setTimeout(() => dispatch(clearAlert()), 3000)
    }
  }

export const updateAdjudication =
  (projectId: unknown, eventId: unknown, _userId: unknown, completed: unknown, adjudication: unknown) =>
  async (dispatch: Dispatch) => {
    try {
      const result = await eventsApi.saveAdjudication(adjudication as any)

      dispatch(
        updateAdjEvent({
          pid: String(projectId),
          eventId: Number(eventId),
          updater: (e: CadaEvent) => ({
            ...e,
            cadaAdjudicationValues: [...(e.cadaAdjudicationValues || []), result],
          }),
        })
      )

      if (completed === true) {
        dispatch(showAlert({ message: 'Adjudication updated!', severity: 'success' }))
        setTimeout(() => dispatch(clearAlert()), 3000)
      }
    } catch (err: any) {
      dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
      setTimeout(() => dispatch(clearAlert()), 3000)
    }
  }

export const getAnnotatorProgress =
  (pid: unknown, excludeIds: unknown[] = []) =>
  async (dispatch: Dispatch) => {
    try {
      const progress = await eventsApi.getAnnotatorProgress(Number(pid), excludeIds as number[])
      dispatch(setAnnotatorProgress({ pid: String(pid), progress }))
    } catch (err: any) {
      dispatch(showAlert({ message: err.message || err, severity: 'warning' }))
      setTimeout(() => dispatch(clearAlert()), 3000)
    }
  }

export const getAnnotators =
  (eIds: unknown) =>
  async (_dispatch: Dispatch) => {
    try {
      await eventsApi.getAnnotators(eIds as number[])
      // Annotators are fetched but not stored in RTK state
      // Components that need annotator data should use the API directly
    } catch (err: any) {
      console.error('Failed to fetch annotators:', err)
    }
  }
