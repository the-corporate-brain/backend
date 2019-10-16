import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task';
import { User } from './user';

@Entity('task_tier')
export class TaskTier {

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

  @OneToMany(type=>Task, task=>task.tier, {
    cascade: true,
  })
  tasks: Task[];

  @OneToMany(type=>User, user=>user.tier, {
    cascade: true,
  })
  users: User[];

}
