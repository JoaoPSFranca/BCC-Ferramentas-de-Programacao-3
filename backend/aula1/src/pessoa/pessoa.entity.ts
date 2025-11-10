/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pessoa {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({name: "nome", length: 50})
    nome: string;

    @Column({name: "email"})
    email: string;

    @Column({name: "avatar", nullable: true})
    avatar: string;
}