import { Controller, Param, Post, Delete, Get, Body } from "@nestjs/common";
import { LikesService } from "./providers/likes.service";

@Controller("api/likes")
export class LikesController {
  constructor(private readonly likeService: LikesService) {}

  @Post()
  like(@Body() body: { userId: number; murmurId: number }) {
    return this.likeService.likeMurmur(body.userId, body.murmurId);
  }

  @Delete()
  unlike(@Body() body: { userId: number; murmurId: number }) {
    return this.likeService.unlikeMurmur(body.userId, body.murmurId);
  }

  @Get(":murmurId")
  getLikeCount(@Param("murmurId") murmurId: string) {
    return this.likeService.getLikeCount(+murmurId);
  }
}
