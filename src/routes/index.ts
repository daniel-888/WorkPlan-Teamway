import express, {
  Express,
  Router,
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from "express";
import routerV1 from "./v1";
// Prometheus node.js client
import client, { Registry } from "prom-client";

const router: Router = Router();

// Create a Registry which registers the metrics
const register: Registry = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "teamway.test.workplan.rest.app",
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// /root API which demonstrates 
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    version: "0.1.0",
    date: Date.now(),
  });
});

// prometheus metrics standard handler
router.get("/metrics", async (req: Request, res: Response) => {
  // Return all metrics the Prometheus exposition format
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// node health check handler
router.get("/health", async (req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
});

// main router
router.use("/v1", routerV1);

const initRoute = (app: Express) => {
  app.use(router);

  // Implement 500 error route
  app.use(((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).send("Something is broken." + err.toString());
  }) as ErrorRequestHandler);

  // Implement 404 error route
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Sorry we could not find that.");
  });
};

export default initRoute;