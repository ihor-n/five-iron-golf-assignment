import { renderHook } from '@testing-library/react'
import { useTasks } from './useTasks'

describe('useTasks Hook', () => {
  it('should throw an error if used outside of a TaskServiceProvider', () => {
    const originalConsoleError = console.error
    console.error = jest.fn()

    expect(() => {
      renderHook(() => useTasks())
    }).toThrow('useTasks must be used within a TaskServiceProvider')

    console.error = originalConsoleError
  })
})
