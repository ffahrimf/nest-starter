import { format, toZonedTime, toDate } from 'date-fns-tz';
import { addSeconds } from 'date-fns';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class Common {
  async getCurrentDateTimeInTimeZonePlusSeconds(
    timeZone: string,
    secondsToAdd: number,
  ): Promise<Date> {
    const now = new Date();
    const zonedNow = toZonedTime(now, timeZone);
    const zonedNowPlusSeconds = addSeconds(zonedNow, secondsToAdd);
    return await zonedNowPlusSeconds;
  }

  async getDateNowByTimezone(timezone: string): Promise<Date> {
    const utcNow = new Date();
    const zonedNow = dayjs.tz(utcNow, timezone);

    const timezoneOffset = zonedNow.utcOffset();

    return await zonedNow.toDate();
  }

  async parseTime(time: string): Promise<number> {
    const parts = time.split(':').map((part) => parseInt(part, 10));
    return (await parts[0]) * 3600 + parts[1] * 60 + (parts[2] || 0);
  }
}
