import { Router, Request, Response } from "express";

import {
  shiftsList,
  createShift,
  deleteAllShifts,
  getShift,
  updateShift,
  deleteShift,
  getInactiveShifts,
} from "../../../controllers/shift.controller";

const router: Router = Router();

router.get('/', shiftsList);
router.post("/", createShift);
router.delete("/", deleteAllShifts);

router.get("/inactive", getInactiveShifts);

router.get("/:shiftId", getShift);
router.patch("/:shiftId", updateShift);
router.delete("/:shiftId", deleteShift);

export default router;