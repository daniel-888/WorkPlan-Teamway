import { Request, Response, NextFunction } from "express";
import ShiftQuery, { IShiftQuery } from "../models/shift";
import { Types } from "mongoose";

/**
 * Get the whole list of active shifts 
 * URL: /v1/shift
 * METHOD: GET
 * REQUEST: {}
 * REPONSE: Array (
 *  {
 *    id: string,
 *    startHour: number,
 *    endHour: number,
 *    isShiftActive: boolean
 *  }
 * )
 */
const shiftsList = (req: Request, res: Response, next: NextFunction) => {
  ShiftQuery
    .find({ isShiftActive: true })
    .then((shifts: IShiftQuery[]) => {
      res.json(shifts.map((shift: IShiftQuery) => {
        return {
          id: shift._id,
          startHour: shift.startHour,
          endHour: shift.endHour,
          isShiftActive: shift.isShiftActive,
        }
      }));
    })
    .catch(next);
};

/**
 * Get the whole list of inactive shifts 
 * URL: /v1/shift/inactive
 * METHOD: GET
 * REQUEST: {}
 * REPONSE: Array (
 *  {
 *    id: string,
 *    startHour: number,
 *    endHour: number,
 *    isShiftActive: boolean
 *  }
 * )
 */
const getInactiveShifts = (req: Request, res: Response, next: NextFunction) => {
  ShiftQuery
    .find({ isShiftActive: false })
    .then((shifts: IShiftQuery[]) => {
      res.json(shifts.map((shift: IShiftQuery) => {
        return {
          id: shift._id,
          startHour: shift.startHour,
          endHour: shift.endHour,
          isShiftActive: shift.isShiftActive,
        }
      }));
    })
    .catch(next);
}

/**
 * Get the shift by id 
 * URL: /v1/shift/:shiftId
 * METHOD: GET
 * REQUEST: {}
 * REPONSE: {
 *    id: string,
 *    startHour: number,
 *    endHour: number,
 *    isShiftActive: boolean
 * }
 */
const getShift = (req: Request, res: Response, next: NextFunction) => {
  let { shiftId } = req.params;
  if (!Types.ObjectId.isValid(shiftId))
    res.status(404).json({ message: "Shift id is not valid" });
  else
    ShiftQuery
      .findById(new Types.ObjectId(shiftId))
      .then((shift: IShiftQuery) => {
        if (shift === null)
          res.status(404).json({ message: "Shift not found" });
        else
          res.json({
            id: shift._id,
            startHour: shift.startHour,
            endhour: shift.endHour,
            isShiftActive: shift.isShiftActive,
          });
      })
      .catch(next);
};

/**
 * Create a shift
 * URL: /v1/shift/:shiftId
 * METHOD: POST
 * REQUEST: { startHour: number, endHour: number }
 * REPONSE: {
 *    id: string,
 *    startHour: number,
 *    endHour: number,
 *    isShiftActive: boolean
 * }
 */
const createShift = (req: Request, res: Response, next: NextFunction) => {
  let { startHour, endHour } = req.body;
  ShiftQuery
    .findOne({ startHour, endHour })
    .then((shift: IShiftQuery) => {
      if (shift !== null)
        res.status(409).json({ message: "Same shift already exists." });
      else
        new ShiftQuery({ startHour, endHour, isShiftActive: true })
          .save()
          .then((shift: IShiftQuery) => {
            res.json({
              id: shift._id,
              startHour: shift.startHour,
              endHour: shift.endHour,
              isShiftActive: shift.isShiftActive,
            })
          })
          .catch(next);
    });
};

/**
 * Update a shift
 * URL: /v1/shift/:shiftId
 * METHOD: PATCH
 * REQUEST: { startHour: number, endHour: number }
 * REPONSE: {
 *    id: string,
 *    startHour: number,
 *    endHour: number,
 *    isShiftActive: boolean
 * }
 */
const updateShift = (req: Request, res: Response, next: NextFunction) => {
  let { shiftId } = req.params;
  let { startHour, endHour } = req.body;
  if (!Types.ObjectId.isValid(shiftId))
    res.status(404).json({ message: "Shift id is not valid." });
  else
    ShiftQuery
      .findOneAndUpdate({ _id: new Types.ObjectId(shiftId), isShiftActive: true }, { startHour, endHour })
      .then((shift: IShiftQuery) => {
        if (shift === null)
          res.status(404).json({ message: "Shift not found." });
        else
          res.json({
            id: shift._id,
            startHour: shift.startHour,
            endHour: shift.endHour,
            isShiftActive: shift.isShiftActive,
          });
      })
      .catch(next);
};

/**
 * Delete all shifts
 * URL: /v1/shift
 * METHOD: DELETE
 * REQUEST: {}
 * REPONSE: {{message: "Successfully deleted all shifts."}}
 */
const deleteAllShifts = (req: Request, res: Response, next: NextFunction) => {
  ShiftQuery
    .updateMany({ isShiftActive: true }, { isShiftActive: false })
    .then(() => {
      res.json({ message: "Successfully deleted all shifts." });
    })
    .catch(next);
};

/**
 * Delete a shift by id
 * URL: /v1/shift/:shiftId
 * METHOD: DELETE
 * REQUEST: {}
 * REPONSE: {{message: "Successfully deleted."}}
 */
const deleteShift = (req: Request, res: Response, next: NextFunction) => {
  let { shiftId } = req.params;
  if (!Types.ObjectId.isValid(shiftId))
    res.status(404).json({ message: "Shift id is not valid." });
  else
    ShiftQuery
      .findOneAndUpdate({ _id: new Types.ObjectId(shiftId), isShiftActive: true }, { isShiftActive: false })
      .then((shift: IShiftQuery) => {
        if (shift === null)
          res.status(404).json({ message: "Shift is not found." });
        else
          res.json({ message: "Successfully deleted." });
      })
      .catch(next);
};

export {
  shiftsList,
  createShift,
  deleteAllShifts,
  getShift,
  updateShift,
  deleteShift,
  getInactiveShifts,
};