import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Question } from '../../entities/question';
import { TaskTier } from '../../entities/task_tier';
import { Team } from '../../entities/team';
import { User } from '../../entities/user';
import { Database } from '../../lib/database';
import { postSuccess } from '../../lib/response-util';

const database = new Database();
let dbConn: Connection;

interface NewUser {
  name: string;
  team?: Team;
  tier?: TaskTier;
  answeredQuestions?: Question[];
}

export async function createUser(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const userRepository = dbConn.getRepository(User);
  const userBody: NewUser = JSON.parse(event.body);
  let result = await userRepository.save(userBody);

  return postSuccess({
    message: `User ${ result.id } created!`,
    entity: result
  });

}
