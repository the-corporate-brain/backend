import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Unit } from '../entities/unit';
import { Database } from '../lib/database';
import { notFound, success } from '../lib/response-util';

const database = new Database();
let dbConn: Connection;

export async function getAllUnits(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const unitRepository = dbConn.getRepository(Unit);

  const units = await unitRepository.find({ relations: ['teams', 'tasks', 'tasks.questions', 'tasks.tier'] });

  return units ? success(units) : notFound({ message: 'No Unit found' });
}


