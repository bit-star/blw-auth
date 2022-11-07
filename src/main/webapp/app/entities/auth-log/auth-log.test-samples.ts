import dayjs from 'dayjs/esm';

import { AuthStatus } from 'app/entities/enumerations/auth-status.model';

import { IAuthLog, NewAuthLog } from './auth-log.model';

export const sampleWithRequiredData: IAuthLog = {
  id: 96861,
};

export const sampleWithPartialData: IAuthLog = {
  id: 48176,
  userId: 'Chips Manager',
  pointOfTime: dayjs('2022-11-06T15:36'),
  status: AuthStatus['Successs'],
};

export const sampleWithFullData: IAuthLog = {
  id: 78112,
  userId: 'Intelligent Account parsing',
  encryptedUserid: 'Shoes Accounts Berkshire',
  pointOfTime: dayjs('2022-11-06T20:18'),
  status: AuthStatus['Successs'],
};

export const sampleWithNewData: NewAuthLog = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
