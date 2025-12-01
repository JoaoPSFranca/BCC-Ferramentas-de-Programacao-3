import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './Constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Pega o token do cabeçalho (Barrer <token>)
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, // Aqui validamos o token recebido
    });
  }

  // Se o token for válido, o Nest roda essa função
  async validate(payload: any) {
    // O retorno daqui é injetado automaticamente no objeto 'request.user'
    return { userId: payload.sub, username: payload.username };
  }
}