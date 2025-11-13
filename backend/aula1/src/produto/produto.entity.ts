/* eslint-disable prettier/prettier */
import { Categoria } from "src/categoria/categoria.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {nullable: false})
    @JoinColumn({name: "categoria_id"})
    categoria: Categoria;
}