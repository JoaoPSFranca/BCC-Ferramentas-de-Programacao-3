# Backend
Estudos relacionados ao backend no geral e como fazer as coisas.

## Sumário

1. [Introdução](#1-introdução)
   - 1.1. [Comandos básicos](#11-comandos-básicos)
   - 1.2. [Configuração de Ambiente (.env)](#12-configuração-de-ambiente-env)
2. [Controller](#2-controller)
   - 2.1. [GET](#21-get)
   - 2.2. [POST](#22-post)
   - 2.3. [Parâmetros da Requisição](#23-parâmetros-da-requisição)
     - 2.3.1. [Body](#231-body)
     - 2.3.2. [Param](#232-param)
     - 2.3.3. [Query](#233-query)
3. [Services](#3-services)
   - 3.1. [Injeção de Dependência](#31-injeção-de-dependência)
   - 3.2. [Funcionamento](#32-funcionamento)
4. [TypeORM](#4-typeorm)
   - 4.1. [Instalação](#41-instalação)
   - 4.2. [Decorators](#42-decorators)
   - 4.3. [Aplicação](#43-aplicação)
   - 4.4. [Enum](#44-enum)
   - 4.5. [Relacionamentos](#45-relacionamentos)
     - 4.5.1. [ManyToOne](#451-manytoone)
     - 4.5.2. [OneToMany](#452-onetomany)
     - 4.5.3. [OneToOne](#453-onetoone)
     - 4.5.4. [ManyToMany](#454-manytomany)
     - 4.5.5. [Carregamento de Relacionamentos](#455-carregamento-de-relacionamentos)
     - 4.5.6. [Operações em Cascata](#456-operações-em-cascata)
5. [Class Validators e Transformers](#5-class-validators-e-transformers)
   - 5.1. [Data Transfer Objects (DTOs)](#51-data-transfer-objects-dtos)
   - 5.2. [Pipes Nativos do NestJS](#52-pipes-nativos-do-nestjs)
6. [Autentificação JWT](#6-autentificação-jwt)
   - 6.1. [Instalação](#61-instalação)
   - 6.2. [Gerando os Tokens](#62-gerando-os-tokens)
   - 6.3. [Guards Personalizados](#63-guards-personalizados)
7. [Exception Filters](#7-exception-filters)
   - 7.1. [Status HTTP Personalizados](#71-status-http-personalizados)
8. [Middlewares](#8-middlewares)

## 1. Introdução

Para começar, precisa instalar o nest: 

```bash
sudo npm i -g @nestjs/cli
```

E criar um projeto: 

```bash
nest new project-name
```

Selecione a opção `npm`. </br> 

Caso já tenha um projeto, você pode entrar na pasta do projeto e usar o comando para instalar o node_modules novamente:

```bash
sudo npm i
```
> Pode ser utilizado o `sudo npm install` caso não de certo a versão contraída.

Para rodar o projeto basta utilizar o comando: 

```bash
npm run start:dev
```

> O `:dev` faz com que o projeto seja atualizado constantemente a cada alteração, sem ele, cada vez que alterasse algo teria que rodar o programa de novo com o `npm run start`.

O local de execução padrão é o `http://localhost:3000/`.

### 1.1. Comandos básicos

```bash
# cria um modulo
nest g mo model-name

# cria um controller (criar um modulo antes para linkar automaticamente)
nest g co model-name 

# cria um service (mesma logica do controller) 
nest g s model-name

# cria um guard 
nest g gu auth
```

### 1.2. Configuração de Ambiente (.env)

Para modularizar melhor o projeto, podemos criar um arquivo para armazenar as informações do banco e evitar de ter elas expostas. Para isso, podemos começar instalando os pacotes que faram isso.

```bash
npm install @nestjs/config
```

Após isso, podemos criar um arquivo `.env` na raiz do projeto com a estrutura:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=ifsp
DB_DATABASE=db_teste
```

Agora, podemos ir ao `app.module.ts` e alterar:

```TypeScript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // adiciona os imports

@Module({
  imports: [
    ConfigModule.forRoot({ // Adiciona o modulo das configuracoes
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // altera as infos para o configModule
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'), // faz as mesmas coisas aqui e nos outros
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## 2. Controller

O controller possui uma estrutura parecida com isso:

```TypeScript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

Nele vemos o `@Controller()` que será o responsável para determinar a rota principal do controller. Ele vazio indica a rota padrão, no caso `http://localhost:3000/`. Assim, se tivermos um `@Controller('pessoa')` ele indicará a rota `http://localhost:3000/pessoa`. </br> 

É válido ressaltar que o último `/`não é contado, então a rota `http://localhost:3000/pessoa` e a `http://localhost:3000/pessoa/` são consideradas as mesmas. </br>

### 2.1. GET

Há também o `@Get()` que faz uma requisição HTTP `GET` para o local que ele está apontando. Nesse caso, ele está vazio, então seria para a rota padrão. Ao receber a requisição `GET` naquela rota, ele irá executar o comando logo abaixo, nesse caso, o `getHello()` que irá retornar uma string para a tela. </br> 

Importante lembrar que o `@Get()` guarda o caminho definido no `@Controller()`, ou seja, se houver um `@Controller('pessoa')` e um `@Get('todas')`, ele vai pegar a rota `http://localhost:3000/pessoa/todas`. </br>

### 2.2. POST

Além disso, existe a requisição HTTP `POST`. Enquanto o `GET` solicita valores, a requeisição `POST` envia valores para serem salvos. Sendo geralmente utilizado para cadastros em uma base de dados. Sua utilização ocorre da seguinte forma: 

```TypeScript
@Post()
create(): string {
  return 'Criando uma nova pessoa';
}
```

### 2.3. Parâmetros da Requisição

Dentro de uma requisição, existem alguns parâmetros que podem ser adicionados para coletar dados específicos. Entre eles, temos o `@Body`, o `@Param` e o `@Query`.

### 2.3.1. Body

Em resumo, o `@Body`, serve para pegar os dados que estão dentro da requisição. Geralmente ele vem no "corpo" da requisição em um json. Normalmente é utilizado para receber objetos inteiros. Exemplo de uso:

```TypeScript
@Post()
create(@Body() dados: any) {
  // Se o cliente enviou JSON: { "nome": "Jota", "idade": 17 }
  return `Criando uma pessoa: ${dados.nome}`;
}
```

### 2.3.2. Param

Enquanto o `@Body` é recebido dentro da requisição, o `@Param` é recebido na própria URL (definido por um `:`), sendo geralmente utilizado para pegar informações específicas. Então se temos uma URL `http://localhost:3000/pessoa/50`, podemos utilizar o código:

```TypeScript
@Get(':id')
findOne(@Param('id') id: string) {
  return `Procurando uma pessoa com ID número: ${id}`;
}
```

Preste bastante atenção ao usar isso, pois se eu tiver um código assim:

```TypeScript
@Get(':id')
findOne(@Param('id') id: string) {
  return `Procurando uma pessoa com ID número: ${id}`;
}

@Get('todas')
getAll(): string {
  return 'Pegando todas as pessoas. ';
}
```

Ele nunca vai chegar na função `getAll`, pois tudo o que ele ver após o `/`, será interpretado como `id`. O ideal é fazer todas as funções e deixar as funções com `@Param` por último no código. Já que ele faz a verificação uma por uma na ordem que está definida. 

```TypeScript
@Get('todas')
getAll(): string {
  return 'Pegando todas as pessoas. ';
}

@Get(':id')
findOne(@Param('id') id: string) {
  return `Procurando uma pessoa com ID número: ${id}`;
}
```

Tendo o código assim, ele irá verificar se é o `http://localhost:3000/pessoa/todas` e se não for, ele trata como `id`.

### 2.3.3. Query

O `@Query` assim como o `@Param` fica na URL, porém, ele só aparece no fim após uma interrogação (`?`). Ele normalmente é utilizado para fazer filtro. Então por exemplo, podemos ter um `http://localhost:3000/pessoa/todas?nome=jo` que irá pegar todas as pessoas que tenham "jo" no nome. O código ficaria assim: 

```Typescript
@Get()
findAll(@Query('nome') nome: string) {
  return `Filtrando nomes que tenham: ${nome}`;
}
```

## 3. Services

Como já vimos, o `controller` é quem gerencia as rotas e chama as devidas funções. Para isso funcionar, temos o `service` que vai definir essas funçõs que serão utilizadas pelo controller. </br>

Para começar, os `services` possuem sua própria tag de início, o `@Injectable()` (assim como o `@Controller()`), porém, não possuem parâmetro. Além disso, eles possuem também um nome prórpio `model-name.service.ts`. </br>

### 3.1. Injeção de Dependência

O NestJS usa injeção de dependência para gerenciar as instâncias das classes. Isso significa que você não precisa criar objetos manualmente com `new`.

**Como funciona:**
1. Você declara o service no array `providers` do módulo
2. O NestJS cria automaticamente a instância
3. Você injeta no constructor onde precisar

```TypeScript
// O NestJS cuida de criar a instância de CategoriaService
constructor(private categoriaService: CategoriaService) {}
```

**Importante:** Services marcados com `@Injectable()` podem ser injetados em outros lugares.

### 3.2. Funcionamento

Para facilitar as coisas, no constructor, podemos usar o `@InjectRepository()` na definição de uma variável para utilizar o repository. Como parâmetro, você deve passar a classe para que você está criando o `service`, por exemplo, em um `service` de `categoria`, ficaria assim: 

```TypeScript
@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>,
    ) {}
}
```

Para realizar funções de escrita (salvar/cadastrar dados), podemos adicionar um método para isso usando o `repository.save(objeto)`.

```TypeScript
public inserir(categoria: Partial<Categoria>) {
    return this.categoriaRepository.save(categoria);
}
```

> É importante sempre colocar um `Partial<objeto>`, pois em vários casos vamosa salvar objetos incompletos, por exemplo sem id (que será gerado), sem data de exclusão, etc. O banco validará depois se podem ou não ser `NULL` os valores não passados.

Podemos utilizar funções para pegar as categorias salvas com o `repository.find()`. E podemos ainda selecionar quais dados serão retornados e quais não serão utilizando o `select: {}` e outras opções do `mysql` como o `order` (para ordenar), o `where` (para filtrar) e assim por diante.

```TypeScript
public buscarPeloId(id: string) {
    return this.categoriaRepository.find({ 
        select: { // faz retornar apenas o id e o nome da categoria
          id: true,
          nome: true,
          produtos: {
            nome: true
          }
        },
        relations: {
          produtos: true
        },
        where: {
          id
        }
    });
}
```

Neste trecho, encontramos outra coisa interessante, o uso do `relations`. Ele garante que o produto (que está incluso na tabela de categoria) terá seus atributos retornados e então no `select` abrimos outras chaves para definir que apenas os nomes dos produtos serão retornados. </br>

Existem outras alternativas, como o `repository.findOne()` que retorna apenas o primeiro registro da busca, o `repository.findBy()` que você pode passar um parâmetro para ele filtrar e o `repository.findOneBy()` que filtra a pesquisa e retorna apenas o primeiro. Ao utilizar o `findBy` ou o `findOneBy`, não há necessidade do `where`. 

```TypeScript
import { Repository, Like } from 'typeorm';

public buscarPeloNome(nome: string) {
  return this.categoriaRepository.find({
    where: {
      nome: Like(`%${nome}%`),
    },
  });
}
```

Além disso, é possível utilizar algumas outras funções, como o `Like` para filtrar, porém em casos assim, é importante lembrar de importar a função. 

```TypeScript
constructor(private categoriaService: CategoriaService) {}

@Post()
create(@Body() categoria: Categoria) {
  console.log(categoria);

  return this.categoriaService.inserir(categoria);
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.categoriaService.buscarPeloId(id);
}
```

Assim, para utilizar o `service` no `controller`, devemos primeiro inicializar ele no `constructor`, em seguida, basta utilizar normalmente dentro das funções.

## 4. TypeORM

O TypeORM funciona basicamente como um recurso para facilitação no gerenciamento de banco de dados pelo próprio Nest. Ele funciona como um JPA, transforma o seu código em tabelas relacionadas e traz algumas funções para facilitar tarefas de `select`, `insert`, etc.

### 4.1. Instalação:

Antes de iniciar, é necessário entrar na pasta do projeto e rodar o comando abaixo:

```bash
sudo npm install --save @nestjs/typeorm typeorm mysql2
```

Vá até o arquivo do `app.module.ts` e adicione este código no `imports[]`:

```TypeScript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',            // o banco de dados
      host: 'localhost',        // o host
      port: 3306,               // a porta
      username: 'root',         // o usuario do banco 
      password: 'ifsp',         // a senha do banco
      database: 'db_teste',     // o nome da database
      autoLoadEntities: true,   // faz carregar todos os modulos
      synchronize: true,        // sincroniza automaticamente o schema (use apenas em desenvolvimento)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
}) 
export class AppModule {}
```

> Observação importante: o `synchronize: true` NUNCA deve ser usado em produção, pois pode causar perda de dados.

### 4.2. Decorators

Ao criar uma classe, geralmente na pasta do `model/entities` com o nome `model-name.entity.ts`, deve-se adicionar o `@Entity()` e os Decorators a cada variável.

```TypeScript
@Entity('produtos')
export class Produto {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Nome no banco será 'nm_produto', max 100 letras, obrigatório
    @Column({ name: 'nm_produto', length: 100 })
    nome: string;

    // Oculta coluna 'ativo' no banco, padrão é true
    @Column({ default: true })
    ativo: boolean;

    // Campo único (não pode ter 2 produtos com mesmo código de barras)
    @Column({ unique: true })
    codigoBarras: string;

    // Pode ser nulo (opcional)
    @Column({ nullable: true })
    descricao: string;

    // Controle de auditoria automático
    @CreateDateColumn()
    criadoEm: Date;

    @UpdateDateColumn()
    atualizadoEm: Date;
}
```

O `@Entity()` pode ter um parâmetro para setar o nome específico para a classe como `@Entity('produto')`. </br>

Em seguida temos a definição da chave primária com o `@PrimaryGeneratedColumn()`. Ele pode ter dois parâmetros `increment` que geral uma sequência de números incremental (1, 2, 3, ...) ou `uuid` que gera um hash único e longo. </br>

Além disso, temos as colunas normais definidas com o `@Column()`. Para as colunas, temos alguns parâmetros que podem ser definidos:

| Propriedade | Função |
| ----------- | ------ |
| `name` | da um nome diferente para a coluna no banco |
| `length` | tamanho máximo para textos |
| `nullable` | se o campo pode ou não ser `NULL`. Padrão é `false` (não pode ser `NULL`) |
| `default` | define um valor padrão caso não tenha nada |
| `unique` | garante que não há duplicidade na coluna |
| `select` | ele esconde o campo no select * |

Existem também alguns casos especiais em que é preciso adicionar tipos de dados, sendo os principais números decimais e textos longos.

```TypeScript
@Column({ type: 'decimal', precision: 8, scale: 2 })
preco: number;

@Column({ type: 'text' }) // aceita textos maiores que 255
conteudo: string;
```

O `precision` serve para contar a quantidade total de números antes e depois do ponto. Já o `scale` conta quantos digitos tem depois da vírgula. </br>

Existem outras opções também para datas. Sendo as principais: 

| Decorator | Função |
| --------- | ------ |
| `@CreateDateColumn` | salva a data/hora no momento em que foi criado o registro |
| `@UpdateDateColumn()` | atualiza a data/hora toda vez que é alterado |
| `@DeleteDateColumn()` | para quando tem soft delete (apenas ganha um data de exclusão) | 

Existem ainda, os Decorators para ações específicas como o `@Exclude()` que serve para esconder uma propriedade ao retornar o JSON do objeto, normalmente aplicável para senhas. E o `@Expose()` serve para renomear propriedades, por exemplo, uma propriedade `nome` que será renomeada para `nome_completo` teria que usar: `@Expose({ name: "nome_completo" })`. </br>

Porém, para estas opções funcionarem, é necessário que no controller, no momento de usar algo, colocar um `@UseInterceptors(ClassSerializerInterceptor)`. Por exemplo:

```TypeScript
@Controller('usuarios')
export class UsuarioController {

  @UseInterceptors(ClassSerializerInterceptor) // <<---
  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }
}
```

### 4.3. Aplicação
Para funcionar é necessário adicionar o import no módulo da classe que foi criada, no caso do exemplo passado, a de produtos, então no `produto.module.ts`:

```TypeScript
@Module({
  imports: [TypeOrmModule.forFeature([Produto])],
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}
```

### 4.4. Enum
Para adicionar um Enum, é necessário criar um enum dentro da própria classe. Por exemplo:

```TypeScript
export enum NivelAcesso {
  Administrador = "Administrador",
  Financeiro = "Financeiro",
  Geral = "Geral"
}

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 50 })
  nome: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 100, nullable: true })
  avatar: string;

  @Column({ name: 'idade' })
  idade: number;

  @Column({ name: 'login', unique: true, length: 20 })
  login: string;

  @Column({ name: 'senha', length: 10 })
  senha: string;
}
```

Agora para adicionarmos um enum, precisamos definir alguns parâmetros, para isso temos o `type` (define o tipo) e o `enum` (a classe que define o enum), temos também a opção de colocar um `default` para setar um valor padrão da propriedade. Ficando assim: 

```TypeScript
@Column({
      type: "enum",
      enum: NivelAcesso,
      default: NivelAcesso.Geral,
  })
nivel: NivelAcesso;
```

### 4.5. Relacionamentos
No contexto de construção de tabelas, podemos adicionar os relacionamentos também através dos Decorators. 

### 4.5.1. ManyToOne
Nesse contexto, muitos de uma tabela, possuem o atributo de outra. Por exemplo:

```TypeScript
@Entity()
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  nome: string;

  @Column()
  quantidade: number;

  @Column({ name: 'quantidade_minima' })
  quantidadeMinima: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  preco: number;

  @Column({ length: 30 })
  status: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos,
                { nullable: false  })
  @JoinColumn({ name: "categoria_id" })
  categoria: Categoria;
}
```

Nesse caso, muitos produtos possuem uma categoria em comum, por conta disso, o `Many` (muitos produtos) `toOne` (para uma categoria). Assim, temos a estrutura `@ManyToOne(() => classe, (var) => var.atributoQueLigaDeVolta, { nullable: flase })`. Além do `@JoinColumn({ name: "categoria_id" })` que diz qual vai ser o nome da coluna na tabela Produto. </br>

### 4.5.2. OneToMany

Do outro lado, temos a parte da Categoria com o `@OneToMany()`. Sendo assim: 

```TypeScript
@Entity()
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 50 })
  nome: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos: Produto[];
}
```

A estrutura do `@OneToMany()` se da pelo: `@OneToMany(() => classe, (var) => var.atributoQueLigaDeVolta)`. Além disso, é importante ver que, nesse caso, há uma lista para comportar os muitos produtos em um atributo.

### 4.5.3. OneToOne

Quando um registro de uma tabela tem relação 1:1 com outra. Exemplo: Usuário e Perfil.

```TypeScript
// usuario.entity.ts
@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Perfil, (perfil) => perfil.usuario)
  @JoinColumn()
  perfil: Perfil;
}

// perfil.entity.ts
@Entity()
export class Perfil {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Usuario, (usuario) => usuario.perfil)
  perfil: Usuario;
}
```

### 4.5.4. ManyToMany

Quando vários registros de uma tabela se relacionam com vários de outra. Exemplo: Alunos e Cursos.

```TypeScript
// aluno.entity.ts
@Entity()
export class Aluno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Curso, (curso) => curso.alunos)
  @JoinTable() // Apenas um lado precisa do JoinTable
  cursos: Curso[];
}

// curso.entity.ts
@Entity()
export class Curso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Aluno, (aluno) => aluno.cursos)
  alunos: Aluno[];
}
```

### 4.5.5. Carregamento de Relacionamentos

**Eager Loading:** Carrega automaticamente os relacionamentos.

```TypeScript
@ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
  eager: true  // Sempre carrega a categoria junto com o produto
})
categoria: Categoria;
```

**Lazy Loading:** Carrega apenas quando solicitado.

```TypeScript
// No service
const produto = await this.produtoRepository.findOne({
  where: { id },
  relations: ['categoria']  // Especifica quais relações carregar
});
```

### 4.5.6. Operações em Cascata

Permite que operações (salvar, deletar) sejam aplicadas automaticamente aos relacionamentos.

```TypeScript
@OneToMany(() => Produto, (produto) => produto.categoria, {
  cascade: true,  // Ao salvar categoria, salva produtos também
  onDelete: 'CASCADE'  // Ao deletar categoria, deleta produtos
})
produtos: Produto[];
```

**Opções de cascade:**
- `true`: Todas as operações
- `['insert']`: Apenas ao inserir
- `['update']`: Apenas ao atualizar
- `['remove']`: Apenas ao deletar

## 5. Class Validators e Transformers

Este recurso servirá como um guia para saberem o que é necessário ser enviado na requisição e validar os dados recebidos, antes de chegar ao `service`. </br>

Para iniciar, devemos primeiro instalar os recursos:

```bash
sudo npm install class-validator class-transformer
```

Em seguida, precisamos definir isso no arquivo `main.ts`, adicionando estas linhas:

```TypeScript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    // 1. Remove campos que não estão no DTO (Segurança)
    whitelist: true, 

    // 2. (Opcional) Retorna erro se existirem campos não permitidos
    // forbidNonWhitelisted: true,
    
    // 3. Transforma automaticamente os tipos
    // Converte o JSON simples para uma Instância da classe DTO
    transform: true,
  }));

  await app.listen(3000);
}
```

Tendo isso configurado, podemos começar a trabalhar na próxima etapa, os DTOs. 

### 5.1. Data Transfer Objects (DTOs)
O DTO se trata de uma classe simples para definir o formato dos dados que serão recebidos e enviados em uma requisição. Aqui, utilizaremos diversos Decorators (validadores de dados) para que os dados cheguem no formato correto. </br>

Então para a classe produto, podemos ter um `create-produto.dto.ts` dessa forma:

```TypeScript
import { 
  IsString, 
  IsNumber, 
  IsNotEmpty, 
  Min, 
  MaxLength,
  IsUrl,
  IsOptional 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProdutoDto {
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsNumber({ maxDecimalPlaces: 2 }) // Aceita no máximo 2 casas decimais
  @Min(0.01, { message: 'O preço deve ser maior que zero' })
  // O @Type ajuda o class-transformer a garantir que é numero
  @Type(() => Number) 
  preco: number;

  @IsOptional() // Campo não obrigatório
  @IsString()
  descricao?: string;

  @IsNotEmpty()
  @IsUrl() // Valida se é um link válido
  fotoUrl: string;
}
```

Temos então alguns Decorators que são importantes e mais utilizados:

| Decorator | Validação |
| --------- | --------- |
| `@IsNotEmpty()` | Não aceita vaizo ou `NULL` |
| `@IsOptional()` | Não é obrigatório | 
| `@IsString()` | Deve ser texto. | 
| `@IsEmail()` | Deve ter o formato de e-mail |
| `@MaxLength(n)` / `@MinLength(n)` | Tamanho do texto | 
| `@Matches(/regex/)` | Valida com regex |
| `@IsNumber()` | Deve ser número (int ou float) |
| `@IsInt()` | Deve ser um inteiro | 
| `@Min(n)` / `@Max(n)` | Valor mínimo e máximo | 
| `@IsPositive()` | Deve ser maior que zero | 
| `@IsDateString()` | Data no formato string ("yyyy-mm-dd") |
| `@IsArray()` | Deve ser uma lista |

Com isso, estamos protegendo nossa criação de produtos, assim, podemos utilizar isso no controller como:

```TypeScript
@Post()
create(@Body() createProdutoDto: CreateProdutoDto) {
  // Se chegar aqui, os dados estão 100% validados
  return this.produtoService.create(createProdutoDto);
}
```

### 5.2. Pipes Nativos do NestJS

Pipes são usados para transformar e validar dados antes de chegarem ao controller.

| Pipe | Função |
| ---- | ------ |
| `ParseIntPipe` | Converte string para inteiro |
| `ParseBoolPipe` | Converte string para boolean |
| `ParseArrayPipe` | Converte para array |
| `ParseUUIDPipe` | Valida se é UUID válido |
| `ValidationPipe` | Valida usando class-validator |

Exemplo:
```TypeScript
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  return this.categoriaService.buscarPeloId(id);
}
```

## 6. Autentificação JWT

O JWT ser trata de um serviço de autentificação, normalmente utilizado para gerenciamento de logins e sessões.

### 6.1. Instalação
Para utilizar este recurso, é necessário instalar seus pacotes primeiro: 

```TypeScript
sudo npm install @nestjs/passport passport @nestjs/jwt passport-jwt
sudo npm install -D @types/passport-jwt
```

Em seguida, devemos gerar o módulo e service de autentificação

```bash
nest g module auth
nest g service auth
```

Assim, o `auth.module.ts` ficará assim: 

```TypeScript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ 
      secret: 'SEGREDO_SUPER_SECRETO', // aqui geralmente é utilizado uma variável do .env ou de um Constants.ts ou jwtConstants.json
      signOptions: { expiresIn: '60s' }, // quanto tempo dura o token
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### 6.2. Gerando os Tokens 
Com o ambiente configurado, podemos gerar os tokens em um `auth.service.ts`.

```TypeScript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Isso é apenas depois de validar a senha
  async login(user: any) {
    // O payload é a informação que vai gravada "dentro" do token
    const payload = { username: user.username, sub: user.id };
    
    return {
      // retorna o access token criptografado
      access_token: this.jwtService.sign(payload), 
    };
  }
}
```

Com o token criado, podemos então proteger as nossas rotas para que somente usuários com o token consigam acessar. Nessa, entra o `jwt.strategy.ts` para fazer a validação do token.

```TypeScript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Pega o token do cabeçalho (Barrer <token>)
      ignoreExpiration: false,
      secretOrKey: 'SEGREDO_SUPER_SECRETO', // Aqui validamos o token recebido
    });
  }

  // Se o token for válido, o Nest roda essa função
  async validate(payload: any) {
    // O retorno daqui é injetado automaticamente no objeto 'request.user'
    return { userId: payload.sub, username: payload.username };
  }
}
```

Agora, podemos proteger nossas rotas utilizando o Guard. Para isso, as rotas que devem ser protegidas utilizam uma tag de `@UseGuards(AuthGuard('jwt'))`, como no exemplo:

```TypeScript
@UseGuards(AuthGuard('jwt'))
@Get('profile')
getProfile(@Request() req) {
  // O JwtStrategy já retorna as informações pelo req.user
  return req.user;
}
```

### 6.3. Guards Personalizados

Guards controlam se uma requisição pode ou não prosseguir.

```TypeScript
// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Verifica se o usuário tem permissão
    return user && user.role === 'admin';
  }
}
```

**Usando:**
```TypeScript
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Delete(':id')
delete(@Param('id') id: string) {
  return this.service.delete(id);
}
```

## 7. Exception Filters
Basicamente, cria a possibilidade de enviarmos exceções personalizadas para quando algo da erro. </br>

Para isso, podemos criar uma classe de filtros, por exemplo, uma `http-exception.filter.ts` que terá o seguinte formato: 

```TypeScript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

// Aqui fala para quais erros olhar
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // Sempre que houver um erro, esse método é chamado
  catch(exception: HttpException, host: ArgumentsHost) {
    
    // O ArgumentsHost contém o Request e o Response
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Pegamos o status do erro (ex: 403, 404, 500)
    const status = exception.getStatus();

    // Pegamos a mensagem de erro original
    const exceptionResponse = exception.getResponse();

    // 4. Montamos nossa resposta personalizada
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(), // Adicionamos a hora
        path: request.url,                   // Adicionamos a URL
        erro: exceptionResponse,
        mensagem: "Ops! Algo deu errado no sistema."
      });
  }
}
```

Ou podemos ter uma versão mais genérica e tratar diferentes tipos de erros em um único arquivo dessa forma:

```TypeScript
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    console.log('Tratamento de exceptions...');

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log(exception);

    let status = exception instanceof HttpException ? exception.getStatus() : 500;
    let message = "Falhou"; 
    if (exception instanceof JsonWebTokenError) {
      message = "Erro JWT";
    }

    response.status(status).json({
      statusCode: status,
      message
    });

  }
}
```

Para que o filter funcione, temos 3 opções, adicionar `@UseFilters(HttpExceptionFilter)` nas funções (para proteger uma rota) ou antes do `@Controller()` para proteger o controller todo, ou então adicionamos `app.useGlobalFilters(new HttpExceptionFilter());` no `main.ts` para ele funcionar em todas as rotas. 

### 7.1. Status HTTP Personalizados

```TypeScript
import { HttpStatus } from '@nestjs/common';

@Post()
@HttpCode(HttpStatus.CREATED) // Retorna 201 ao invés de 200
create(@Body() dados: any) {
  return this.service.create(dados);
}
```

**Principais Status:**
- 200: OK
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## 8. Middlewares

Middlewares são funções executadas **antes** de chegar ao controller.

```TypeScript
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(\`[\${req.method}] \${req.url}\`);
    next(); // Passa para o próximo middleware ou rota
  }
}
```

**Aplicando no módulo:**
```TypeScript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Aplica em todas as rotas
  }
}
```

> É válido ressaltar que este .md serviu apenas como base de estudos e retrata apenas o meu conhecimento da época (30/11/2025). Não deve ser usado como regra ou vias de certeza. Sujeito a alterações e correções.
