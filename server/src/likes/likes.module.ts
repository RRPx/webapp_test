import { Module } from "@nestjs/common";
import { LikesService } from "./providers/likes.service";
import { LikesController } from "./likes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Murmur } from "../murmurs/murmur.entity";
import { User } from "../users/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Murmur])],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
