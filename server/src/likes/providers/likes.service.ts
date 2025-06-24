import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Murmur } from "../../murmurs/murmur.entity";
import { User } from "../../users/user.entity";

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Murmur) private murmurRepo: Repository<Murmur>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async likeMurmur(userId: number, murmurId: number) {
    const murmur = await this.murmurRepo.findOne({
      where: { id: murmurId },
      relations: ["likedBy"],
    });
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!murmur || !user)
      throw new NotFoundException("User or murmur not found");

    murmur.likedBy = [...new Set([...murmur.likedBy, user])];
    return this.murmurRepo.save(murmur);
  }

  async unlikeMurmur(userId: number, murmurId: number) {
    const murmur = await this.murmurRepo.findOne({
      where: { id: murmurId },
      relations: ["likedBy"],
    });

    if (!murmur) throw new NotFoundException("Murmur not found");

    murmur.likedBy = murmur.likedBy.filter((u) => u.id !== userId);
    return this.murmurRepo.save(murmur);
  }

  async getLikeCount(murmurId: number) {
    const murmur = await this.murmurRepo.findOne({
      where: { id: murmurId },
      relations: ["likedBy"],
    });

    if (!murmur) throw new NotFoundException("Murmur not found");
    return { likes: murmur.likedBy.length };
  }
}
