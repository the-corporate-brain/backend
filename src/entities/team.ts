import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Unit } from './unit';
import { User } from './user';

@Entity('team')
export class Team {

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

  @ManyToMany(type=>Unit, unit=>unit.teams)
  @JoinTable()
  units: Unit[];

  @OneToMany(type=>User, user=>user.team, {
    cascade: true,
  })
  users: User[];

}
