import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILive } from '../live.model';
import { LiveService } from '../service/live.service';

@Injectable({ providedIn: 'root' })
export class LiveRoutingResolveService implements Resolve<ILive | null> {
  constructor(protected service: LiveService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILive | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((live: HttpResponse<ILive>) => {
          if (live.body) {
            return of(live.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
