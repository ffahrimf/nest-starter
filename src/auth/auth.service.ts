import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly UserRepository: EntityRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(userID: number): Promise<string> {
    const payload = { sub: userID };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h',
    });
  }

  async generateRefreshToken(userID: number) {
    const payload = { sub: userID };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30d',
    });
  }

  async login(dto: LoginDto): Promise<any> {
    const { key, password } = dto;
    const userUsername = await this.em.findOne(
      User,
      { username: key },
      { populate: ['role'] },
    );
    const userEmail = await this.em.findOne(
      User,
      { email: key },
      { populate: ['role'] },
    );
    if (!userEmail && !userUsername) {
      throw new BadRequestException('Username/Email dan password tidak sesuai');
    }
    const user = userUsername == null ? userEmail : userUsername;
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Username/Email dan password tidak sesuai');
    }
    return {
      payload: user,
      token: await this.generateToken(user.id),
      refresh_token: await this.generateRefreshToken(user.id),
    };
  }
}
