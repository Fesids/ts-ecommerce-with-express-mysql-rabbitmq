import { Express } from "express";
import { bodyParser, contentType } from "../middlewares";
import cors from "cors";
import { ClientesRoutes } from "../../presentation/routes/product-routes";

export default (app: Express): void => {
  app.use(bodyParser);
  app.use(cors());
  app.use(contentType);
  app.use("/api/v1/products", ClientesRoutes);
};
