import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Answer } from '../entities/answer';
import { Question } from '../entities/question';
import { Task } from '../entities/task';
import { TaskTier } from '../entities/task_tier';
import { Team } from '../entities/team';
import { Unit } from '../entities/unit';
import { User } from '../entities/user';
import { Database } from '../lib/database';
import { success } from '../lib/response-util';

const database = new Database();
let dbConn: Connection;

export async function seedDatabase(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();

  await cleanEntities(dbConn);
  await dbConn.synchronize();
  const questionRepository = dbConn.getRepository(Question);
  const answerRepository = dbConn.getRepository(Answer);
  const taskRepository = dbConn.getRepository(Task);
  const unitRepository = dbConn.getRepository(Unit);
  const userRepository = dbConn.getRepository(User);
  const teamRepository = dbConn.getRepository(Team);
  const tierRepository = dbConn.getRepository(TaskTier);

  const answer = new Answer();
  answer.answerText = 'BLA';
  await answerRepository.save(answer);

  const answer2 = new Answer();
  answer2.answerText = 'BLUBB';
  await answerRepository.save(answer2);

  const question = new Question();
  question.answers = [answer, answer2];
  question.questionText = 'BLA oder Blubb?';
  question.correctAnswer = answer;
  await questionRepository.save(question);

  const tier = new TaskTier();
  tier.name = 'Bronze';
  await tierRepository.save(tier);

  const user = new User();
  user.name = 'Lukas';
  user.answeredQuestions = [question];
  user.tier = tier;
  await userRepository.save(user);

  const unit = new Unit();
  unit.name = 'UNIT1: Chars';
  await unitRepository.save(unit);

  const task = new Task();
  task.unit = unit;
  task.questions = [question];
  task.tier = tier;
  task.name = 'Initialisierung von Chars';
  await taskRepository.save(task);

  const team = new Team();
  team.name = 'Team 1';
  team.users = [user];
  team.units = [unit];
  await teamRepository.save(team);

  await dbConn.close();

  return success({ success: true });
}

async function cleanEntities(db: Connection) {
  try {
    // noinspection ES6RedundantAwait

    for (const { name, tableName } of db.entityMetadatas) {

      const repository = await db.getRepository(name);
      await repository.query(`DELETE FROM ${ tableName };`);
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${ error }`);
  }

  return;
}

