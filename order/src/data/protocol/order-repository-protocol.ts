import { Order } from "../../domain/models/order-model";
import { CreateOrderModel } from "../../domain/usecases/create-order";

export interface OrderRepository {

    createTable(): Promise<any>;

    create(data: CreateOrderModel): Promise<Order>;

    getAll(): Promise<Order[]>;

    getOrderID(id: Number): Promise<Order>;

}