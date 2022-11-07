import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILive, NewLive } from '../live.model';

export type PartialUpdateLive = Partial<ILive> & Pick<ILive, 'id'>;

type RestOf<T extends ILive | NewLive> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

export type RestLive = RestOf<ILive>;

export type NewRestLive = RestOf<NewLive>;

export type PartialUpdateRestLive = RestOf<PartialUpdateLive>;

export type EntityResponseType = HttpResponse<ILive>;
export type EntityArrayResponseType = HttpResponse<ILive[]>;

@Injectable({ providedIn: 'root' })
export class LiveService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lives');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(live: NewLive): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(live);
    return this.http.post<RestLive>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(live: ILive): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(live);
    return this.http
      .put<RestLive>(`${this.resourceUrl}/${this.getLiveIdentifier(live)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(live: PartialUpdateLive): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(live);
    return this.http
      .patch<RestLive>(`${this.resourceUrl}/${this.getLiveIdentifier(live)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLive>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLive[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLiveIdentifier(live: Pick<ILive, 'id'>): number {
    return live.id;
  }

  compareLive(o1: Pick<ILive, 'id'> | null, o2: Pick<ILive, 'id'> | null): boolean {
    return o1 && o2 ? this.getLiveIdentifier(o1) === this.getLiveIdentifier(o2) : o1 === o2;
  }

  addLiveToCollectionIfMissing<Type extends Pick<ILive, 'id'>>(
    liveCollection: Type[],
    ...livesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const lives: Type[] = livesToCheck.filter(isPresent);
    if (lives.length > 0) {
      const liveCollectionIdentifiers = liveCollection.map(liveItem => this.getLiveIdentifier(liveItem)!);
      const livesToAdd = lives.filter(liveItem => {
        const liveIdentifier = this.getLiveIdentifier(liveItem);
        if (liveCollectionIdentifiers.includes(liveIdentifier)) {
          return false;
        }
        liveCollectionIdentifiers.push(liveIdentifier);
        return true;
      });
      return [...livesToAdd, ...liveCollection];
    }
    return liveCollection;
  }

  protected convertDateFromClient<T extends ILive | NewLive | PartialUpdateLive>(live: T): RestOf<T> {
    return {
      ...live,
      startTime: live.startTime?.toJSON() ?? null,
      endTime: live.endTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLive: RestLive): ILive {
    return {
      ...restLive,
      startTime: restLive.startTime ? dayjs(restLive.startTime) : undefined,
      endTime: restLive.endTime ? dayjs(restLive.endTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLive>): HttpResponse<ILive> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLive[]>): HttpResponse<ILive[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
