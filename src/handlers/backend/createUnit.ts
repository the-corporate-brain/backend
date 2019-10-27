import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Task } from '../../entities/task';
import { Team } from '../../entities/team';
import { Unit } from '../../entities/unit';
import { Database } from '../../lib/database';
import { postSuccess } from '../../lib/response-util';

const database = new Database();
let dbConn: Connection;

interface NewUnit {
  name: string;
  teams?: Team[];
  tasks?: Task[];
}

export async function createUnit(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const unitRepository = dbConn.getRepository(Unit);
  const unitBody: NewUnit = JSON.parse(event.body);
  let result = await unitRepository.save(unitBody);

  return postSuccess({
    message: `Unit ${ result.id } created!`,
    entity: result
  });

}
