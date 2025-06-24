import { Controller, Post, Delete, Get, Body, Param } from "@nestjs/common";
import { FollowsService } from "./providers/follows.service";

@Controller("api/follow")
export class FollowsController {
  constructor(private readonly followService: FollowsService) {}

  @Post()
  follow(@Body() body: { followerId: number; followeeId: number }) {
    return this.followService.followUser(body.followerId, body.followeeId);
  }

  @Delete()
  unfollow(@Body() body: { followerId: number; followeeId: number }) {
    return this.followService.unfollowUser(body.followerId, body.followeeId);
  }

  @Get(":userId/followers")
  getFollowers(@Param("userId") userId: string) {
    return this.followService.getFollowers(+userId);
  }

  @Get(":userId/following")
  getFollowing(@Param("userId") userId: string) {
    return this.followService.getFollowing(+userId);
  }
}
