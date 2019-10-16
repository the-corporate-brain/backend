import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task';
import { Team } from './team';

@Entity('unit')
export class Unit {

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

  @ManyToMany(type=>Team, team=>team.units)
  teams: Team[];

  @OneToMany(type=>Task, task=>task.unit, {
    cascade: true,
  })
  tasks: Task[];

}

