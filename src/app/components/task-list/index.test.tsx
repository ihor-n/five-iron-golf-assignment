import '@testing-library/jest-dom'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { TaskList } from '.'
import { TaskServiceProvider } from '../../context/taskServiceProvider'
import { container } from '../../di/container'
import { TOKENS } from '../../di/tokens'
import { ITaskService } from '../../services/task.service'
import { Task } from '../../services/task.types'

describe('TaskList', () => {
  const taskServiceInstance = container.get<ITaskService>(TOKENS.TaskService)
  let startTaskSpy: jest.SpyInstance
  let pauseTaskSpy: jest.SpyInstance
  let finishTaskSpy: jest.SpyInstance
  let deleteTaskSpy: jest.SpyInstance

  beforeEach(() => {
    taskServiceInstance.clearTasks()
    startTaskSpy = jest.spyOn(taskServiceInstance, 'startTask')
    pauseTaskSpy = jest.spyOn(taskServiceInstance, 'pauseTask')
    finishTaskSpy = jest.spyOn(taskServiceInstance, 'finishTask')
    deleteTaskSpy = jest.spyOn(taskServiceInstance, 'deleteTask')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const renderTaskList = () => {
    return render(
      <TaskServiceProvider taskService={taskServiceInstance}>
        <TaskList />
      </TaskServiceProvider>
    )
  }

  const addInitialTasks = (tasks: Array<{ title: string; description?: string }>): Task[] => {
    return tasks.map(task => taskServiceInstance.addTask(task.title, task.description))
  }

  test('renders "No tasks yet." when there are no tasks', () => {
    renderTaskList()
    expect(screen.getByText('No tasks yet.')).toBeInTheDocument()
  })

  test('renders a list of tasks with titles, descriptions, and initial statuses', () => {
    addInitialTasks([{ title: 'Task 1', description: 'Description for Task 1' }, { title: 'Task 2' }])
    const tasks = taskServiceInstance.getTasks()
    if (tasks.length > 0) {
      taskServiceInstance.startTask(tasks[0].id)
      taskServiceInstance.finishTask(tasks[0].id)
    }

    renderTaskList()

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(2)

    const task1Item = listItems[0]
    const task1TitleSpan = within(task1Item).getByText('Task 1')
    expect(task1TitleSpan).toBeInTheDocument()
    const task1DetailsDiv = task1TitleSpan.parentElement
    expect(task1DetailsDiv).toHaveClass('completed')
    expect(within(task1Item).getByText('Description for Task 1')).toBeInTheDocument()
    expect(within(task1Item).getByText('Status: finished')).toBeInTheDocument()
    expect(within(task1Item).queryByRole('button', { name: /^start$/i })).not.toBeInTheDocument()
    expect(within(task1Item).queryByRole('button', { name: /^resume$/i })).not.toBeInTheDocument()
    expect(within(task1Item).queryByRole('button', { name: /^pause$/i })).not.toBeInTheDocument()
    expect(within(task1Item).queryByRole('button', { name: /^complete$/i })).not.toBeInTheDocument()
    expect(within(task1Item).getByRole('button', { name: /delete task task 1/i })).toBeInTheDocument()

    const task2Item = listItems[1]
    const task2TitleSpan = within(task2Item).getByText('Task 2')
    expect(task2TitleSpan).toBeInTheDocument()
    const task2DetailsDiv = task2TitleSpan.parentElement
    expect(task2DetailsDiv).not.toHaveClass('completed')
    expect(within(task2Item).queryByText(/description for/i)).not.toBeInTheDocument()
    expect(within(task2Item).getByText('Status: initial')).toBeInTheDocument()
    expect(within(task2Item).getByRole('button', { name: /^start$/i })).toBeInTheDocument()
    expect(within(task2Item).queryByRole('button', { name: /^pause$/i })).not.toBeInTheDocument()
    expect(within(task2Item).queryByRole('button', { name: /^complete$/i })).not.toBeInTheDocument()
    expect(within(task2Item).getByRole('button', { name: /delete task task 2/i })).toBeInTheDocument()
  })

  test('calls service startTask and updates UI when "Start" button is clicked for an "initial" task', () => {
    const [initialTask] = addInitialTasks([{ title: 'Task to Start' }])
    renderTaskList()

    const taskItem = screen.getByText(initialTask.title).closest('li')!
    const startButton = within(taskItem).getByRole('button', { name: /^start$/i })
    fireEvent.click(startButton)

    expect(startTaskSpy).toHaveBeenCalledTimes(1)
    expect(startTaskSpy).toHaveBeenCalledWith(initialTask.id)
    expect(within(taskItem).getByText('Status: started')).toBeInTheDocument()
    expect(within(taskItem).queryByRole('button', { name: /^start$/i })).not.toBeInTheDocument()
    expect(within(taskItem).getByRole('button', { name: /^pause$/i })).toBeInTheDocument()
    expect(within(taskItem).getByRole('button', { name: /^complete$/i })).toBeInTheDocument()
  })

  test('calls service startTask and updates UI when "Resume" button is clicked for a "paused" task', () => {
    const [pausedTaskData] = addInitialTasks([{ title: 'Task to Resume' }])
    taskServiceInstance.startTask(pausedTaskData.id)
    taskServiceInstance.pauseTask(pausedTaskData.id)
    renderTaskList()

    const taskItem = screen.getByText(pausedTaskData.title).closest('li')!
    startTaskSpy.mockClear()
    const resumeButton = within(taskItem).getByRole('button', { name: /^resume$/i })
    fireEvent.click(resumeButton)

    expect(startTaskSpy).toHaveBeenCalledTimes(1)
    expect(startTaskSpy).toHaveBeenCalledWith(pausedTaskData.id)
    expect(within(taskItem).getByText('Status: started')).toBeInTheDocument()
    expect(within(taskItem).queryByRole('button', { name: /^resume$/i })).not.toBeInTheDocument()
    expect(within(taskItem).getByRole('button', { name: /^pause$/i })).toBeInTheDocument()
  })

  test('calls service pauseTask and updates UI when "Pause" button is clicked for a "started" task', () => {
    const [startedTaskData] = addInitialTasks([{ title: 'Task to Pause' }])
    taskServiceInstance.startTask(startedTaskData.id)
    renderTaskList()

    const taskItem = screen.getByText(startedTaskData.title).closest('li')!
    const pauseButton = within(taskItem).getByRole('button', { name: /^pause$/i })
    fireEvent.click(pauseButton)

    expect(pauseTaskSpy).toHaveBeenCalledTimes(1)
    expect(pauseTaskSpy).toHaveBeenCalledWith(startedTaskData.id)
    expect(within(taskItem).getByText('Status: paused')).toBeInTheDocument()
    expect(within(taskItem).getByRole('button', { name: /^resume$/i })).toBeInTheDocument()
    expect(within(taskItem).queryByRole('button', { name: /^pause$/i })).not.toBeInTheDocument()
  })

  test('calls service finishTask and updates UI when "Complete" button is clicked for a "started" task', () => {
    const [startedTaskData] = addInitialTasks([{ title: 'Task to Complete from Started' }])
    taskServiceInstance.startTask(startedTaskData.id)
    renderTaskList()

    const taskItem = screen.getByText(startedTaskData.title).closest('li')!
    const completeButton = within(taskItem).getByRole('button', { name: /^complete$/i })
    fireEvent.click(completeButton)

    expect(finishTaskSpy).toHaveBeenCalledTimes(1)
    expect(finishTaskSpy).toHaveBeenCalledWith(startedTaskData.id)
    expect(within(taskItem).getByText('Status: finished')).toBeInTheDocument()
    const finishedTaskTitleSpan = within(taskItem).getByText(startedTaskData.title)
    const finishedTaskDetailsDiv = finishedTaskTitleSpan.parentElement
    expect(finishedTaskDetailsDiv).toHaveClass('completed')
    expect(within(taskItem).queryByRole('button', { name: /^start$/i })).not.toBeInTheDocument()
    expect(within(taskItem).queryByRole('button', { name: /^resume$/i })).not.toBeInTheDocument()
    expect(within(taskItem).queryByRole('button', { name: /^pause$/i })).not.toBeInTheDocument()
    expect(within(taskItem).queryByRole('button', { name: /^complete$/i })).not.toBeInTheDocument()
  })

  test('calls service finishTask and updates UI when "Complete" button is clicked for a "paused" task', () => {
    const [pausedTaskData] = addInitialTasks([{ title: 'Task to Complete from Paused' }])
    taskServiceInstance.startTask(pausedTaskData.id)
    taskServiceInstance.pauseTask(pausedTaskData.id)
    renderTaskList()

    const taskItem = screen.getByText(pausedTaskData.title).closest('li')!
    const completeButton = within(taskItem).getByRole('button', { name: /^complete$/i })
    fireEvent.click(completeButton)

    expect(finishTaskSpy).toHaveBeenCalledTimes(1)
    expect(finishTaskSpy).toHaveBeenCalledWith(pausedTaskData.id)
    expect(within(taskItem).getByText('Status: finished')).toBeInTheDocument()
    const finishedPausedTaskTitleSpan = within(taskItem).getByText(pausedTaskData.title)
    const finishedPausedTaskDetailsDiv = finishedPausedTaskTitleSpan.parentElement
    expect(finishedPausedTaskDetailsDiv).toHaveClass('completed')
  })

  test('calls service deleteTask when a delete button is clicked', () => {
    addInitialTasks([{ title: 'Task to Keep' }, { title: 'Task to Delete', description: 'This will be deleted' }])
    renderTaskList()

    const allTasks = taskServiceInstance.getTasks()
    const taskToDelete = allTasks.find(t => t.title === 'Task to Delete')
    expect(taskToDelete).toBeDefined()
    expect(taskToDelete?.description).toBe('This will be deleted')

    const listItems = screen.getAllByRole('listitem')
    let deleteButton: HTMLElement | null = null

    listItems.forEach(item => {
      if (within(item).queryByText('Task to Delete')) {
        deleteButton = within(item).getByRole('button', { name: /delete task task to delete/i })
      }
    })
    expect(deleteButton).toBeInTheDocument()

    fireEvent.click(deleteButton!)

    expect(deleteTaskSpy).toHaveBeenCalledTimes(1)
    expect(deleteTaskSpy).toHaveBeenCalledWith(taskToDelete!.id)
    expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument()
    expect(screen.getByText('Task to Keep')).toBeInTheDocument()
  })
})
