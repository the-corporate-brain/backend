import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Answer } from '../entities/answer';
import { Question } from '../entities/question';
import { User } from '../entities/user';
import { Database } from '../lib/database';
import { failure, postSuccess } from '../lib/response-util';

const database = new Database();
let dbConn: Connection;

interface AnswerSubmission {
  answerType: string;
  answerId: number;
  answerText: string;
  questionId: number;
}

export async function submitAnswer(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;
  dbConn = await database.getConnection();
  const answerRepository = dbConn.getRepository(Answer);
  const questionRepository = dbConn.getRepository(Question);
  const userRepository = dbConn.getRepository(User);
  const submission: AnswerSubmission = JSON.parse(event.body);

  console.log(event.requestContext.authorizer);

  if (submission.answerType === 'idAnswer') {
    console.log(submission.answerId);
    const answer = await answerRepository.findOne(submission.answerId, { relations: ['question'] });
    if (answer.question.correctAnswer.id === submission.answerId) {
      // Question solved correctly

      const user = await userRepository.findOne(event.requestContext.authorizer.id, { relations: ['answeredQuestions'] });
      if (user.answeredQuestions.filter(item => item.id === answer.question.id).length < 1) {
        await dbConn
          .createQueryBuilder()
          .relation(User, 'answeredQuestions')
          .of(user)
          .add(answer.question.id);
      } else {
        return failure({
          message: `Question ${ answer.question.id } solved already!`,
          solved: true,
          wasSolved: true
        });
      }

      return postSuccess({
        message: `Question ${ answer.question.id } solved correctly!`,
        solved: true
      });
    } else {
      // Question solved incorrectly
      return failure({
        message: `Question ${ answer.question.id } solved incorrectly!`,
        solved: false
      });
    }
  } else if (submission.answerType === 'textAnswer') {
    console.log(submission.answerText);
    return failure({
      message: 'Not implemented!'
    });
  }
}
