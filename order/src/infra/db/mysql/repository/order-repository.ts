import { OrderRepository } from "../../../../data/protocol/order-repository-protocol";
import { Order } from "../../../../domain/models/order-model";
import { CreateOrderModel } from "../../../../domain/usecases/create-order";
import {Pool} from "mysql2"


export class OrderMySQLRepository implements OrderRepository {

    constructor(private pool:Pool){}

    async createTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.pool.query(`
                CREATE TABLE IF NOT EXISTS Orders(
                    id varchar(50) not null,
                    user varchar(122),
                    products JSON,
                    totalPrice DECIMAL(13, 2)
                )
            
            `, (err, results) => {
                if (err) {
                    console.error("Failed to create Products table:", err);
                    reject(err);
                } else {
                    console.log("Orders table created successfully.");
                    resolve();
                }
            })
        })
    }

    async create(data: CreateOrderModel): Promise<Order> {
        const {totalPrice, products, user, id} = data;

        await this.createTable()

        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if(err){
                    console.error("Error getting connection from pool:", err);
                    reject(err);
                    return;
                }

                connection.query(
                    `INSERT INTO Orders(products, totalPrice, user, id) values (?, ?, ?, ?)`,
                    [products, totalPrice, user, id],
                    (err, results, fields) => {
                        connection.release();
                        if(err){
                            console.error("Error inserting order:", err);
                            reject(err)
                        }else {
                            const orderId = results.insertId;
                            connection.query(
                                'SELECT * from Orders where id = ?',
                                [orderId],
                                (err, rows) => {
                                    if(err){
                                        console.error("Error fetching inserted order: ", err);
                                        reject(err);
                                    } else {
                                        console.log("Order inserted successfully.");
                                        resolve(rows[0])
                                    }
                                }
                            )
                        }
                    }
                )

            })
        })

    }

    getAll(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    getOrderID(id: Number): Promise<Order> {
        throw new Error("Method not implemented.");
    }
    
}