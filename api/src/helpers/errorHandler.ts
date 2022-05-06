import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

// handle not found errors
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(httpStatus.NOT_FOUND);
};

// handle internal server errors
export const internalServerError = (err: ServerError | any, req: Request, res: Response) => {
  if (err._type === 'ServerError') {
    res
      .status(err.status || httpStatus.INTERNAL_SERVER_ERROR)
      .json({
        message: err.message,
        error: err.error,
      })
      .end();
  } else {
    try {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: httpStatus['500_MESSAGE'],
          error: JSON.stringify(err),
        })
        .end();
    } catch (e) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: httpStatus['500_MESSAGE'],
        })
        .end();
    }
  }
};

// eslint-disable-next-line
export interface ServerError {
  message: string;
  status?: number;
  error?: any;
}

export class ServerError {
  // eslint-disable-next-line
  public readonly _type? = 'ServerError';
  constructor(err: ServerError) {
    this.message = err.message;
    this.status = err.status;
    this.error = err.error;
  }
}

export const errorHandler = {
  notFound,
  internalServerError,
};
