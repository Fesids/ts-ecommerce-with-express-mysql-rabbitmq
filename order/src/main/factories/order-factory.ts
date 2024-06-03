import {Request, Response, NextFunction} from "express"
import { OrderMySQLRepository } from "../../infra/db/mysql/repository/order-repository"
import { MySQLHelper } from "../../../../product/src/infra/db/mysql/helpers/mysql-helper"
import { CreateOrderController } from "../../presentation/controllers/create-order-controller";

export class OrderFactory {

    async create(req:Request, res:Response,  next:NextFunction){

        const repository = new OrderMySQLRepository(MySQLHelper);

        const controller = new CreateOrderController(repository);

        const {body, statusCode} = await controller.handle({
            body: req.body
        });

        res.json(body).status(statusCode);

    }
}