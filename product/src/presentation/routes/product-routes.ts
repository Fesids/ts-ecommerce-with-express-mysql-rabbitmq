import { Router, Request, Response } from "express";
import { ProductFactory } from "../../main/factories/product-factory";



const routes = Router();

const ProductFactories = new ProductFactory();

routes.get("/teste", (req: Request, res: Response) => {
  res.json("ok ok ");
});

routes.get("", ProductFactories.getAll)
routes.get("/detail/:id", ProductFactories.getProductByID)
routes.post("/create", ProductFactories.create);
routes.post("/buy", ProductFactories.createProductOrder.bind(ProductFactories))
routes.get("/buy/status/:orderId", ProductFactories.getOrderStatus.bind(ProductFactories))


export const ClientesRoutes = routes;