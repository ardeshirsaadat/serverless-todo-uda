import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'


import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { TodoUpdate } from '../../models/TodoUpdate'
import { updateToDo } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    //Update a TODO item with the provided id using values in the "updatedTodo" object
    const userId = getUserId(event)
    const newUpdatedTodo:TodoUpdate = await updateToDo(userId,todoId,updatedTodo)

    return {
      statusCode:200,
      body:JSON.stringify(newUpdatedTodo)
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
