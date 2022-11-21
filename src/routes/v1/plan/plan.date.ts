import { Router, Request, Response } from "express";

import {getPlanDate} from "../../../controllers/plan.date.controller";

const router: Router = Router();

router.get("/:date", getPlanDate);

export default router;