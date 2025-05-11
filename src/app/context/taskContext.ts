import { createContext } from 'react'
import { Task } from '../services/task.types'

export interface ITaskContext {
  tasks: Task[]
  addTask: (title: string, description?: string) => void
  deleteTask: (id: number) => void
  startTask: (id: number) => void
  pauseTask: (id: number) => void
  finishTask: (id: number) => void
}

export const TaskContext = createContext<ITaskContext | undefined>(undefined)
