import { Router } from "express";

import {
  getWorker,
  // updateWorker,
  // deleteWorker
} from "../../../controllers/worker.controller";

const router: Router = Router();

router.get('/', getWorker);
// router.patch('/', updateWorker);
// router.delete('/', deleteWorker);

export default router;