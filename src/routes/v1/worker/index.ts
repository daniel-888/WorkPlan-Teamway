import { Router, Request, Response } from "express";

import {
  workersList,
  createWorker,
  deleteAllWorkers,
  getWorker,
  updateWorker,
  deleteWorker,
  getInactiveWorkers,
} from "../../../controllers/worker.controller";

const router: Router = Router();

router.get('/', workersList);
router.post("/", createWorker);
router.delete("/", deleteAllWorkers);

router.get("/inactive", getInactiveWorkers);

router.get("/:workerId", getWorker);
router.patch("/:workerId", updateWorker);
router.delete("/:workerId", deleteWorker);


export default router;