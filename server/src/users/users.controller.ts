import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { UsersService } from "./providers/users.service";

@Controller("api/users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Get(":id/timeline")
  async getTimeline(@Param("id") id: number) {
    return this.userService.getTimeline(+id);
  }

  @Post()
  create(@Body() body: { username: string; name: string }) {
    return this.userService.create(body.username, body.name);
  }

  @Post(":id/follow/:targetId")
  follow(@Param("id") id: string, @Param("targetId") targetId: string) {
    return this.userService.follow(+id, +targetId);
  }

  @Post(":id/unfollow/:targetId")
  unfollow(@Param("id") id: string, @Param("targetId") targetId: string) {
    return this.userService.unfollow(+id, +targetId);
  }
}
