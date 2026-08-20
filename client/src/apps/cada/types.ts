// --- JSON / form value primitives ---

/** Any valid JSON-serializable value */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/** Value held by a single form field (text, multiple-choice → string; checklist → string[]) */
export type FormFieldValue = string | string[];

/** Form field values keyed by FormField.id for a single concept */
export type FormValues = Record<number, FormFieldValue>;

/** Form field values keyed by concept index */
export type ConceptFormValues = Record<number, FormValues>;

/** A single concept entry within file JSON data */
export interface ConceptInfo {
  metadata?: Record<string, JsonValue>;
  [key: string]: JsonValue | Record<string, JsonValue> | undefined;
}

// --- Shared / reusable primitives ---

export interface FeatureUser {
  id: number;
  role: string;
  status?: string;
  featureId: number;
  userId: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  username?: string;
  loginType?: string;
  avatar?: string | null;
  isBot?: boolean;
  passwordResetAt?: string | null;
  featureUsers: FeatureUser[];
}

// --- Project domain ---

export interface Project {
  id: number;
  name: string;
  title?: string;
  description?: string;
  goal?: string;
  data?: string;
  info?: string;
  projectType?: string;
  attributes?: string;
  forms?: FormSummary[];
  cadaProjectUsers?: ProjectUserRole[];
}

export interface ProjectCreatePayload {
  name: string;
  title?: string;
  description?: string;
  goal?: string;
  data?: string;
  projectType?: string;
  attributes?: string;
}

export interface ProjectUpdatePayload {
  name?: string;
  title?: string;
  description?: string;
  goal?: string;
  data?: string;
  projectType?: string;
  attributes?: string;
}

export interface ProjectUserRole {
  id: number;
  cadaProjectId: number;
  userId: number;
  role: 'annotator' | 'adjudicator';
}

/** User as returned by GET /api/cada/project/:pid/users */
export interface ProjectUser {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  cadaProjectUsers: ProjectUserRole[];
}

/** Project as returned by GET /api/cada/project/users/:uid — includes forms with full fields */
export interface ProjectWithRoles extends Project {
  cadaProjectUsers: ProjectUserRole[];
  forms?: FormDetailWithFields[];
}

// --- Form domain ---

export interface FormSummary {
  id: number;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormDetail {
  id: number;
  title?: string;
  formFields: FormField[];
  createdAt?: string;
  updatedAt?: string;
}

/** Same as FormDetail but guaranteed to have formFields with triggers resolved */
export type FormDetailWithFields = FormDetail;

export interface FormField {
  id: number;
  formId?: number;
  label: string;
  type: string;
  required: boolean;
  order: number;
  options?: Record<string, string[]> | string[] | null;
  active?: boolean;
  triggers?: FormFieldTrigger[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FormFieldTrigger {
  id: number;
  label?: string;
  type?: string;
  formFieldTrigger?: {
    id: number;
    condition: string;
    action: string;
  };
}

export interface FormFieldCreatePayload {
  formId: number;
  label: string;
  type: string;
  required: boolean;
  order: number;
  options?: Record<string, string[]> | string[] | null;
  triggers?: Array<{
    targetFieldId: number;
    condition: string;
    action: string;
  }>;
}

export interface FormFieldReplacePayload {
  label: string;
  type: string;
  required: boolean;
  options?: Record<string, string[]> | string[] | null;
}

// --- Event domain ---

export interface CadaEvent {
  id: number;
  cadaFile: CadaFile;
  cadaAnnotations: CadaAnnotation[];
  cadaAdjudicationValues?: AdjudicationValue[];
  cadaProjectId?: number;
  cadaFileId?: number;
  info?: string;
}

export interface CadaFile {
  id: number;
  path: string;
  type?: string;
  ext?: string;
  info?: string;
}

export interface CadaAnnotation {
  id: number;
  userId: number;
  completed: boolean;
  cadaEventId?: number;
  user?: Pick<User, 'id' | 'firstName' | 'lastName'>;
  cadaAnnotationValues: AnnotationValue[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AnnotationValue {
  id: number;
  field: string;
  value: string;
  cadaAnnotationId: number;
  createdAt: string;
}

export interface AdjudicationValue {
  id: number;
  field: string;
  value: string;
  userId: number;
  cadaEventId: number;
  annotators?: string;
  createdAt: string;
}

export interface SaveAnnotationPayload {
  field: string;
  value: string;
  cadaAnnotationId: number;
  completed?: boolean;
  createdAt?: string;
}

export interface SaveAdjudicationPayload {
  field: string;
  value: string;  
  cadaEventId: number;
  userId: number;
  annotators?: string;
}

export interface AssignmentCount {
  completed: boolean;
  count: number;
}

/** Annotator progress item — a cadaAnnotation with nested cadaEvent and user */
export interface AnnotatorProgressItem {
  id: number;
  completed: boolean;
  userId: number;
  cadaEventId: number;
  createdAt?: string;
  updatedAt?: string;
  cadaEvent: {
    id: number;
    info?: string;
    cadaProjectId: number;
    cadaFileId: number;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

// --- Bucket / File domain ---

export interface BucketData {
  fileLength: number;
  files: BucketFile[];
}

export interface BucketFile {
  path: string;
  type: 'file' | 'dir';
}

/**
 * JSON file content from bucket storage used in CADA annotation/adjudication.
 */
export interface FileJsonData {
  info?: ConceptInfo[];
  metadata?: Record<string, JsonValue>;
  filePath?: string;
}

// --- Counts ---

export interface EventCount {
  [completed: string]: number;
}

// --- Alert ---

export interface Alert {
  message: string | Error;
  severity: 'success' | 'warning' | 'error' | 'info';
}

// --- Auth ---

export interface ImpersonateResponse {
  user: User & { featureUsers: Record<string, { role: string; app: string }> };
  impersonating: boolean;
}

// --- Edit form field (used in form editor UI) ---

export interface EditFormField {
  _id?: number;
  label: string;
  type: string;
  required: boolean;
  options?: Record<string, string[]> | string[] | null;
  triggers?: Array<{
    field: string;
    condition: string;
    action: string;
  }>;
}
