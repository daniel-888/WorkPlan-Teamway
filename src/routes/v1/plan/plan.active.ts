import { Router, Request, Response } from "express";

import {getPlanActive} from "../../../controllers/plan.active.controller";

const router: Router = Router();

router.get("/:isWorkerActive", getPlanActive);

export default router;