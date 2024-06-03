import { GetProducts } from "../../domain/usecases/get-products";
import { badRequest, ok } from "../helpers/http-helpers";
import { Controller, HttpRequest, HttpResponse } from "../protocols";

export class GetProductsController implements Controller{
    constructor(private readonly getProducts: GetProducts){}

    async handle(): Promise<HttpResponse> {
      try{
        const products = await this.getProducts.getAll();

        if(!products){
            return badRequest([]);
        }

        return ok(products)

      }catch(err:any){
        return badRequest(err);
      }
    }

}