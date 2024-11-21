import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let message: string;
    let errors: any = null;

    const rawErrors: ValidationError[] = exception.getResponse()['message'];

    if (Array.isArray(rawErrors) && rawErrors.length > 0) {
      errors = this.buildError(rawErrors);
      message =
        'Permintaan tidak valid. Mohon periksa data yang Anda kirimkan.';
    } else {
      message = exception.message || 'Internal server error';
    }

    response.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: status,
      message: message,
      errors: errors,
      timestamp: new Date().toISOString(),
      constructor: exception.constructor.name,
      path: request.url,
    });
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
