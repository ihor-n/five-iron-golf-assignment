import React from 'react'
import { Task } from '../../services/task.types'

export const TaskDetails: React.FC<Omit<Task, 'id'>> = ({ title, description, status }) => (
  <div className={`task-details ${status === 'finished' ? 'completed' : ''}`}>
    <span className="task-title">{title}</span>
    {description && <p className="task-description">{description}</p>}
    <p className="task-status">Status: {status}</p>
  </div>
)
