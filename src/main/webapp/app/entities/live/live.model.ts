import dayjs from 'dayjs/esm';

export interface ILive {
  id: number;
  name?: string | null;
  polyvId?: string | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
}

export type NewLive = Omit<ILive, 'id'> & { id: null };
