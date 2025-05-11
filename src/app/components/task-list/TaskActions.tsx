import React from 'react'
import { Task } from '../../services/task.types'
import { useTasks } from '../../hooks/useTasks'
import { Button } from '../button'

export const TaskActions: React.FC<Omit<Task, 'description'>> = ({ id, status, title }) => {
  const { startTask, pauseTask, finishTask, deleteTask } = useTasks()

  return (
    <div className="task-actions">
      <div className="task-actions">
        {(status === 'initial' || status === 'paused') && (
          <Button onClick={() => startTask(id)} className="start-task-button">
            {status === 'paused' ? 'Resume' : 'Start'}
          </Button>
        )}
        {status === 'started' && (
          <Button onClick={() => pauseTask(id)} className="pause-task-button">
            Pause
          </Button>
        )}
        {(status === 'started' || status === 'paused') && (
          <Button onClick={() => finishTask(id)} className="complete-task-button">
            Complete
          </Button>
        )}
        <Button onClick={() => deleteTask(id)} className="delete-task-button" aria-label={`Delete task ${title}`}>
          Delete
        </Button>
      </div>
    </div>
  )
}
