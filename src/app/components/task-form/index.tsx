import React, { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import { Button } from '../button'

export const TaskForm: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { addTask } = useTasks()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      addTask(title.trim(), description.trim())
      setTitle('')
      setDescription('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter task title"
        className="task-input"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Enter task description (optional)"
        className="task-description-input"
        rows={3}
      />
      <Button type="submit" className="add-task-button">
        Create Task
      </Button>
    </form>
  )
}
