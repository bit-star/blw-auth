import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuthLog, NewAuthLog } from '../auth-log.model';

export type PartialUpdateAuthLog = Partial<IAuthLog> & Pick<IAuthLog, 'id'>;

type RestOf<T extends IAuthLog | NewAuthLog> = Omit<T, 'pointOfTime'> & {
  pointOfTime?: string | null;
};

export type RestAuthLog = RestOf<IAuthLog>;

export type NewRestAuthLog = RestOf<NewAuthLog>;

export type PartialUpdateRestAuthLog = RestOf<PartialUpdateAuthLog>;

export type EntityResponseType = HttpResponse<IAuthLog>;
export type EntityArrayResponseType = HttpResponse<IAuthLog[]>;

@Injectable({ providedIn: 'root' })
export class AuthLogService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/auth-logs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(authLog: NewAuthLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(authLog);
    return this.http
      .post<RestAuthLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(authLog: IAuthLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(authLog);
    return this.http
      .put<RestAuthLog>(`${this.resourceUrl}/${this.getAuthLogIdentifier(authLog)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(authLog: PartialUpdateAuthLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(authLog);
    return this.http
      .patch<RestAuthLog>(`${this.resourceUrl}/${this.getAuthLogIdentifier(authLog)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAuthLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAuthLog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAuthLogIdentifier(authLog: Pick<IAuthLog, 'id'>): number {
    return authLog.id;
  }

  compareAuthLog(o1: Pick<IAuthLog, 'id'> | null, o2: Pick<IAuthLog, 'id'> | null): boolean {
    return o1 && o2 ? this.getAuthLogIdentifier(o1) === this.getAuthLogIdentifier(o2) : o1 === o2;
  }

  addAuthLogToCollectionIfMissing<Type extends Pick<IAuthLog, 'id'>>(
    authLogCollection: Type[],
    ...authLogsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const authLogs: Type[] = authLogsToCheck.filter(isPresent);
    if (authLogs.length > 0) {
      const authLogCollectionIdentifiers = authLogCollection.map(authLogItem => this.getAuthLogIdentifier(authLogItem)!);
      const authLogsToAdd = authLogs.filter(authLogItem => {
        const authLogIdentifier = this.getAuthLogIdentifier(authLogItem);
        if (authLogCollectionIdentifiers.includes(authLogIdentifier)) {
          return false;
        }
        authLogCollectionIdentifiers.push(authLogIdentifier);
        return true;
      });
      return [...authLogsToAdd, ...authLogCollection];
    }
    return authLogCollection;
  }

  protected convertDateFromClient<T extends IAuthLog | NewAuthLog | PartialUpdateAuthLog>(authLog: T): RestOf<T> {
    return {
      ...authLog,
      pointOfTime: authLog.pointOfTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAuthLog: RestAuthLog): IAuthLog {
    return {
      ...restAuthLog,
      pointOfTime: restAuthLog.pointOfTime ? dayjs(restAuthLog.pointOfTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAuthLog>): HttpResponse<IAuthLog> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAuthLog[]>): HttpResponse<IAuthLog[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
