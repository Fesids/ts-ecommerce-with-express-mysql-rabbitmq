import { Product } from "../models/product-model";

export interface GetProductById{
    getProductByID(id:number): Promise<Product>
}