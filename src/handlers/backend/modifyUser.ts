import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { User } from '../../entities/user';
import { Database } from '../../lib/database';
import { postSuccess } from '../../lib/response-util';

const database = new Database();
let dbConn: Connection;

export async function modifyUser(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const repository = dbConn.getRepository(User);
  const body = JSON.parse(event.body);

  return postSuccess(body);
}
