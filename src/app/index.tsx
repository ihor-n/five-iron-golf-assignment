import React, { useMemo } from 'react'
import { TaskForm, TaskList } from './components'
import { TaskServiceProvider } from './context/taskServiceProvider'
import { container } from './di/container'
import { ITaskService } from './services/task.service'
import { TOKENS } from './di/tokens'

export const App: React.FC = () => {
  const taskServiceInstance = useMemo(() => container.get<ITaskService>(TOKENS.TaskService), [])

  return (
    <div className="container">
      <h1 className="title">Task Manager</h1>
      <TaskServiceProvider taskService={taskServiceInstance}>
        <TaskForm />
        <TaskList />
      </TaskServiceProvider>
      <p className="description">A minimal React + InversifyJS app demonstrating DI.</p>
    </div>
  )
}
