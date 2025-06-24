import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { MurmursService } from "./providers/murmurs.service";

@Controller("api/murmurs")
export class MurmursController {
  constructor(private readonly murmurService: MurmursService) {}

  @Get()
  findAll(@Query("page") page = 1) {
    return this.murmurService.findAll(+page);
  }

  @Get("user/:userId")
  findByUser(@Param("userId") userId: string) {
    return this.murmurService.findByUser(+userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.murmurService.findOne(+id);
  }

  @Post()
  async create(@Body() body: { userId: number; text: string }) {
    return this.murmurService.create(body.userId, body.text);
  }

  @Delete(":id")
  delete(@Param("id") id: string, @Body() body: { userId: number }) {
    return this.murmurService.delete(+id, body.userId);
  }
}
