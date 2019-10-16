import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './answer';
import { Task } from './task';
import { User } from './user';

@Entity('question')
export class Question {

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id'
  })
  id: number;

  @OneToOne(type=>Answer)
  @JoinColumn()
  correctAnswer: Answer;

  @Column('varchar', {
    name: 'question_text'
  })
  questionText: string;

  @OneToMany(type=>Answer, answer => answer.question, {
    cascade: true,
  })
  answers: Answer[];

  @ManyToMany(type=>User, user=>user.answeredQuestions, {
    cascade: true,
  })
  @JoinTable()
  solvedByUsers: User[];

  @ManyToOne(type=>Task, task => task.questions)
  task: Task;

}


