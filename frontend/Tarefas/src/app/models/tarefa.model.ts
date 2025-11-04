import { Status } from "./status.model";

export interface Tarefa {
    id: number;
    descricao: string;
    status: Status
}