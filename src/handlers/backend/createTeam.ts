import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Team } from '../../entities/team';
import { Unit } from '../../entities/unit';
import { User } from '../../entities/user';
import { Database } from '../../lib/database';
import { postSuccess } from '../../lib/response-util';

const database = new Database();
let dbConn: Connection;

interface NewTeam {
  name: string;
  units?: Unit[];
  users?: User[];
}

export async function createTeam(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const teamRepository = dbConn.getRepository(Team);
  const teamBody: NewTeam = JSON.parse(event.body);
  let result = await teamRepository.save(teamBody);

  return postSuccess({
    message: `Team ${ result.id } created!`,
    entity: result
  });
}
