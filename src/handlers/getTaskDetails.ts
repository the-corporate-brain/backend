import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Task } from '../entities/task';
import { Database } from '../lib/database';
import { notFound, success } from '../lib/response-util';

const database = new Database();
let dbConn: Connection;

export async function getTaskDetails(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const taskRepository = dbConn.getRepository(Task);
  const { id } = event.pathParameters;

  const task = await taskRepository.findOne(id, { relations: ['tier', 'questions', 'questions.answers', 'questions.solvedByUsers', 'unit'] });

  return task ? success(task) : notFound({ message: 'Task not found', id });
}
