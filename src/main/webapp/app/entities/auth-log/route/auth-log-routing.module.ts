import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AuthLogComponent } from '../list/auth-log.component';
import { AuthLogDetailComponent } from '../detail/auth-log-detail.component';
import { AuthLogUpdateComponent } from '../update/auth-log-update.component';
import { AuthLogRoutingResolveService } from './auth-log-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const authLogRoute: Routes = [
  {
    path: '',
    component: AuthLogComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AuthLogDetailComponent,
    resolve: {
      authLog: AuthLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AuthLogUpdateComponent,
    resolve: {
      authLog: AuthLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AuthLogUpdateComponent,
    resolve: {
      authLog: AuthLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authLogRoute)],
  exports: [RouterModule],
})
export class AuthLogRoutingModule {}
