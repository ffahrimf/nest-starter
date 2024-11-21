import { Injectable } from '@nestjs/common';

@Injectable()
export class Response {
  success(data: any, message: string = 'Success'): ApiResponse {
    return {
      success: true,
      message,
      data,
    };
  }
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
