import { Order } from "../models/order-model"

export interface CreateOrderModel {
    id: string,
    products: Array<any>,
    totalPrice: number,
    user: string
}

export interface CreateOrder {
    createTable(): Promise<void>
    create(data: CreateOrderModel): Promise<Order>
}