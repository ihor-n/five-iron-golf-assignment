import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskForm } from '.'
import { TaskServiceProvider } from '../../context/taskServiceProvider'
import { container } from '../../di/container'
import { TOKENS } from '../../di/tokens'
import { ITaskService } from '../../services/task.service'

describe('TaskForm', () => {
  const taskServiceInstance = container.get<ITaskService>(TOKENS.TaskService)
  let addTaskSpy: jest.SpyInstance

  beforeEach(() => {
    taskServiceInstance.clearTasks()
    addTaskSpy = jest.spyOn(taskServiceInstance, 'addTask')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const renderTaskForm = () => {
    return render(
      <TaskServiceProvider taskService={taskServiceInstance}>
        <TaskForm />
      </TaskServiceProvider>
    )
  }

  test('renders without crashing', () => {
    renderTaskForm()
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter task description (optional)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
  })

  test('allows typing in the title input field', () => {
    renderTaskForm()
    const inputElement = screen.getByPlaceholderText('Enter task title') as HTMLInputElement
    fireEvent.change(inputElement, { target: { value: 'New Test Task' } })
    expect(inputElement.value).toBe('New Test Task')
  })

  test('allows typing in the description textarea', () => {
    renderTaskForm()
    const textareaElement = screen.getByPlaceholderText('Enter task description (optional)') as HTMLTextAreaElement
    fireEvent.change(textareaElement, { target: { value: 'This is a description.' } })
    expect(textareaElement.value).toBe('This is a description.')
  })

  test('calls service addTask with title and description, and clears inputs when form is submitted', () => {
    renderTaskForm()
    const inputElement = screen.getByPlaceholderText('Enter task title') as HTMLInputElement
    const textareaElement = screen.getByPlaceholderText('Enter task description (optional)') as HTMLTextAreaElement
    const submitButton = screen.getByRole('button', { name: /create task/i })

    fireEvent.change(inputElement, { target: { value: 'A Valid Task' } })
    fireEvent.change(textareaElement, { target: { value: 'Task Description' } })
    fireEvent.click(submitButton)

    expect(addTaskSpy).toHaveBeenCalledTimes(1)
    expect(addTaskSpy).toHaveBeenCalledWith('A Valid Task', 'Task Description')
    expect(inputElement.value).toBe('')
    expect(textareaElement.value).toBe('')
  })

  test('calls service addTask with title and empty description, and clears inputs when form is submitted with only title', () => {
    renderTaskForm()
    const inputElement = screen.getByPlaceholderText('Enter task title') as HTMLInputElement
    const textareaElement = screen.getByPlaceholderText('Enter task description (optional)') as HTMLTextAreaElement
    const submitButton = screen.getByRole('button', { name: /create task/i })

    fireEvent.change(inputElement, { target: { value: 'Task Without Description' } })
    fireEvent.click(submitButton)

    expect(addTaskSpy).toHaveBeenCalledTimes(1)
    expect(addTaskSpy).toHaveBeenCalledWith('Task Without Description', '')
    expect(inputElement.value).toBe('')
    expect(textareaElement.value).toBe('')
  })

  test('does not call service addTask and does not clear input when form is submitted with an empty or whitespace title', () => {
    renderTaskForm()
    const inputElement = screen.getByPlaceholderText('Enter task title') as HTMLInputElement
    const textareaElement = screen.getByPlaceholderText('Enter task description (optional)') as HTMLTextAreaElement
    const submitButton = screen.getByRole('button', { name: /create task/i })

    fireEvent.change(inputElement, { target: { value: '  ' } })
    fireEvent.click(submitButton)
    expect(addTaskSpy).not.toHaveBeenCalled()
    expect(inputElement.value).toBe('  ')

    fireEvent.change(textareaElement, { target: { value: 'Some description' } })
    fireEvent.click(submitButton)
    expect(addTaskSpy).not.toHaveBeenCalled()
    expect(textareaElement.value).toBe('Some description')

    fireEvent.change(inputElement, { target: { value: '' } })
    fireEvent.click(submitButton)
    expect(addTaskSpy).not.toHaveBeenCalled()
    expect(inputElement.value).toBe('')
    expect(textareaElement.value).toBe('Some description')
  })

  test('form submission can be triggered by pressing Enter, calls service addTask with title and description', () => {
    renderTaskForm()
    const inputElement = screen.getByPlaceholderText('Enter task title') as HTMLInputElement
    const textareaElement = screen.getByPlaceholderText('Enter task description (optional)') as HTMLTextAreaElement
    const formElement = inputElement.closest('form')
    expect(formElement).toBeInTheDocument()

    fireEvent.change(inputElement, { target: { value: 'Enter Key Task' } })
    fireEvent.change(textareaElement, { target: { value: 'Enter Key Description' } })
    fireEvent.submit(formElement!)

    expect(addTaskSpy).toHaveBeenCalledTimes(1)
    expect(addTaskSpy).toHaveBeenCalledWith('Enter Key Task', 'Enter Key Description')
    expect(inputElement.value).toBe('')
    expect(textareaElement.value).toBe('')
  })
})
