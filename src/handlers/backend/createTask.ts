import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Question } from '../../entities/question';
import { Task } from '../../entities/task';
import { TaskTier } from '../../entities/task_tier';
import { Unit } from '../../entities/unit';
import { Database } from '../../lib/database';
import { postSuccess } from '../../lib/response-util';

const database = new Database();
let dbConn: Connection;

interface NewTask {
  name: string;
  tierId: number;
  questions?: Question[];
  unitId: number;
}

export async function createTask(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const taskRepository = dbConn.getRepository(Task);
  const taskBody: NewTask = JSON.parse(event.body);

  const tierRepository = dbConn.getRepository(TaskTier);
  const unitRepository = dbConn.getRepository(Unit);

  let task = new Task();
  task.name = taskBody.name;
  task.tier = await tierRepository.findOneOrFail(taskBody.tierId);
  task.questions = taskBody.questions;
  task.unit = await unitRepository.findOneOrFail(taskBody.unitId);

  let result = await taskRepository.save(task);

  return postSuccess({
    message: `Task ${ result.id } created!`,
    entity: result
  });

}
