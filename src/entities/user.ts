import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question';
import { TaskTier } from './task_tier';
import { Team } from './team';

@Entity('user')
export class User {

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id'
  })
  id: number;

  @ManyToOne(type=>Team, team=>team.users)
  team: Team;

  @Column('varchar', {
    nullable: false,
    name: 'name'
  })
  name: string;


  @ManyToOne(type=>TaskTier, tier=>tier.users)
  tier: TaskTier;


  @ManyToMany(type=>Question, question=>question.solvedByUsers)
  answeredQuestions: Question[];

}
