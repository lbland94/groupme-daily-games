import { FetchScoreboardRequest } from '@/types/requests/scoreboard/FetchScoreboardRequest';
import { Request, Response, Router } from 'express';
import { validate, ValidationError } from 'express-validation';
import Controller from './scoreboard.controller';
import routeCache from 'route-cache';

export const scoreboardRouter: Router = Router();
export const scoreboardController = new Controller();

// Sign In
scoreboardRouter.get(
  '',
  validate(FetchScoreboardRequest),
  routeCache.cacheSeconds(86400 / 4, (req: Request, res: Response) => {
    if (!req.query?.date) {
      return false;
    }
    return req.originalUrl;
  }),
  routeCache.cacheSeconds(30, (req: Request, res: Response) => {
    if (req.query?.date) {
      return false;
    }
    return req.originalUrl;
  }),
  scoreboardController.getDay,
);
scoreboardRouter.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});
