import { Module } from '@nestjs/common';
import { ContaController } from './conta.controller';
import { ContaService } from './conta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conta } from './entities/conta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conta])
  ],
  controllers: [ContaController],
  exports: [ContaService],
  providers: [ContaService]
})
export class ContaModule {}
