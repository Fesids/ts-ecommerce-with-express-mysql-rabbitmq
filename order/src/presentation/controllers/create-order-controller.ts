import { ServerError } from "../../../../product/src/presentation/errors";
import { MissingRequestParamError } from "../../../../product/src/presentation/errors/missing-request-param-error";
import { badRequest, created, serverError } from "../../../../product/src/presentation/helpers/http-helpers";
import { Controller, HttpRequest, HttpResponse } from "../../../../product/src/presentation/protocols";
import { CreateOrder } from "../../domain/usecases/create-order";

export class CreateOrderController implements Controller {

    constructor(private readonly createOrder: CreateOrder){}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const {products, totalPrice, user} = httpRequest.body;

        const requiredFields = ["products", "totalPrice", "user"]

        try{
            for(const field of requiredFields){
                if(!httpRequest.body(field)){
                    badRequest(new MissingRequestParamError(field).message);
                }
            }

            const createdOrder = await this.createOrder.create({
                user,
                products,
                totalPrice
            });

            return created(createdOrder);

        } catch(err){
            console.error(err);
            return serverError(err);
        }
    }

    

}