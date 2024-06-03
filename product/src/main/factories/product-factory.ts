import {Request, Response} from "express";
import { ProductMySQLRepository } from "../../infra/db/mysql/repository/product-repository";
import { CreateProductController } from "../../presentation/controllers/create-product-controller";
import { GetProductsController } from "../../presentation/controllers/get-products-controller";
import { MySQLHelper } from "../../infra/db/mysql/helpers/mysql-helper";
import { GetProductByIDController } from "../../presentation/controllers/get-product-by-id-controller";
import uuid from "uuid"
import { messageBroker } from "../../utils/messageBroker";
//import { MessageBroker } from "../../utils/messageBroker";

export class ProductFactory{
    ordersMap: Map<string, any>;

    constructor(){
        this.ordersMap=new Map();
    }

    async create(req:Request, res:Response){
        const repository = new ProductMySQLRepository(MySQLHelper);

        const controller = new CreateProductController(repository);

        const {body, statusCode} = await controller.handle({
            body: req.body,
            params: req.params
        });

        res.json(body).status(statusCode);

    }

    async getProductByID(req:Request, res:Response){
        const repository = new ProductMySQLRepository(MySQLHelper);

        const controller = new GetProductByIDController(repository);

        const {body, statusCode} = await controller.handle({
            params: req.params
        });

        res.json(body).status(statusCode);
    }

    async getAll(req:Request, res:Response){
        const repository = new ProductMySQLRepository(MySQLHelper);

        const controller = new GetProductsController(repository);

        const {body, statusCode} = await controller.handle();
        //console.log(body)

        res.json(body).status(statusCode);

    }

    async createProductOrder(req:Request, res:Response){
      
        const {ids} = req.body;
        const repository = new ProductMySQLRepository(MySQLHelper);
        const products = [] as any;
       
        try{
            const respProducts = await Promise.all(ids.map(async (item) => {
                const {productId, quantity} = item;
                const data = await repository.getProductByID(productId);

                data.quantity = quantity
                return data;
            }));
        
            for (const data of respProducts) {
                products.push(data);
            }

            const orderId = uuid.v4();
           
            this.ordersMap.set(orderId, {
                status: "pending",
                products,
                username: "teste"
            })

           await messageBroker.publishMessage("orders", {
            products,
            username: "teste",
            orderId
           });

           messageBroker.consumeMessage("products", (data) => {
            const orderData = JSON.parse(JSON.stringify(data));
            const { orderId } = orderData;
            const order = this.ordersMap.get(orderId);
            if(order){
                this.ordersMap.set(orderId, {...order, ...orderData, status: 'completed'});
                console.log("Updated order: ", order);
            }
           });

           let order = this.ordersMap.get(orderId);
           while(order.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            order = this.ordersMap.get(orderId)
           }

           for (const [key, value] of this.ordersMap) {
            console.log(`${key} => ${value}`);
          }
          
          // Using spread operator with console.log
          console.log([...this.ordersMap]);
            // Once the order is marked as completed, return the complete order details
        return res.status(201).json(order);
        
        }catch(err){
            console.log(err)
            res.status(500).json({message: "Server error"})
        }
    
    }

    async getOrderStatus(req:Request, res:Response){
        const {orderId} = req.params;
        const order = this.ordersMap.get(orderId);
        if(!order){
            return res.status(404).json({message : "Order not found!"})
        }

        return res.status(200).json(order)
        //return res.status(200).json(this.ordersMap)
    }
}