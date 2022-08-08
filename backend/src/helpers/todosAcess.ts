import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// Implement the dataLayer logic

export class ToDoAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todoTable = process.env.TODOS_TABLE) {
    }
  
    async getAllToDos(userId:string): Promise<TodoItem[]> {
        logger.info('GETTING ALL TODOs');

      const result = await this.docClient.query({
        TableName: this.todoTable,
        KeyConditionExpression: '#userId =:i',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':i': userId
        }
      }).promise();
  
      const items = result.Items
      return items as TodoItem[]
    }
  
    async createToDo(todo: TodoItem): Promise<TodoItem> {
        logger.info('CREATING A TODO');
      await this.docClient.put({
        TableName: this.todoTable,
        Item: {...todo}
      }).promise()
  
      return todo
    }

    async updateToDo(userId: string, todoId: string, updatedTodo: TodoUpdate) {
        logger.info('UPDATING A TODO');
        const updtedTodo = await this.docClient.update({
            TableName: this.todoTable,
            Key: { userId, todoId },
            ExpressionAttributeNames: { "#N": "name" },
            UpdateExpression: "set #N=:todoName, dueDate=:dueDate, done=:done",
            ExpressionAttributeValues: {
              ":todoName": updatedTodo.name,
              ":dueDate": updatedTodo.dueDate,
              ":done": updatedTodo.done
          },
          ReturnValues: "UPDATED_NEW"
        })
        .promise();
      return { Updated: updtedTodo };
    }

    async deleteTodo(todoId: string, userId: string) {
        logger.info('DELETING A TODO');
    
        await this.docClient.delete({
          TableName: this.todoTable,
          Key: {
            userId: userId,
            todoId: todoId
          }
        }).promise();
    
        
      }



  }
  
  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
  