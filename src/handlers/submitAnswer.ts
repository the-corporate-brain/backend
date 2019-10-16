import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Answer } from '../entities/answer';
import { Database } from '../lib/database';
import { success } from '../lib/response-util';

const database = new Database();
let dbConn: Connection;

export async function submitAnswer(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const answerRepository = dbConn.getRepository(Answer);

  return success({
    message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
    input: event,
  });
}
