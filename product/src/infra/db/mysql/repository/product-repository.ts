import { ProductRepository } from "../../../../data/protocols/product-repository-protocol";
import { Product } from "../../../../domain/models/product-model";
import { CreateProductModel } from "../../../../domain/usecases/create-product";
//import { MySQLHelper } from "../helpers/mysql-helper";
import mysql2, {Pool} from "mysql2";




export class ProductMySQLRepository implements ProductRepository {
    constructor(private pool: Pool) {}

    async createTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.pool.query(`
                CREATE TABLE IF NOT EXISTS Products(
                    id int primary key not null auto_increment,
                    name varchar(244),
                    description varchar(244),
                    thumbnail varchar(544),
                    image varchar(544),
                    price int,
                    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
                    updatedAt datetime DEFAULT CURRENT_TIMESTAMP
                )
            `, (err, results) => {
                if (err) {
                    console.error("Failed to create Products table:", err);
                    reject(err);
                } else {
                    console.log("Products table created successfully.");
                    resolve();
                }
            });
        });
    }

 

    async create(data: CreateProductModel): Promise<Product> {
        const { name, description, thumbnail, image, price } = data;

        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection from pool:', err);
                    reject(err);
                    return;
                }

                connection.query(
                    `INSERT INTO Products(name, description, thumbnail, image, price) VALUES (?, ?, ?, ?, ?)`,
                    [name, description, thumbnail, image, price],
                    (err, results, fields) => {
                        connection.release(); 
                        if (err) {
                            console.error("Error inserting product:", err);
                            reject(err);
                        } else {
                            const productId = results.insertId; 
                            connection.query(
                                'SELECT * FROM Products WHERE id = ?',
                                [productId],
                                (err, rows) => {
                                    if (err) {
                                        console.error("Error fetching inserted product:", err);
                                        reject(err);
                                    } else {
                                        console.log("Product inserted successfully.");
                                        resolve(rows[0]); 
                                    }
                                }
                            );
                        }
                    }
                );
            });
        });
    }

    async getProductByID(id:number): Promise<Product>{
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if(err) {
                    console.error('Error getting connection from pool', err);
                    reject(err);
                    return;
                }

                connection.query("SELECT * FROM Products WHERE ID = ?", [id], (err, rows) => {
                    connection.release();
                    if(err){
                        console.error("Failed to execute query: ", err);
                        reject(err)
                    }else {
                        //console.log(rows[0])
                        resolve(rows[0])
                    }
                })
            })
        })
    }
    
    async getAll(): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection from pool:', err);
                    reject(err);
                    return;
                }
    
                connection.query("SELECT * FROM Products", (err, rows) => {
                    connection.release(); 
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(err);
                    } else {
                        if (!rows || !Array.isArray(rows)) {
                            console.error('No rows retrieved from the database.');
                            reject(new Error('No rows retrieved from the database.'));
                            return;
                        }
    
                        console.log('Retrieved all products successfully.');
                        //console.log(rows);
                        
                        const products: Product[] = rows.map(row => {
                            return {
                                id: row.id as number,
                                name: row.name as string,
                                description: row.description as string,
                                thumbnail: row.thumbnail as string,
                                image: row.image as string,
                                price: row.price as number,
                                createdAt: row.createdAt as Date,
                                updatedAt: row.updatedAt as Date
                            };
                        });
                        
                        //console.log('Mapped products:', products);
                        resolve(products);
                    }
                });
            });
        });
    }
    
}


/*  async getAll():Promise<any> {
        const pool = MySQLHelper
        pool.getConnection((err, connection) => {
            const [rows] = connection.query<Product[]>("SELECT * FROM Products");
        })
       /* const products = await MySQLHelper.query<Product[]>("SELECT * FROM Products");
        console.log(products[0])
        return products[0];

        return [];
    }*/