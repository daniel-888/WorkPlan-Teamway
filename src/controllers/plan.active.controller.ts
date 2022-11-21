import { Request, Response, NextFunction } from "express";
import PlanQuery, { IPlanQuery } from "../models/plan";
import ShiftQuery, { IShiftQuery } from "../models/shift";
import WorkerQuery, { IWorkerQuery } from "../models/worker";
import { Types } from "mongoose";
import { formatDate } from "../utils/date";

const getPlanActive = (req: Request, res: Response, next: NextFunction) => {
  let { isWorkerActive } = req.params;
  if (isWorkerActive !== "true" && isWorkerActive !== "false") res.status(404).json({ message: "Date is not valid." });
  PlanQuery
    .find()
    .populate({
      path: 'worker',
      match: {
        isWorkerActive: isWorkerActive === "true" ? true : false,
      },
      select: '_id firstName lastName email',
    })
    .populate({
      path: 'shift',
      match: {
        isShiftActive: true,
      },
      select: '_id startHour endHour',
    })
    .then((plans: IPlanQuery[]) => {
      let result: any = [];
      plans.map((plan: IPlanQuery) => {
        const shift = plan.shift;
        const worker = plan.worker;
        if (shift === null || shift instanceof Types.ObjectId)
          return;
        else if (worker === null || worker instanceof Types.ObjectId)
          return;
        else
          result.push({
            id: plan._id,
            date: plan.date,
            shiftId: shift._id,
            startHour: shift.startHour,
            endHour: shift.endHour,
            workerId: worker._id,
            firstName: worker.firstName,
            lastName: worker.lastName,
            email: worker.email,
            isWorkerActive: worker.isWorkerActive,
            isShiftActive: shift.isShiftActive,
          });
      });
      res.json(result);
    })
    .catch(next);
}

export { getPlanActive };