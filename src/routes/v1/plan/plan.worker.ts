import { Router, Request, Response } from "express";

import {getPlanWorker} from "../../../controllers/plan.worker.controller";

const router: Router = Router();

router.get("/:workerId", getPlanWorker);

export default router;