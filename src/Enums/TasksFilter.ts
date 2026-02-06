/**
 * Task filter types
 */
export enum TaskFilterType {
  /** All tasks */
  ALL = 'all',
  /** Only completed tasks */
  COMPLETED = 'completed',
  /** Only incomplete tasks */
  INCOMPLETE = 'incomplete',
}

/**
 * Task types
 */
export enum TaskType {
  /** Follow-up task */
  FOLLOW_UP = 1,
  /** Meeting task */
  MEETING = 2,
  /** Call task */
  CALL = 3,
}
