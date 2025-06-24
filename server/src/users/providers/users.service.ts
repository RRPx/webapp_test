import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { User } from "../user.entity";
import { Murmur } from "../../murmurs/murmur.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Murmur)
    private readonly murmurRepo: Repository<Murmur>
  ) {}

  findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ["followers", "following"],
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async create(username: string, name: string) {
    const user = this.userRepo.create({ username, name });
    return await this.userRepo.save(user);
  }

  async follow(followerId: number, followeeId: number) {
    if (followerId === followeeId) throw new Error("Cannot follow yourself");

    const follower = await this.userRepo.findOne({
      where: { id: followerId },
      relations: ["following"],
    });
    const followee = await this.userRepo.findOneBy({ id: followeeId });

    if (!follower || !followee) throw new NotFoundException("User not found");

    if (!follower.following.some((u) => u.id === followeeId)) {
      follower.following.push(followee);
      await this.userRepo.save(follower);
    }

    return { message: "Followed" };
  }

  async unfollow(followerId: number, followeeId: number) {
    const follower = await this.userRepo.findOne({
      where: { id: followerId },
      relations: ["following"],
    });
    if (!follower) throw new NotFoundException("User not found");

    follower.following = follower.following.filter((u) => u.id !== followeeId);
    await this.userRepo.save(follower);
    return { message: "Unfollowed" };
  }

  async getTimeline(userId: number): Promise<Murmur[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["following"],
    });

    const followeeIds = user.following.map((u) => u.id);

    return this.murmurRepo.find({
      where: [
        { user: { id: In(followeeIds) } },
        { user: { id: userId } }, // Include self
      ],
      relations: ["user", "likedBy"],
      order: { createdAt: "DESC" },
      take: 100,
    });
  }
}
