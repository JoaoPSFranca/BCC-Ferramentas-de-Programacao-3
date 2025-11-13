/* eslint-disable prettier/prettier */
import { Produto } from "src/produto/produto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @OneToMany(() => Produto, (produto) => produto.categoria)
    produtos: Produto[];
}