import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Task } from '../../entities/task';
import { Database } from '../../lib/database';
import { postSuccess } from '../../lib/response-util';

const database = new Database();
let dbConn: Connection;

export async function modifyTask(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const repository = dbConn.getRepository(Task);
  const body = JSON.parse(event.body);

  return postSuccess(body);
}
