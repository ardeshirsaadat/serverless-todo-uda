import { ToDoAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils';
import { TodoUpdate } from '../models/TodoUpdate';

//Implement businessLogic

const todosAcess = new ToDoAccess()
export const s3Access = new AttachmentUtils()

export async function getAllToDo(userId:string): Promise<TodoItem[]> {

    return await todosAcess.getAllToDos(userId)
}

export async function createToDo(
  createToDoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todosAcess.createToDo({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    name: createToDoRequest.name,
    dueDate: createToDoRequest.dueDate,
    done: false,
    attachmentUrl: s3Access.obtainS3AttachmentURL(todoId)
  })
}


export async function updateToDo(
    userId:string,
    todoId:string,
    updateToDoRequest:UpdateTodoRequest
    ) : Promise<any>{
      const todoUpdate:TodoUpdate = {
        name:updateToDoRequest.name,
        dueDate:updateToDoRequest.dueDate,
        done:updateToDoRequest.done
      }
      return await todosAcess.updateToDo(userId,todoId,todoUpdate)  
    }


export async function deleteToDo(
    userId:string,
    todoId:string,
    ){
        return await todosAcess.deleteTodo(userId,todoId)  
    }
           


