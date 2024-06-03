import { CreateProduct } from "../../domain/usecases/create-product";
import { MissingParamError, ServerError } from "../errors";
import { MissingRequestParamError } from "../errors/missing-request-param-error";
import { badRequest, created, serverError } from "../helpers/http-helpers";
import { Controller, HttpRequest, HttpResponse } from "../protocols";


export class CreateProductController implements Controller {

    constructor(private readonly createProduct: CreateProduct){}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

        const {name, description, image, thumbnail, price} = httpRequest.body;

        const requiredFields = ["name", "price"]

        try{
            for(const field of requiredFields){
                if(!httpRequest.body[field]){
                    return badRequest(new MissingRequestParamError(field).message);
                }
            }
            
            const createdProduct = await this.createProduct.create({
                name,
                description,
                image,
                thumbnail,
                price
            })

            return created(createdProduct);
        }catch(err:any){
            console.log(err)
            return serverError(err);
        }

        //throw new Error("Method not implemented.");

    }

    
}