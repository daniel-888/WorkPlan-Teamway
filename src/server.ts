import express, { Express } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";

import initDB from "./db";
import initRoute from "./routes";
import setEnviornment from "./env";

// Swagger OpenAPI definition file
const swaggerDocument = require("./swagger/swagger.json");
const customCss = fs.readFileSync(
  process.cwd() + "/src/swagger/swagger.css",
  "utf8"
);

setEnviornment();
// connect mongodb
initDB();

const app: Express = express();

// swagger - ui client
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCss })
);

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);


app.use(morgan("dev"));

initRoute(app);

app.set("trust proxy", true);
const server = app.listen(process.env.PORT || 3000, () => {
  // tslint:disable-next-line:no-console
  console.log("Server is Runing On port 3000");
});

// graceful shutdown handler
process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.log("Closing https server.");
  server.close(() => {
    console.log("Http server closed.");
    // boolean means [force], see in mongoose doc
    mongoose.connection.close(false, () => {
      console.log("MongoDb connection closed.");
      process.exit(0);
    });
  });
});