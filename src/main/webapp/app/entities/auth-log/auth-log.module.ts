import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AuthLogComponent } from './list/auth-log.component';
import { AuthLogDetailComponent } from './detail/auth-log-detail.component';
import { AuthLogUpdateComponent } from './update/auth-log-update.component';
import { AuthLogDeleteDialogComponent } from './delete/auth-log-delete-dialog.component';
import { AuthLogRoutingModule } from './route/auth-log-routing.module';

@NgModule({
  imports: [SharedModule, AuthLogRoutingModule],
  declarations: [AuthLogComponent, AuthLogDetailComponent, AuthLogUpdateComponent, AuthLogDeleteDialogComponent],
})
export class AuthLogModule {}
