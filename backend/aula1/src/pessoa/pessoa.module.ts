import { Module } from '@nestjs/common';
import { PessoaController } from './pessoa.controller';

@Module({
  controllers: [PessoaController],
})
export class PessoaModule {}
