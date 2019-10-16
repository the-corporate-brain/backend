import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question';

@Entity('answer')
export class Answer {

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id'
  })
  id: number;

  @ManyToOne(type=>Question, question => question.answers)
  question: Question;

  @Column('varchar', {
    name: 'answer_text'
  })
  answerText: string;

}
