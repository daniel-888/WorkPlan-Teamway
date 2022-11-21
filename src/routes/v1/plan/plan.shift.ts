import { Router, Request, Response } from "express";

import {getPlanShift} from "../../../controllers/plan.shift.controller";

const router: Router = Router();

router.get("/:shiftId", getPlanShift);

export default router;