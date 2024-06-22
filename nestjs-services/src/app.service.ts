import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'tt, from cdk-nestjs-lambda';
  }
}
