import { GetProductById } from "../../domain/usecases/get-product-by-id";
import { badRequest, ok } from "../helpers/http-helpers";
import { Controller, HttpRequest, HttpResponse } from "../protocols";


export class GetProductByIDController implements Controller{
    constructor(private readonly getProduct: GetProductById){}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
        const {id} = httpRequest.params;

        try{
            if(!id){
                return badRequest("No ID provided on URL params")
            }

            const product = await this.getProduct.getProductByID(id);

            if(!product){
                return badRequest("Failed to retrieve product with ID "+id);
            }

            return ok(product)

        }catch(err){
            return badRequest(err);
        }

    }

}