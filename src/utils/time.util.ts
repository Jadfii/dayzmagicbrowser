import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Server, ServerTimeAcceleration, ServerTimeDuration, ServerTime } from '../types/Types';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const HOUR_IN_MS = 3600000;
const MINUTE_IN_MS = HOUR_IN_MS / 60;

// Get duration from time in ms
export const getDuration = (time: number): string => dayjs.duration(time, 'ms').humanize();

// Creates a Date object from a '00:00' time string
export const getDateFromTime = (time: string, isTomorrow?: boolean): Date => new Date(`0${isTomorrow ? '2' : '1'} Jan 1970 ${time}:00 GMT`);

// Gets the server time duration in real time in ms
export const getServerTimeDuration = (timeAcceleration: ServerTimeAcceleration): ServerTimeDuration => ({
  day: Math.floor((12 / timeAcceleration.day) * 60000 * 60),
  night: Math.floor((12 / timeAcceleration.day / timeAcceleration.night) * 60000 * 60),
});

// Returns humanized server time duration in real time
// timeDuration should be ms
export const getHumanizedTimeDuration = (timeDuration: number): string => dayjs.duration(timeDuration, 'ms').humanize();

const getTimeOfDay = (date: Date): ServerTime => {
  // Get Date objects for each time
  const sunriseDate = getDateFromTime(ServerTime.SUNRISE);
  const dayDate = getDateFromTime(ServerTime.DAY);
  const sunsetDate = getDateFromTime(ServerTime.SUNSET);
  const nightDate = getDateFromTime(ServerTime.NIGHT);

  // Check if date is between each times
  if (date.getTime() >= sunriseDate.getTime() && date.getTime() <= dayDate.getTime()) {
    return ServerTime.SUNRISE;
  } else if (date.getTime() >= dayDate.getTime() && date.getTime() <= sunsetDate.getTime()) {
    return ServerTime.DAY;
  } else if (date.getTime() >= sunsetDate.getTime() && date.getTime() <= nightDate.getTime()) {
    return ServerTime.SUNSET;
  } else {
    return ServerTime.NIGHT;
  }
};

export const getServerTimeOfDay = (time: string): ServerTime => getTimeOfDay(getDateFromTime(time));

// Returns duration in ms
const getServerDuration = (startDate: Date, endDate: Date, timeAcceleration: ServerTimeAcceleration): number => {
  const startDateTime = startDate.getTime();
  const endDateTime = endDate.getTime();

  let serverDuration = 0;

  // Get number of minutes between end and start date
  const durationMinutes = dayjs.duration(dayjs(endDateTime).diff(startDateTime)).asMinutes();

  // Loop number of minutes
  // We want to be able to manipulate each minute but the time acceleration at that minute
  for (let i = 0; i < durationMinutes; i++) {
    const timeOfDay = getTimeOfDay(new Date(startDateTime + i * MINUTE_IN_MS));

    // Add the modifier minute in ms to our total duration
    serverDuration += MINUTE_IN_MS / timeAcceleration.day / (timeOfDay !== ServerTime.DAY ? timeAcceleration.night : 1);
  }

  return serverDuration;
};

// Get humanized duration until specified time in relative server time
export const getServerTimeUntil = (server: Server, until: ServerTime): string => {
  const serverTimeOfDay = getServerTimeOfDay(server.time);
  const serverDate = getDateFromTime(server.time);

  let isTomorrow = false;
  if (until === ServerTime.SUNRISE) {
    isTomorrow = true;
  } else if (until === ServerTime.DAY && serverTimeOfDay !== ServerTime.SUNRISE && serverTimeOfDay !== ServerTime.NIGHT) {
    isTomorrow = true;
  }

  const untilDate = getDateFromTime(until, isTomorrow);

  const timeLeft = getServerDuration(serverDate, untilDate, server.timeAcceleration);

  return dayjs.duration(timeLeft, 'ms').humanize();
};
