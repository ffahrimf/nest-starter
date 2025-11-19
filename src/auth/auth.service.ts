import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
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
    private readonly userRepository: EntityRepository<User>,
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
    const payload = { sub: userID, type: 'refresh' };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });
  }

  async verifyRefreshToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }
      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async login(dto: LoginDto): Promise<any> {
    const { key, password } = dto;

    const user = await this.userRepository.findOne(
      { $or: [{ username: key }, { email: key }] },
      { populate: ['role'] },
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException(
        'Username/Email atau password tidak sesuai',
      );
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(user.id),
      this.generateRefreshToken(user.id),
    ]);

    return { payload: user, token: accessToken, refresh_token: refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    const tokenPayload = await this.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findOne({ id: tokenPayload.sub });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.generateToken(user.id),
      this.generateRefreshToken(user.id),
    ]);

    return { token: newAccessToken, refresh_token: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    try {
      await this.verifyRefreshToken(refreshToken);
    } catch (error) {}
    return { message: 'Logout successful' };
  }
}
