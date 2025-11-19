import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (value === undefined || value === null) {
      return value;
    }

    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return value;
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const result = errors.reduce((acc, error) => {
        acc[error.property] = Object.values(error.constraints);
        return acc;
      }, {});

      throw new BadRequestException({
        message:
          'Permintaan tidak valid. Mohon periksa data yang Anda kirimkan.',
        errors: result,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
