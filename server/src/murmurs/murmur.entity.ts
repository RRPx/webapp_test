import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Murmur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 280 })
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.murmurs, { onDelete: "CASCADE" })
  user: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: "likes",
    joinColumn: { name: "murmur_id" },
    inverseJoinColumn: { name: "user_id" },
  })
  likedBy: User[];
}
