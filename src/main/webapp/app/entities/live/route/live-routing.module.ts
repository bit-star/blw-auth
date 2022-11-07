import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LiveComponent } from '../list/live.component';
import { LiveDetailComponent } from '../detail/live-detail.component';
import { LiveUpdateComponent } from '../update/live-update.component';
import { LiveRoutingResolveService } from './live-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const liveRoute: Routes = [
  {
    path: '',
    component: LiveComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LiveDetailComponent,
    resolve: {
      live: LiveRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LiveUpdateComponent,
    resolve: {
      live: LiveRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LiveUpdateComponent,
    resolve: {
      live: LiveRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(liveRoute)],
  exports: [RouterModule],
})
export class LiveRoutingModule {}
