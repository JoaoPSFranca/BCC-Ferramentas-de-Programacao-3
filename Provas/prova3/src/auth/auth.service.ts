import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ContaService } from 'src/conta/conta.service';

@Injectable()
export class AuthService {
  constructor(
    private contaService: ContaService,
    private jwtService: JwtService
  ) {}

  async login( email: string, pass: string): Promise<{ access_token: string }> {
    const acc = await this.contaService.login(email, pass);
    if (!acc) { throw new UnauthorizedException(); }
    
    const payload = { sub: acc.id, name: acc.nome };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}