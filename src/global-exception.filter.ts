import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import logger from './logger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    let errors: any = null;

    if (exception instanceof HttpException) {
      const rawErrors: any = exception.getResponse()['message'];
      if (Array.isArray(rawErrors) && rawErrors.length > 0) {
        errors = this.buildError(rawErrors);
        message =
          'Permintaan tidak valid. Mohon periksa data yang Anda kirimkan.';
      } else {
        message = exception.message || 'Internal server error';
      }
    } else {
      message = exception.message || 'Internal server error';
    }

    const errorResponse = {
      statusCode: status,
      message: message,
      errors: errors,
      timestamp: new Date().toISOString(),
      constructor: exception.constructor.name,
      path: request.url,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      logger.error(
        `Error ${status}: ${request.method} ${request.url} - ${exception instanceof Error ? exception.message : ''}`,
        { stack: exception instanceof Error ? exception.stack : '' },
      );
    }

    response.status(status).json(errorResponse);
  }

  private buildError(errors: any[]) {
    const result = {};
    errors.forEach((err) => {
      const prop = err.property;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(err.constraints).forEach(([key, value]) => {
        if (!result[prop]) {
          result[prop] = [];
        }
        result[prop].push(value);
      });
    });
    return result;
  }
}
