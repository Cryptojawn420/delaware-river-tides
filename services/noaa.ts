import type { TideStation } from '@/constants/stations';

const NOAA_BASE_URL = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';

type NoaaPrediction = {
  t: string;
  v?: string;
  type: 'H' | 'L';
};

type NoaaResponse = {
  predictions?: NoaaPrediction[];
  error?: {
    message?: string;
  };
};

export type TideType = 'H' | 'L';

export type TidePrediction = {
  id: string;
  stationId: string;
  stationName: string;
  dateKey: string;
  time: Date;
  heightFeet?: number;
  type: TideType;
};

export type NextTides = {
  nextHigh?: TidePrediction;
  nextLow?: TidePrediction;
};

export function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getNoaaDateParam(date: Date) {
  return getLocalDateKey(date).replace(/-/g, '');
}

export function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function getTodayAndTomorrowKeys(now = new Date()) {
  return {
    todayKey: getLocalDateKey(now),
    tomorrowKey: getLocalDateKey(addDays(now, 1)),
  };
}

export async function fetchTidePredictions(
  station: TideStation,
  beginDate: Date,
  endDate: Date,
) {
  const params = new URLSearchParams({
    product: 'predictions',
    interval: 'hilo',
    datum: 'MLLW',
    units: 'english',
    time_zone: 'lst_ldt',
    format: 'json',
    station: station.id,
    begin_date: getNoaaDateParam(beginDate),
    end_date: getNoaaDateParam(endDate),
    application: 'jersey_tides_mobile',
  });

  const response = await fetch(`${NOAA_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`NOAA request failed with status ${response.status}`);
  }

  const data = (await response.json()) as NoaaResponse;

  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  if (!Array.isArray(data.predictions)) {
    throw new Error('NOAA did not return tide predictions for this station.');
  }

  return data.predictions
    .map((prediction) => toTidePrediction(prediction, station))
    .sort((left, right) => left.time.getTime() - right.time.getTime());
}

export async function fetchUpcomingTides(station: TideStation, daysAhead = 2) {
  const today = new Date();

  return fetchTidePredictions(station, today, addDays(today, daysAhead));
}

export async function fetchTodayAndTomorrowTides(station: TideStation) {
  const today = new Date();

  return fetchTidePredictions(station, today, addDays(today, 1));
}

export function getNextTides(predictions: TidePrediction[], now = new Date()): NextTides {
  const upcoming = predictions.filter((prediction) => prediction.time.getTime() >= now.getTime());

  return {
    nextHigh: upcoming.find((prediction) => prediction.type === 'H'),
    nextLow: upcoming.find((prediction) => prediction.type === 'L'),
  };
}

export function filterTidesByDate(predictions: TidePrediction[], dateKey: string) {
  return predictions.filter((prediction) => prediction.dateKey === dateKey);
}

function toTidePrediction(prediction: NoaaPrediction, station: TideStation): TidePrediction {
  const time = parseNoaaLocalDateTime(prediction.t);

  return {
    id: `${station.id}-${prediction.t}-${prediction.type}`,
    stationId: station.id,
    stationName: station.name,
    dateKey: getLocalDateKey(time),
    time,
    heightFeet: prediction.v === undefined ? undefined : Number(prediction.v),
    type: prediction.type,
  };
}

function parseNoaaLocalDateTime(value: string) {
  const [datePart, timePart] = value.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  return new Date(year, month - 1, day, hour, minute);
}
