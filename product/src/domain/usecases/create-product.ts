import { Product } from "../models/product-model";

export interface CreateProductModel {
    name: string,
    description: string,
    thumbnail: string,
    image: string,
    price: number,
}

export interface CreateProduct {
    createTable(): Promise<void>
    create(data: CreateProductModel) : Promise<Product>
}