import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LiveComponent } from './list/live.component';
import { LiveDetailComponent } from './detail/live-detail.component';
import { LiveUpdateComponent } from './update/live-update.component';
import { LiveDeleteDialogComponent } from './delete/live-delete-dialog.component';
import { LiveRoutingModule } from './route/live-routing.module';

@NgModule({
  imports: [SharedModule, LiveRoutingModule],
  declarations: [LiveComponent, LiveDetailComponent, LiveUpdateComponent, LiveDeleteDialogComponent],
})
export class LiveModule {}
