import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Question } from '../entities/question';
import { Database } from '../lib/database';
import { notFound, success } from '../lib/response-util';

const database = new Database();
let dbConn: Connection;

export async function getQuestionDetails(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const questionRepository = dbConn.getRepository(Question);
  const { id } = event.pathParameters;

  const question = await questionRepository.findOne(id, { relations: ['answers', 'solvedByUsers', 'task'] });

  return question ? success(question) : notFound({ message: 'Question not found', id });
}
