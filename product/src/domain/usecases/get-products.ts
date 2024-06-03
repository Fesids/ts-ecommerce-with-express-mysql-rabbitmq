import { Product } from "../models/product-model";

export interface GetProducts{
    getAll(): Promise<Product[]>
}