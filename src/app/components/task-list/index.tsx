import React from 'react'
import { useTasks } from '../../hooks/useTasks'
import { TaskDetails } from './TaskDetails'
import { TaskActions } from './TaskActions'

export const TaskList: React.FC = () => {
  const { tasks } = useTasks()
  if (tasks.length === 0) {
    return <p>No tasks yet.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className="task-item">
          <TaskDetails status={task.status} title={task.title} description={task.description} />
          <TaskActions status={task.status} title={task.title} id={task.id} />
        </li>
      ))}
    </ul>
  )
}
