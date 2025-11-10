import { Module } from '@nestjs/common';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { Produto } from './produto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Produto])],
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}
