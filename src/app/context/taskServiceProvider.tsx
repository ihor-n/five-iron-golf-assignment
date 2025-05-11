import React, { useMemo, useState, useCallback } from 'react'
import { ITaskService } from '../services/task.service'
import { TaskContext } from './taskContext'
import { Task } from '../services/task.types'

interface TaskServiceProviderProps {
  children: React.ReactNode
  taskService: ITaskService
}

export const TaskServiceProvider: React.FC<TaskServiceProviderProps> = ({ children, taskService }) => {
  const [tasks, setTasks] = useState<Task[]>(() => taskService.getTasks())

  const refreshTasks = useCallback(() => {
    setTasks(taskService.getTasks())
  }, [taskService])

  const addTask = useCallback(
    (title: string, description?: string) => {
      taskService.addTask(title, description)
      refreshTasks()
    },
    [taskService, refreshTasks]
  )

  const startTask = useCallback(
    (id: number) => {
      taskService.startTask(id)
      refreshTasks()
    },
    [taskService, refreshTasks]
  )

  const deleteTask = useCallback(
    (id: number) => {
      taskService.deleteTask(id)
      refreshTasks()
    },
    [taskService, refreshTasks]
  )

  const pauseTask = useCallback(
    (id: number) => {
      taskService.pauseTask(id)
      refreshTasks()
    },
    [taskService, refreshTasks]
  )

  const finishTask = useCallback(
    (id: number) => {
      taskService.finishTask(id)
      refreshTasks()
    },
    [taskService, refreshTasks]
  )

  const contextValue = useMemo(
    () => ({
      tasks,
      addTask,
      deleteTask,
      startTask,
      pauseTask,
      finishTask
    }),
    [tasks, addTask, deleteTask, startTask, pauseTask, finishTask]
  )

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
}
