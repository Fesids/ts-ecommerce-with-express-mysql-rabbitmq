import { Product } from "../../domain/models/product-model";
import { CreateProductModel } from "../../domain/usecases/create-product";

export interface ProductRepository {

    createTable(): Promise<any>;

    create(data: CreateProductModel): Promise<Product>;

    getAll(): Promise<Product[]>;

    getProductByID(id: Number): Promise<Product>;

}