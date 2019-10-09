import { APIGatewayProxyResult } from 'aws-lambda';

export function success(body:any): APIGatewayProxyResult {
  return buildResponse(200, body);
}

export function postSuccess(body:any): APIGatewayProxyResult {
  return buildResponse(201, body);
}

export function failure(body:any): APIGatewayProxyResult {
  return buildResponse(500, body);
}

function buildResponse(statusCode:number, body:any): APIGatewayProxyResult {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
}
