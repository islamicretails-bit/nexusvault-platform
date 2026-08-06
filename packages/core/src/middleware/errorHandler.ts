import { NextFunction, Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

const logger = new Logger('Error Middleware');

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof HttpException) {
    const status = error.getStatus();
    const message = error.message;
    logger.error(`HTTP Exception: ${status} - ${message}`);
    res.status(status).json({ message });
  } else {
    logger.error('Internal Server Error:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new HttpException('Not Found', HttpStatus.NOT_FOUND);
  errorHandler(error, req, res, next);
}

export function methodNotAllowedHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = new HttpException('Method Not Allowed', HttpStatus.METHOD_NOT_ALLOWED);
  errorHandler(error, req, res, next);
}