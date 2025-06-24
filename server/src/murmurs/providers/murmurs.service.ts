import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Murmur } from "../murmur.entity";
import { User } from "../../users/user.entity";

@Injectable()
export class MurmursService {
  constructor(
    @InjectRepository(Murmur)
    private readonly murmurRepo: Repository<Murmur>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async create(userId: number, text: string): Promise<Murmur> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("User not found");

    const murmur = this.murmurRepo.create({ text, user });
    return this.murmurRepo.save(murmur);
  }

  async findAll(page = 1, limit = 100) {
    return this.murmurRepo.find({
      relations: ["user", "likedBy"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByUser(userId: number) {
    return this.murmurRepo.find({
      where: { user: { id: userId } },
      relations: ["user", "likedBy"],
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number) {
    const murmur = await this.murmurRepo.findOne({
      where: { id },
      relations: ["user", "likedBy"],
    });
    if (!murmur) throw new NotFoundException("Murmur not found");
    return murmur;
  }

  async delete(id: number, userId: number) {
    const murmur = await this.murmurRepo.findOne({
      where: { id },
      relations: ["user"],
    });
    if (!murmur) throw new NotFoundException("Murmur not found");
    if (murmur.user.id !== userId)
      throw new ForbiddenException("Not your murmur");

    await this.murmurRepo.remove(murmur);
    return { message: "Deleted" };
  }
}
