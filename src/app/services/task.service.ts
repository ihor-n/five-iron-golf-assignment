import { injectable } from 'inversify'
import { Task } from './task.types'

export interface ITaskService {
  addTask(title: string, description?: string): Task
  getTasks(): Task[]
  startTask(id: number): void
  pauseTask(id: number): void
  finishTask(id: number): void
  deleteTask(id: number): void
  clearTasks(): void
}

@injectable()
export class TaskService implements ITaskService {
  private tasks: Task[] = []
  private nextId = 1

  addTask(title: string, description?: string): Task {
    const newTask: Task = {
      id: this.nextId++,
      title,
      description,
      status: 'initial'
    }
    this.tasks.push(newTask)
    return newTask
  }

  getTasks(): Task[] {
    return [...this.tasks]
  }

  startTask(id: number): void {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      if (task.status === 'initial' || task.status === 'paused') {
        task.status = 'started'
      }
    }
  }

  pauseTask(id: number): void {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      if (task.status === 'started') {
        task.status = 'paused'
      }
    }
  }

  finishTask(id: number): void {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      if (task.status === 'started' || task.status === 'paused') {
        task.status = 'finished'
      }
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id)
  }

  clearTasks(): void {
    this.tasks = []
  }
}
