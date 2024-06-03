import env from "./config/env";

import app from "./config/app";
import { messageBroker } from "../utils/messageBroker";

messageBroker.connect()

app.listen(env.port, () =>
  console.log(`Server running at http://localhost:${env.port}`)
);
