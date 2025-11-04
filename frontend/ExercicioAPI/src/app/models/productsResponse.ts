import { Products } from "./products";

export interface ProductsResponse {
    products: Products[];
    total: number;
    skip: number;
    limit: number;
} 