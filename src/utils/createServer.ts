import express, { Express } from "express";

import cors from "cors";
import bodyParser from "body-parser";

import initDB from "../db";
import initRoute from "../routes";
import setEnvironment from "../env";

export const createServer = async () => {
  setEnvironment();
  await initDB();

  const app: Express = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

  initRoute(app);
  app.set("trust proxy", true);

  return app;
};