import { NextFunction, Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

const logger = new Logger('Error Middleware');

export function errorHandlerMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';

  logger.error(`Error ${status}: ${message}`, error.stack);

  res.status(status).json({
    error: {
      status,
      message,
    },
  });
}

export function notFoundHandlerMiddleware(req: Request, res: Response, next: NextFunction) {
  const error = new HttpException('Not Found', HttpStatus.NOT_FOUND);
  errorHandlerMiddleware(error, req, res, next);
}