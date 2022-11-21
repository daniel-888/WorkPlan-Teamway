import { Request, Response, NextFunction } from "express";
import WorkerQuery, { IWorkerQuery } from "../models/worker";
import { Types } from "mongoose";

/**
 * Get the whole list of active workers 
 * URL: /v1/worker
 * METHOD: GET
 * REQUEST: {}
 * REPONSE: Array (
 *  {
 *    id: string,
 *    firstName: string,
 *    lastName: string,
 *    email: string<email>,
 *    createDate: string<Date>,
 *    isWorkerActive: boolean
 *  }
 * )
 */
const workersList = (req: Request, res: Response, next: NextFunction) => {
  WorkerQuery.find({ isWorkerActive: true })
    .sort({ createDate: -1 })
    .then((workers: IWorkerQuery[]) => {
      res.json(workers.map((worker: IWorkerQuery) => {
        return {
          id: worker._id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          email: worker.email,
          createDate: worker.createDate,
          isWorkerActive: worker.isWorkerActive,
        }
      }));
    })
    .catch(next);
};

/**
 * Get the whole list of inactive workers 
 * URL: /v1/worker/inactive
 * METHOD: GET
 * REQUEST: {}
 * REPONSE: Array (
 *  {
 *    id: string,
 *    firstName: string,
 *    lastName: string,
 *    email: string<email>,
 *    createDate: string<Date>,
 *    isWorkerActive: boolean
 *  }
 * )
 */
const getInactiveWorkers = (req: Request, res: Response, next: NextFunction) => {
  WorkerQuery.find({ isWorkerActive: false })
    .sort({ createDate: -1 })
    .then((workers: IWorkerQuery[]) => {
      res.json(workers.map((worker: IWorkerQuery) => {
        return {
          id: worker._id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          email: worker.email,
          createDate: worker.createDate,
          isWorkerActive: worker.isWorkerActive,
        }
      }));
    })
    .catch(next);
};

/**
 * Get a worker by id 
 * URL: /v1/worker/:workerId
 * METHOD: GET
 * REQUEST: {}
 * REPONSE: {
 *    id: string,
 *    firstName: string,
 *    lastName: string,
 *    email: string<email>,
 *    createDate: string<Date>,
 *    isWorkerActive: boolean
 * }
 */
const getWorker = (req: Request, res: Response, next: NextFunction) => {
  console.log("req.params = ", req.params);
  if (!Types.ObjectId.isValid(req.params.workerId))
    res.status(404).json({ message: "Worker id is not valid." });
  else
    WorkerQuery.findOne({ _id: new Types.ObjectId(req.params.workerId), isWorkerActive: true })
      .sort({ createDate: -1 })
      .then((worker: IWorkerQuery) => {
        if (worker === null)
          res.status(404).json({ message: "Worker not found." });
        else
          res.json({
            id: worker._id,
            firstName: worker.firstName,
            lastName: worker.lastName,
            email: worker.email,
            createDate: worker.createDate,
            isWorkerActive: worker.isWorkerActive,
          })
      })
      .catch(next);
};

/**
 * Create a worker
 * URL: /v1/worker
 * METHOD: POST
 * REQUEST: { firstName: string, lastName: string, email: string }
 * REPONSE: {
 *    id: string,
 *    firstName: string,
 *    lastName: string,
 *    email: string<email>,
 *    createDate: string<Date>,
 *    isWorkerActive: boolean
 * }
 */
const createWorker = (req: Request, res: Response, next: NextFunction) => {
  let { firstName, lastName, email } = req.body;
  WorkerQuery
    .findOne({ email })
    .then((worker: IWorkerQuery) => {
      if (worker !== null)
        res.status(409).json({ message: "Worker email already taken." });
      else
        new WorkerQuery({ firstName, lastName, email, createDate: new Date(), isWorkerActive: true })
          .save()
          .then((worker: IWorkerQuery) => {
            res.json({
              id: worker._id,
              firstName: worker.firstName,
              lastName: worker.lastName,
              email: worker.email,
              createDate: worker.createDate,
              isWorkerActive: worker.isWorkerActive,
            })
          });
    })
    .catch(next);
}

/**
 * Upate a worker's data
 * URL: /v1/worker/:workerId
 * METHOD: PATCH
 * REQUEST: { firstName: string, lastName: string, email: string }
 * REPONSE: {
 *    id: string,
 *    firstName: string,
 *    lastName: string,
 *    email: string<email>,
 *    createDate: string<Date>,
 *    isWorkerActive: boolean
 * }
 */
const updateWorker = (req: Request, res: Response, next: NextFunction) => {
  let { workerId } = req.params;
  let { firstName, lastName, email } = req.body;
  if (!Types.ObjectId.isValid(workerId))
    res.status(404).json({ message: "Worker id is not valid." });
  else
    WorkerQuery
      .findOneAndUpdate({ _id: new Types.ObjectId(workerId) }, { firstName, lastName, email })
      .then((worker: IWorkerQuery) => {
        if (worker === null)
          res.status(404).json({ message: "Worker is not found" });
        else
          res.json({
            id: worker._id,
            firstName,
            lastName,
            email,
            createDate: worker.createDate,
            isWorkerActive: worker.isWorkerActive,
          })
      })
      .catch(next);
}

/**
 * Delete all workers (make active workers inactive)
 * URL: /v1/worker
 * METHOD: DELETE
 * REQUEST: {}
 * REPONSE: {"Deleted all workers"}
 */
const deleteAllWorkers = (req: Request, res: Response, next: NextFunction) => {
  WorkerQuery
    .updateMany({ isWorkerActive: true }, { isWorkerActive: false })
    .then(() => {
      res.json("Deleted all workers");
    })
    .catch(next);
}

/**
 * Delete all workers (make active workers inactive)
 * URL: /v1/worker/:workerId
 * METHOD: DELETE
 * REQUEST: {}
 * REPONSE: {"Seccussfully deleted worker."}
 */
const deleteWorker = (req: Request, res: Response, next: NextFunction) => {
  let { workerId } = req.params;
  if (!Types.ObjectId.isValid(workerId))
    res.status(404).json({ message: "Worker id is not valid." });
  else
    WorkerQuery
      .findOneAndUpdate(
        { _id: new Types.ObjectId(workerId), isWorkerActive: true },
        { isWorkerActive: false }
      )
      .then((worker: IWorkerQuery) => {
        if (worker === null)
          res.status(404).json({ message: "Worker is not found" });
        else
          res.json({ message: "Seccussfully deleted worker." });
      })
      .catch(next);
}

export {
  workersList,
  createWorker,
  deleteAllWorkers,
  getWorker,
  updateWorker,
  deleteWorker,
  getInactiveWorkers,
};