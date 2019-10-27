import { Context, CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import { Connection } from 'typeorm';
import { User } from '../entities/user';
import { Database } from '../lib/database';

function generatePolicy(principalId: string, effect: string, resource: string, context?: any): any {
  let authResponse: any = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    let policyDocument: any = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    let statementOne: any = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  if (context) {
    authResponse.context = context;
  }

  console.log(JSON.stringify(authResponse, null, 4));

  return authResponse;
}

const database = new Database();
let dbConn: Connection;

export async function authorize(event: CustomAuthorizerEvent, context: Context): Promise<CustomAuthorizerResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const userRepository = dbConn.getRepository(User);

  let userId = event.authorizationToken;
  console.log('User ID is', userId);
  let user = await userRepository.findOneOrFail(userId);
  if (user) {
    console.log('Found user');
    return generatePolicy(user.name, 'Allow', '*', user);
  } else {
    console.log('User with ID', userId, 'not found');
    context.fail('Unauthorized');
    // return generatePolicy('user', 'Deny', event.methodArn);
  }

}

