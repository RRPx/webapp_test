import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Murmur } from "./murmur.entity";
import { MurmursService } from "./providers/murmurs.service";
import { MurmursController } from "./murmurs.controller";
import { User } from "../users/user.entity";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Murmur, User])],
  providers: [MurmursService],
  controllers: [MurmursController],
})
export class MurmursModule {}
