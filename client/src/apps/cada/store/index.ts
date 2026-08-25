import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type {
  Alert,
  Project,
  ProjectWithRoles,
  ProjectUserRole,
  ProjectUser,
  CadaEvent,
  EventCount,
  BucketData,
  User,
  AnnotatorProgressItem,
} from '../types'

export type CadaState = {
  userProjects: Record<string, ProjectWithRoles>
  userRoles: ProjectUserRole[]

  annEvents: Record<string, { true: CadaEvent[]; false: CadaEvent[] }>
  adjEvents: Record<string, CadaEvent[]>

  annEventsCount: Record<string, EventCount>
  adjEventsCount: Record<string, number>

  alert: Alert | null

  projects: Project[]
  projectUsers: Record<string, ProjectUser[]>
  users: User[]
  userProjectRoles: Record<string, ProjectWithRoles[]>

  buckets: Record<string, BucketData>
  eventsCount: Record<string, number>

  annotatorProgress: Record<string, Record<string, AnnotatorProgressItem[]>>
}

export const initialState: CadaState = {
  userProjects: {},
  userRoles: [],

  annEvents: {},
  adjEvents: {},

  annEventsCount: {},
  adjEventsCount: {},

  alert: null,

  projects: [],
  projectUsers: {},
  users: [],
  userProjectRoles: {},

  buckets: {},
  eventsCount: {},

  annotatorProgress: {},
}

const cadaSlice = createSlice({
  name: 'cada',
  initialState,
  reducers: {
    setUserProjects(state, action: PayloadAction<Record<string, ProjectWithRoles>>) {
      state.userProjects = action.payload
    },

    setUserRoles(state, action: PayloadAction<ProjectUserRole[]>) {
      state.userRoles = action.payload
    },

    setAnnEvents(
      state,
      action: PayloadAction<{
        pid: string
        events: { true: CadaEvent[]; false: CadaEvent[] }
      }>
    ) {
      const { pid, events } = action.payload
      state.annEvents[pid] = events
    },

    updateAnnEvent(
      state,
      action: PayloadAction<{
        pid: string
        eventId: number
        updater: (e: CadaEvent) => CadaEvent
        moveToCompleted?: boolean
      }>
    ) {
      const { pid, eventId, updater, moveToCompleted = false } = action.payload
      const current = state.annEvents[pid]
      if (!current) return

      let targetEvent: CadaEvent | null = null

      ;(['false', 'true'] as const).forEach((key) => {
        current[key] = current[key].map((e) => {
          if (e.id === eventId) {
            targetEvent = updater(e)
            return targetEvent
          }
          return e
        })
      })

      if (moveToCompleted && targetEvent) {
        current.false = current.false.filter((e) => e.id !== eventId)
        if (!current.true.some((e) => e.id === eventId)) {
          current.true.push(targetEvent)
        }
      }
    },

    setAdjEvents(
      state,
      action: PayloadAction<{
        pid: string
        events: CadaEvent[]
      }>
    ) {
      const { pid, events } = action.payload
      state.adjEvents[pid] = events
    },

    updateAdjEvent(
      state,
      action: PayloadAction<{
        pid: string
        eventId: number
        updater: (e: CadaEvent) => CadaEvent
      }>
    ) {
      const { pid, eventId, updater } = action.payload
      state.adjEvents[pid] = (state.adjEvents[pid] || []).map((e) =>
        e.id === eventId ? updater(e) : e
      )
    },

    setAnnEventsCount(
      state,
      action: PayloadAction<{
        pid: string
        count: EventCount
      }>
    ) {
      const { pid, count } = action.payload
      console.log('Setting annotation events count:', pid, count);
      state.annEventsCount[pid] = count
    },

    setAdjEventsCount(
      state,
      action: PayloadAction<{
        pid: string
        count: number
      }>
    ) {
      const { pid, count } = action.payload
      state.adjEventsCount[pid] = count
    },

    showAlert(
      state,
      action: PayloadAction<{
        message: string | Error
        severity: Alert['severity']
      }>
    ) {
      state.alert = action.payload
    },

    clearAlert(state) {
      state.alert = null
    },

    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload
    },

    setProjectUsers(
      state,
      action: PayloadAction<{
        pid: string
        users: ProjectUser[]
      }>
    ) {
      const { pid, users } = action.payload
      state.projectUsers[pid] = users
    },

    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload
    },

    setUserProjectRoles(
      state,
      action: PayloadAction<{
        userId: string
        roles: ProjectWithRoles[]
      }>
    ) {
      const { userId, roles } = action.payload
      state.userProjectRoles[userId] = roles
    },

    setBuckets(
      state,
      action: PayloadAction<{
        path: string
        data: BucketData
      }>
    ) {
      const { path, data } = action.payload
      state.buckets[path] = data
    },

    setEventsCount(
      state,
      action: PayloadAction<{
        pid: string
        count: number
      }>
    ) {
      const { pid, count } = action.payload
      state.eventsCount[pid] = count
    },

    setAnnotatorProgress(
      state,
      action: PayloadAction<{
        pid: string
        progress: Record<string, AnnotatorProgressItem[]>
      }>
    ) {
      const { pid, progress } = action.payload
      state.annotatorProgress[pid] = progress
    },

    resetCadaState() {
      return initialState
    },
  },
})

export const {
  setUserProjects,
  setUserRoles,
  setAnnEvents,
  updateAnnEvent,
  setAdjEvents,
  updateAdjEvent,
  setAnnEventsCount,
  setAdjEventsCount,
  showAlert,
  clearAlert,
  setProjects,
  setProjectUsers,
  setUsers,
  setUserProjectRoles,
  setBuckets,
  setEventsCount,
  setAnnotatorProgress,
  resetCadaState
} = cadaSlice.actions

export const cadaReducer = cadaSlice.reducer