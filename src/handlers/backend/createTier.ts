import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Task } from '../../entities/task';
import { TaskTier } from '../../entities/task_tier';
import { User } from '../../entities/user';
import { Database } from '../../lib/database';
import { postSuccess } from '../../lib/response-util';

const database = new Database();
let dbConn: Connection;

interface NewTier {
  name: string;
  tasks?: Task[];
  users?: User[];
}

export async function createTier(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const tierRepository = dbConn.getRepository(TaskTier);
  const tierBody: NewTier = JSON.parse(event.body);
  let result = await tierRepository.save(tierBody);

  return postSuccess({
    message: `Tier ${ result.id } created!`,
    entity: result
  });

}
