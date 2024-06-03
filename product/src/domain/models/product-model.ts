import { RowDataPacket } from "mysql2";

export interface Product {//extends RowDataPacket{
    id: number,
    name: string,
    description: string,
    thumbnail: string,
    image: string,
    price: number,
    quantity?: number,
    createdAt: Date,
    updatedAt: Date,

}