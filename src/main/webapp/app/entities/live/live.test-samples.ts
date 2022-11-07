import dayjs from 'dayjs/esm';

import { ILive, NewLive } from './live.model';

export const sampleWithRequiredData: ILive = {
  id: 12240,
};

export const sampleWithPartialData: ILive = {
  id: 70704,
  name: 'portals incubate recontextualize',
};

export const sampleWithFullData: ILive = {
  id: 80597,
  name: 'Guatemala scalable Dynamic',
  polyvId: 'THX contextually-based blue',
  startTime: dayjs('2022-11-06T13:21'),
  endTime: dayjs('2022-11-06T10:02'),
};

export const sampleWithNewData: NewLive = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
