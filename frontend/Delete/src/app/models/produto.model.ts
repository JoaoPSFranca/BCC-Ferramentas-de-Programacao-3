import { Categoria } from "./categoria.model";

export interface Produto {
    id: number;
    nome: string;
    quantidade_em_estoque: number;
    preco: number;
    categoria: Categoria;
}