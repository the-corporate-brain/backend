import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import 'reflect-metadata';
import 'source-map-support/register';
import { Connection } from 'typeorm';
import { Database } from './lib/database';
import { postSuccess, success } from './lib/response-util';

const database = new Database();
let dbConn: Connection;

export async function hello(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();

  console.log(JSON.stringify(event, null, 4));
  return success({
    message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
    input: event,
  });
}

export async function helloPost(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log(JSON.stringify(event, null, 4));

  return postSuccess({
    message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
    input: event,
  });
}
