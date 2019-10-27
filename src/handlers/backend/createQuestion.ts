import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Answer } from '../../entities/answer';
import { Question } from '../../entities/question';
import { Database } from '../../lib/database';
import { postSuccess } from '../../lib/response-util';

const database = new Database();
let dbConn: Connection;

interface NewQuestion {
  correctAnswerIndex: number;
  questionText: string;
  answers: Answer[];
  taskId: number;
}

export async function createQuestion(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const questionRepository = dbConn.getRepository(Question);
  const questionBody: NewQuestion = JSON.parse(event.body);

  let question = new Question();
  question = Object.assign(question, questionBody);

  let result = await questionRepository.save(question);
  await questionRepository.update(result.id, { correctAnswer: result.answers[questionBody.correctAnswerIndex] });
  result = await questionRepository.findOneOrFail(result.id);

  /*await dbConn
    .createQueryBuilder()
    .relation(Question, 'correctAnswer')
    .of(question)
    .add(result.answers[questionBody.correctAnswerIndex].id);*/

  return postSuccess({
    message: `Question ${ result.id } created!`,
    entity: result
  });
}
