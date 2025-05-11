import { Container } from 'inversify'
import { TOKENS } from './tokens'
import { ITaskService, TaskService } from '../services/task.service'

const container = new Container()

container.bind<ITaskService>(TOKENS.TaskService).to(TaskService).inSingletonScope()

export { container }
