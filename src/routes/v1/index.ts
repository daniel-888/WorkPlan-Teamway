import { Router, Request, Response, NextFunction } from 'express';
import { workerRouter, workerRouterWorkerId } from './worker';
// import shiftRouter from './shift';
// import planRouter from './plan';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ msg: 'This is router v1.' })
});

router.get('/worker/:workerId', (req, res) => {
  console.log(req.params);
  res.json(req.params)
});

router.use('/worker', workerRouter);

// router.use('/shift', shiftRouter);

// router.use('/plan', planRouter);

export default router;