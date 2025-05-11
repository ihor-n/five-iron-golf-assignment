export type TaskStatus = 'initial' | 'started' | 'paused' | 'finished'

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
}
