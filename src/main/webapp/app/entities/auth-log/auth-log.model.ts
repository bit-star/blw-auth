import dayjs from 'dayjs/esm';
import { ILive } from 'app/entities/live/live.model';
import { AuthStatus } from 'app/entities/enumerations/auth-status.model';

export interface IAuthLog {
  id: number;
  userId?: string | null;
  encryptedUserid?: string | null;
  pointOfTime?: dayjs.Dayjs | null;
  status?: AuthStatus | null;
  live?: Pick<ILive, 'id'> | null;
}

export type NewAuthLog = Omit<IAuthLog, 'id'> & { id: null };
