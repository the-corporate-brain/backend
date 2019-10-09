import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { postSuccess, success } from './response-util';

export async function hello (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log(JSON.stringify(event, null, 4));
  return success({
    message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
    input: event,
  });
}

export async function helloPost (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log(JSON.stringify(event, null, 4));

  return postSuccess({
    message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
    input: event,
  });
}
