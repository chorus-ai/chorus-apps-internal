import { apiFetch } from '../../../hooks/useApiFetch';
import type {
  CadaEvent,
  AnnotationValue,
  AdjudicationValue,
  AssignmentCount,
  AnnotatorProgressItem,
  SaveAnnotationPayload,
  SaveAdjudicationPayload,
  User,
} from '../types';

export async function getAnnotationEvents(
  pid: number,
  uid: number,
  sinceId: string | null = null,
  showCompleted = false
): Promise<CadaEvent[]> {
  const params = new URLSearchParams({
    pid: String(pid),
    uid: String(uid),
    pageSize: '1000',
  });
  if (!showCompleted) params.set('completed', '0');
  if (sinceId) params.set('sinceId', sinceId);

  return apiFetch<CadaEvent[]>(`/api/cada/event/assignments?${params}`);
}

export async function getAdjudicationEvents(
  pid: number
): Promise<CadaEvent[]> {
  return apiFetch<CadaEvent[]>(`/api/cada/event?pid=${pid}&completed=1`);
}

export async function getPaginated(
  pid: number,
  page: number,
  pageSize = 100
): Promise<CadaEvent[]> {
  return apiFetch<CadaEvent[]>(
    `/api/cada/event?pid=${pid}&page=${page}&pageSize=${pageSize}`
  );
}

export async function getAllPaginated(pid: number): Promise<CadaEvent[]> {
  const allEvents: CadaEvent[] = [];
  let pg = 1;
  const pgSize = 100;

  while (true) {
    const batch = await getPaginated(pid, pg, pgSize);
    allEvents.push(...batch);
    if (batch.length < pgSize) break;
    pg++;
  }

  return allEvents;
}

export async function getCount(
  pid: number,
  completed?: boolean
): Promise<number> {
  const params = new URLSearchParams({ pid: String(pid) });
  if (completed !== undefined) params.set('completed', String(completed));
  return apiFetch<number>(`/api/cada/event/count?${params}`);
}

export async function getAssignmentsCount(
  pid: number,
  uid: number
): Promise<AssignmentCount[]> {
  return apiFetch<AssignmentCount[]>(
    `/api/cada/event/assignmentsCount?pid=${pid}&uid=${uid}`
  );
}

export async function createFromFiles(
  pid: number,
  fileIds: number[]
): Promise<CadaEvent[]> {
  return apiFetch<CadaEvent[]>(`/api/cada/event?pid=${pid}`, {
    method: 'POST',
    body: JSON.stringify({ files: fileIds }),
  });
}

export async function assignToUser(
  uid: number,
  eventIds: number[]
): Promise<void> {
  await apiFetch<void>(`/api/cada/event/assignments?uid=${uid}`, {
    method: 'POST',
    body: JSON.stringify(eventIds),
  });
}

export async function getAnnotators(eIds: number[]): Promise<Omit<User, 'featureUsers'>[]> {
  return apiFetch<Omit<User, 'featureUsers'>[]>('/api/cada/event/annotators', {
    method: 'POST',
    body: JSON.stringify(eIds),
  });
}

export async function getAnnotatorProgress(
  pid: number,
  excludeIds: number[] = []
): Promise<Record<string, AnnotatorProgressItem[]>> {
  const data = await apiFetch<AnnotatorProgressItem[]>(`/api/cada/event/progress/${pid}`);
  const progress: Record<string, AnnotatorProgressItem[]> = {};
  data.forEach((p) => {
    if (!excludeIds.includes(p.user?.id)) {
      if (progress[String(p.userId)]) {
        progress[String(p.userId)].push(p);
      } else {
        progress[String(p.userId)] = [p];
      }
    }
  });
  return progress;
}

export async function saveAnnotation(
  annotation: SaveAnnotationPayload
): Promise<AnnotationValue> {
  return apiFetch<AnnotationValue>('/api/cada/event/annotationValue', {
    method: 'POST',
    body: JSON.stringify(annotation),
  });
}

export async function saveAdjudication(
  adjudication: SaveAdjudicationPayload
): Promise<AdjudicationValue> {
  return apiFetch<AdjudicationValue>('/api/cada/event/adjudicationValue', {
    method: 'POST',
    body: JSON.stringify(adjudication),
  });
}
