import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PessoaModule } from './pessoa/pessoa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from './produto/produto.module';

@Module({
  imports: [
    PessoaModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'ifsp',
      database: 'db_teste',
      // entities: [Usuario],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProdutoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
