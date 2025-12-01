import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum NivelAcesso {
  Administrador = "Administrador",
  Financeiro = "Financeiro",
  Geral = "Geral"
}

@Entity()
export class Conta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 50 })
  nome: string;

  @Column({ length: 100 })
  email: string;

  @Exclude()
  @Column({ name: 'senha', length: 10 })
  senha: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  saldo: number;
}