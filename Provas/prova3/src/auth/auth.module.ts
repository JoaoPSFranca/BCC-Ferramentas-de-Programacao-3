import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './Constants';
import { ContaModule } from 'src/conta/conta.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ContaModule,
    PassportModule,
    JwtModule.register({ 
      global: true,
      secret: jwtConstants.secret, 
      signOptions: { expiresIn: '600s' }, // quanto tempo dura o token
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}