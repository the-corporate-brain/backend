import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Unit } from '../entities/unit';
import { Database } from '../lib/database';
import { notFound, success } from '../lib/response-util';

const database = new Database();
let dbConn: Connection;

export async function getUnitDetails(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const unitRepository = dbConn.getRepository(Unit);
  const { id } = event.pathParameters;

  const unit = await unitRepository.findOne(id, { relations: ['teams', 'tasks'] });

  return unit ? success(unit) : notFound({ message: 'Unit not found', id });
}


