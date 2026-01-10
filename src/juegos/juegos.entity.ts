import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('Juegos')
export class Juego {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'Id' })
  Id: number;

  @Field()
  @Column({ name: 'Nombre', unique: true })
  Nombre: string;

  @Field()
  @Column({ name: 'Tamano', type: 'real' })
  Tamano: number;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'AnnoAct', type: 'integer', nullable: true })
  AnnoAct: number;

  @Field({ nullable: true })
  @Column({ name: 'Portada', type: 'text', nullable: true })
  Portada: string;

  @Field({ nullable: true })
  @Column({ name: 'Sinopsis', type: 'text', nullable: true })
  Sinopsis: string;
}