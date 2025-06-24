import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../users/user.entity";

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async followUser(followerId: number, followeeId: number) {
    if (followerId === followeeId) throw new Error("Can't follow yourself");

    const follower = await this.userRepo.findOne({
      where: { id: followerId },
      relations: ["following"],
    });
    const followee = await this.userRepo.findOneBy({ id: followeeId });

    if (!follower || !followee) throw new NotFoundException("User not found");

    follower.following = [...new Set([...follower.following, followee])];
    return this.userRepo.save(follower);
  }

  async unfollowUser(followerId: number, followeeId: number) {
    const follower = await this.userRepo.findOne({
      where: { id: followerId },
      relations: ["following"],
    });

    if (!follower) throw new NotFoundException("User not found");

    follower.following = follower.following.filter((u) => u.id !== followeeId);
    return this.userRepo.save(follower);
  }

  async getFollowers(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["followers"],
    });

    if (!user) throw new NotFoundException("User not found");

    return user.followers;
  }

  async getFollowing(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["following"],
    });

    if (!user) throw new NotFoundException("User not found");

    return user.following;
  }
}
