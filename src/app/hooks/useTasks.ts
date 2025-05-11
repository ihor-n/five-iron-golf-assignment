import { useContext } from 'react'
import { TaskContext, ITaskContext } from '../context/taskContext'

export const useTasks = (): ITaskContext => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskServiceProvider')
  }
  return context
}
