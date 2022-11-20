import { Router } from "express";

import {
  workersList,
  createWorker,
  deleteAllWorkers,
} from "../../../controllers/worker.controller";

const router: Router = Router();

router.get('/', workersList);
router.post("/", createWorker);
router.delete("/", deleteAllWorkers);

export default router;