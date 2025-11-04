import { Foto } from "./Foto.model";

export interface FotoResponse {
    total_photos: number;
    photos: Foto[]
}