import { Router } from "express";

import planWorkerRouter from "./plan.worker";
import planShiftRouter from "./plan.shift";
import planDateRouter from "./plan.date";
import planActiveRouter from "./plan.active";

import {
  plansList,
  createPlan,
  replacePlan,
  deleteAllPlans,
  getPlan,
  deletePlan,
} from "../../../controllers/plan.controller";

const router: Router = Router();

router.get('/', plansList);
router.post("/", createPlan);
router.put("/", replacePlan);
router.delete("/", deleteAllPlans);

router.get("/:planId", getPlan);
router.delete("/:planId", deletePlan);

router.use("/worker", planWorkerRouter);
router.use("/shift", planShiftRouter);
router.use("/date", planDateRouter);
router.use("./active", planActiveRouter);

export default router;