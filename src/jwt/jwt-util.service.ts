import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtilService {
  constructor(private readonly jwtService: JwtService) {}

  getUserIdFromToken(token: string): number {
    const payload = this.jwtService.verify(token);
    return parseInt(payload.sub, 10);
  }
}
