import mysql2, {Pool, PoolOptions, createPool, createConnection} from "mysql2";


const poolOptions:PoolOptions = {
    host: "localhost",
    port: 3306,
    database: "node_db",
    user: "root", 
    password: "67890000"
}



export const MySQLHelper: Pool = createPool(poolOptions)//createPool(poolOptions)


//export const MySQLHelper = DBPool