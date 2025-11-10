/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Produto {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({name: "nome", length: 50})
    nome: string;
    
    @Column({name: "quantidade"})
    quantidade: number;

    @Column({})
    minimo: number;

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    preco: number;

    @Column({length: 30})
    status: string;
}