import { Request, Response, NextFunction } from "express";
import PlanQuery, { IPlanQuery } from "../models/plan";
import ShiftQuery, { IShiftQuery } from "../models/shift";
import WorkerQuery, { IWorkerQuery } from "../models/worker";
import { Types } from "mongoose";
import { formatDate } from "../utils/date";

/**
 * Get the whole list of active plans 
 * URL: /v1/plan
 * METHOD: GET
 * REQUEST: {}
 * REPONSE: Array (
 *  {
 *    id: string,
 *    date: string,
 *    shiftId: string,
 *    startHour: number,
 *    endHour: number,
 *    workerId: string,
 *    firstName: string,
 *    lastName: string,
 *    email: string,
 *    isWorkerActive: boolean,
 *    isShiftActive: boolean,
 *  }
 * )
 */
const plansList = (req: Request, res: Response, next: NextFunction) => {
  PlanQuery.find()
    .populate({
      path: 'worker',
      match: {
        isWorkerActive: true
      },
      select: '_id firstName lastName email',
    })
    .populate({
      path: 'shift',
      match: {
        isShiftActive: true
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
};

/**
 * Create a new plan, worker cannot have more than 1 shift a day 
 * URL: /v1/plan
 * METHOD: POST
 * REQUEST: {date, workerId, shiftId}
 * REPONSE: {
 *    id: string,
 *    date: string,
 *    shiftId: string,
 *    startHour: number,
 *    endHour: number,
 *    workerId: string,
 *    firstName: string,
 *    lastName: string,
 *    email: string,
 *    isWorkerActive: boolean,
 *    isShiftActive: boolean,
 * }
 */
const createPlan = (req: Request, res: Response, next: NextFunction) => {
  let { date, workerId, shiftId } = req.body;
  if (!Types.ObjectId.isValid(workerId))
    res.status(404).json({ message: "Worker id is not valid." });
  else if (!Types.ObjectId.isValid(shiftId))
    res.status(404).json({ message: "Shift id is not valid." });
  else {
    ShiftQuery
      .findOne({ _id: shiftId, isShiftActive: true })
      .then((shift: IShiftQuery) => {
        if (shift === null) return res.status(404).json("Shift does not exist.");
        WorkerQuery
          .findOne({ _id: workerId, isWorkerActive: true })
          .then((worker: IWorkerQuery) => {
            if (worker === null) return res.status(404).json({ message: "Worker does not exist." });
            PlanQuery
              .findOne({ date: new Date(date), worker: workerId, shift: { $ne: shiftId } })
              .then((plan: IPlanQuery) => {
                if (plan !== null)
                  return res.status(409).json({ message: "Worker already has a shift that day." });
                PlanQuery
                  .findOne({ date: new Date(date), shift: shiftId })
                  .then((plan: IPlanQuery) => {
                    if (plan !== null)
                      res.status(409).json({ message: "That shift is already taken." });
                    else
                      new PlanQuery({ date: new Date(date), shift: shiftId, worker: workerId })
                        .save()
                        .then((plan: IPlanQuery) => {
                          plan
                            .populate({
                              path: 'worker',
                              match: {
                                isWorkerActive: true
                              },
                              select: '_id firstName lastName email',
                            })
                            .then((plan: IPlanQuery) => {
                              plan
                                .populate({
                                  path: 'shift',
                                  match: {
                                    isShiftActive: true
                                  },
                                  select: '_id startHour endHour',
                                })
                                .then((plan: IPlanQuery) => {
                                  const shift = plan.shift;
                                  const worker = plan.worker;
                                  if (shift === null || shift instanceof Types.ObjectId)
                                    res.status(404).json({ message: "Shift does not populate." });
                                  else if (worker === null || worker instanceof Types.ObjectId)
                                    res.status(404).json({ message: "Worker does not populate." });
                                  else
                                    res.json({
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
                                })
                                .catch(next);
                            })
                            .catch(next);
                        })
                        .catch(next);
                  })
                  .catch(next);
              })
              .catch(next);
          })
          .catch(next);
      })
      .catch(next);
  }
}

/**
 * Replace an existing plan to a new plan, worker cannot have more than 1 shift a day 
 * URL: /v1/plan
 * METHOD: PUT
 * REQUEST: {date, workerId, shiftId}
 * REPONSE: {
 *    id: string,
 *    date: string,
 *    shiftId: string,
 *    startHour: number,
 *    endHour: number,
 *    workerId: string,
 *    firstName: string,
 *    lastName: string,
 *    email: string,
 *    isWorkerActive: boolean,
 *    isShiftActive: boolean,
 * }
 */
const replacePlan = (req: Request, res: Response, next: NextFunction) => {
  let { date, workerId, shiftId } = req.body;
  if (!Types.ObjectId.isValid(workerId))
    res.status(404).json({ message: "Worker id is not valid." });
  else if (!Types.ObjectId.isValid(shiftId))
    res.status(404).json({ message: "Shift id is not valid." });
  else {
    ShiftQuery
      .findOne({ _id: shiftId, isShiftActive: true })
      .then((shift: IShiftQuery) => {
        if (shift === null) return res.status(404).json("Shift does not exist.");
        WorkerQuery
          .findOne({ _id: workerId, isWorkerActive: true })
          .then((worker: IWorkerQuery) => {
            if (worker === null) return res.status(404).json({ message: "Worker does not exist." });
            PlanQuery
              .findOne({ date: new Date(date), worker: workerId, shift: { $ne: shiftId } })
              .then((plan: IPlanQuery) => {
                if (plan !== null)
                  return res.status(409).json({ message: "Worker already has a shift that day." });
                PlanQuery
                  .findOne({ date: new Date(date), shift: shiftId, worker: workerId })
                  .then((plan: IPlanQuery) => {
                    if (plan !== null) return res.status(409).json({ message: "Worker alreadt has the shift that day." });
                    PlanQuery
                      .findOneAndUpdate({ date: new Date(date), shift: shiftId }, { worker: workerId })
                      .then((plan: IPlanQuery) => {
                        if (plan !== null)
                          plan
                            .populate({
                              path: 'worker',
                              match: {
                                isWorkerActive: true
                              },
                              select: '_id firstName lastName email',
                            })
                            .then((plan: IPlanQuery) => {
                              plan
                                .populate({
                                  path: 'shift',
                                  match: {
                                    isShiftActive: true
                                  },
                                  select: '_id startHour endHour',
                                })
                                .then((plan: IPlanQuery) => {
                                  const shift = plan.shift;
                                  const worker = plan.worker;
                                  if (shift === null || shift instanceof Types.ObjectId)
                                    res.status(404).json({ message: "Shift does not populate." });
                                  else if (worker === null || worker instanceof Types.ObjectId)
                                    res.status(404).json({ message: "Worker does not populate." });
                                  else
                                    res.json({
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
                                })
                                .catch(next);
                            })
                            .catch();
                        else
                          new PlanQuery({
                            date: new Date(date),
                            worker: workerId,
                            shift: shiftId,
                          })
                            .save()
                            .then((plan: IPlanQuery) => {
                              plan
                                .populate({
                                  path: 'worker',
                                  match: {
                                    isWorkerActive: true
                                  },
                                  select: '_id firstName lastName email',
                                })
                                .then((plan: IPlanQuery) => {
                                  plan
                                    .populate({
                                      path: 'shift',
                                      match: {
                                        isShiftActive: true
                                      },
                                      select: '_id startHour endHour',
                                    })
                                    .then((plan: IPlanQuery) => {
                                      const shift = plan.shift;
                                      const worker = plan.worker;
                                      if (shift === null || shift instanceof Types.ObjectId)
                                        res.status(404).json({ message: "Shift does not populate." });
                                      else if (worker === null || worker instanceof Types.ObjectId)
                                        res.status(404).json({ message: "Worker does not populate." });
                                      else
                                        res.json({
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
                                    })
                                    .catch(next);
                                })
                                .catch(next);
                            })
                            .catch(next);
                      })
                      .catch(next);
                  })
                  .catch(next);
              })
              .catch(next);
          })
          .catch(next);
      })
      .catch(next);
  }
}

/**
 * Delete all plans
 * URL: /v1/plan
 * METHOD: DELETE
 * REQUEST: {}
 * REPONSE: {{message: "Successfully deleted all plans."}}
 */
const deleteAllPlans = (req: Request, res: Response, next: NextFunction) => {
  PlanQuery
    .remove()
    .then(() => {
      res.json({ message: "Successfully deleted all plans." });
    })
    .catch(next);
}

/**
 * Get plan by id
 * URL: /v1/plan/:planId
 * METHOD: GET
 * REQUEST: {}
 * REPONSE: {
 *    id: string,
 *    date: string,
 *    shiftId: string,
 *    startHour: number,
 *    endHour: number,
 *    workerId: string,
 *    firstName: string,
 *    lastName: string,
 *    email: string,
 *    isWorkerActive: boolean,
 *    isShiftActive: boolean,
 * }
 */
const getPlan = (req: Request, res: Response, next: NextFunction) => {
  let { planId } = req.params;
  if (!Types.ObjectId.isValid(planId)) return res.status(404).json({ message: "Plan id is not valid." });
  PlanQuery
    .findById(new Types.ObjectId(planId))
    .populate({
      path: 'worker',
      match: {
        isWorkerActive: true
      },
      select: '_id firstName lastName email',
    })
    .populate({
      path: 'shift',
      match: {
        isShiftActive: true
      },
      select: '_id startHour endHour',
    })
    .then((plan: IPlanQuery) => {
      const shift = plan.shift;
      const worker = plan.worker;
      if (shift === null || shift instanceof Types.ObjectId)
        res.status(404).json({ message: "Shift does not populate." });
      else if (worker === null || worker instanceof Types.ObjectId)
        res.status(404).json({ message: "Worker does not populate." });
      else
        res.json({
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
    })
    .catch(next);
}

/**
 * Delete a plan by id
 * URL: /v1/plan/:planId
 * METHOD: DELETE
 * REQUEST: {}
 * REPONSE: {{message: "Successfully deleted."}}
 */
const deletePlan = (req: Request, res: Response, next: NextFunction) => {
  let { planId } = req.params;
  if (!Types.ObjectId.isValid(planId)) return res.status(404).json({ message: "Plan id is not valid." });
  PlanQuery
    .deleteOne({ _id: planId })
    .then(() => {
      res.json({ message: "Successfully deleted." });
    })
    .catch(next);
}

export {
  plansList,
  createPlan,
  replacePlan,
  deleteAllPlans,
  getPlan,
  deletePlan,
};