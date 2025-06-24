import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./users/user.entity";
import { UsersModule } from "./users/users.module";
import { MurmursModule } from "./murmurs/murmurs.module";
import { LikesModule } from "./likes/likes.module";
import { FollowModule } from "./follows/follows.module";
import { Murmur } from "./murmurs/murmur.entity";

@Module({
  imports: [
    UsersModule,
    MurmursModule,
    LikesModule,
    FollowModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "mysql",
        host: "127.0.0.1",
        port: 3306,
        username: "docker",
        password: "docker",
        database: "murmurs",
        entities: [User, Murmur],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
