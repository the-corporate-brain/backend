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

  let answerArray = [];
  let questionArray = [];
  let unitArray = [];
  let taskArray = [];

  const tier = new TaskTier();
  tier.name = 'Bronze';
  await tierRepository.save(tier);

  for (let i = 1; i < 11; i++) {
    const answer = new Answer();
    answer.answerText = `Bla ${ i }`;
    await answerRepository.save(answer);

    const answer2 = new Answer();
    answer2.answerText = `Blubb ${ i }`;
    await answerRepository.save(answer2);
    answerArray.push(answer, answer2);

    const question = new Question();
    question.answers = [answer, answer2];
    question.questionText = `BLA oder Blubb ${ i }`;
    question.correctAnswer = answer;
    await questionRepository.save(question);
    questionArray.push(question);

    const answer3 = new Answer();
    answer3.answerText = `Blobb ${ i }`;
    await answerRepository.save(answer3);

    const answer4 = new Answer();
    answer4.answerText = `Blibb ${ i }`;
    await answerRepository.save(answer4);
    answerArray.push(answer3, answer4);

    const question2 = new Question();
    question2.answers = [answer3, answer4];
    question2.questionText = `Blobb oder Blibb ${ i }`;
    question2.correctAnswer = answer3;
    await questionRepository.save(question2);
    questionArray.push(question2);

    const unit = new Unit();
    unit.name = `UNIT ${ i }`;
    await unitRepository.save(unit);
    unitArray.push(unit);

    const task = new Task();
    task.unit = unit;
    task.questions = [question, question2];
    task.tier = tier;
    task.name = `Task ${ i }`;
    await taskRepository.save(task);
    taskArray.push(task);
  }

  const user = new User();
  user.name = 'Lukas';
  user.answeredQuestions = questionArray;
  user.tier = tier;
  console.log(await userRepository.save(user));


  const team = new Team();
  team.name = 'Team 1';
  team.users = [user];
  team.units = unitArray;
  await teamRepository.save(team);

  await dbConn.close();

  return success({ success: true });
}

async function cleanEntities(db: Connection) {
  try {

    for (const { name, tableName } of db.entityMetadatas) {

      const repository = await db.getRepository(name);
      await repository.query('SET FOREIGN_KEY_CHECKS=0');
      await repository.query(`DELETE FROM ${ tableName };`);
      await repository.query(`ALTER TABLE ${ tableName } auto_increment = 1;`);
      await repository.query('SET FOREIGN_KEY_CHECKS=1');
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${ error }`);
  }

  return;
}

