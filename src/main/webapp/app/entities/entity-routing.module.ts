import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'live',
        data: { pageTitle: 'blwAuthApp.live.home.title' },
        loadChildren: () => import('./live/live.module').then(m => m.LiveModule),
      },
      {
        path: 'auth-log',
        data: { pageTitle: 'blwAuthApp.authLog.home.title' },
        loadChildren: () => import('./auth-log/auth-log.module').then(m => m.AuthLogModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
