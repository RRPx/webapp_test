import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Murmur } from "../murmurs/murmur.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Murmur, (murmur) => murmur.user)
  murmurs: Murmur[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: "follows",
    joinColumn: { name: "followee_id" },
    inverseJoinColumn: { name: "follower_id" },
  })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];
}
