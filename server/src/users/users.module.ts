import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersService } from "./providers/users.service";
import { UsersController } from "./users.controller";
import { Murmur } from "../murmurs/murmur.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Murmur])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // for use in other modules later
})
export class UsersModule {}
