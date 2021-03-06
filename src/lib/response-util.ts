import { APIGatewayProxyResult } from 'aws-lambda';

export function success(body:any): APIGatewayProxyResult {
  return buildResponse(200, body);
}

export function postSuccess(body:any): APIGatewayProxyResult {
  return buildResponse(201, body);
}

export function notFound(body: any): APIGatewayProxyResult {
  return buildResponse(404, body);
}
export function failure(body:any): APIGatewayProxyResult {
  return buildResponse(500, body);
}

function buildResponse(statusCode:number, body:any): APIGatewayProxyResult {
  console.log({
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  });
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
}
