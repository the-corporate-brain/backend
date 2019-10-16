import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question';
import { TaskTier } from './task_tier';
import { Unit } from './unit';

@Entity('task')
export class Task {

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id'
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    name: 'name'
  })
  name: string;

  @ManyToOne(type=>TaskTier, tier=> tier.tasks)
  tier: TaskTier;

  @OneToMany(type=>Question, question => question.task, {
    cascade: true,
  })
  questions: Question[];

  @ManyToOne(type => Unit, unit=>unit.tasks)
  unit: Unit;

}

