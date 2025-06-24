import { Module } from "@nestjs/common";
import { FollowsService } from "./providers/follows.service";
import { FollowsController } from "./follows.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [FollowsService],
  controllers: [FollowsController],
})
export class FollowModule {}
